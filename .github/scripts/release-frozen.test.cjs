const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { basename, join } = require('node:path');
const { tmpdir } = require('node:os');
const { releaseContext, prepare, verify, publishPackages, finalize } = require('./release-frozen.cjs');
const expected = require('./release-packages.json');

const repo='VisActor/VTable';
const integrity=bytes=>'sha512-'+createHash('sha512').update(bytes).digest('base64');

function fixture(t, version) {
  const dir=mkdtempSync(join(tmpdir(),'release-frozen-test-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const root=join(dir,'source'),out=join(dir,'artifacts'), pack=join(dir,'pack');
  mkdirSync(root);
  mkdirSync(join(pack,'package'),{recursive:true});
  const run=(command,args,options={})=>execFileSync(command,args,{cwd:root,encoding:'utf8',stdio:'pipe',
    ...options,...(command==='git'&&args.includes('commit')&&{stdio:'pipe'})});
  run('git',['init','--quiet']);
  run('git',['config','user.name','fixture']);
  run('git',['config','user.email','fixture@example.invalid']);
  const config={projects:expected.map(pkg=>({packageName:pkg.name,projectFolder:pkg.folder,shouldPublish:true}))};
  writeFileSync(join(root,'rush.json'),JSON.stringify(config));
  writeFileSync(join(root,'version'),'original\n');
  run('git',['add','.']);
  run('git',['commit','-m','original']);
  const sourceSha=run('git',['rev-parse','HEAD']).trim();
  writeFileSync(join(root,'version'),version+'\n');
  const type=version.includes('-alpha.')?'pre-release':'release';
  const ref='refs/heads/'+type+'/'+version;
  const context=releaseContext({GITHUB_REPOSITORY:repo,GITHUB_EVENT_NAME:'push',GITHUB_REF:ref,GITHUB_SHA:sourceSha,GITHUB_RUN_ID:'77',RELEASE_ARTIFACT_DIR:out});
  prepare(context,out,(command,args,options)=>{
    if(command!=='pnpm')return run(command,args,options);
    const pkg=expected.find(package=>join(root,package.folder)===options.cwd);
    assert(pkg);
    writeFileSync(join(pack,'package/package.json'),JSON.stringify({name:pkg.name,version}));
    run('tar',['-czf',join(out,pkg.name.slice(1).replace('/','-')+'-'+version+'.tgz'),'-C',pack,'package/package.json']);
  },root);
  return {out,run,root,context,manifest:verify(context,out,run)};
}

function registry(manifest, preexisting) {
  const stored=new Map(preexisting.map(pkg=>[pkg.name,pkg.integrity]));
  const calls=[];
  const fetchAPI=async input=>{
    const [segment,version]=new URL(input).pathname.slice(1).split('/');
    const name=decodeURIComponent(segment),digest=stored.get(name);
    if(version)return digest?Response.json({name,version,dist:{integrity:digest}}):new Response(null,{status:404});
    const tags={latest:'1.26.8',...(digest&&{[manifest.tag]:manifest.version})};
    return Response.json({name,'dist-tags':tags,versions:digest?{[manifest.version]:{}}:{}});
  };
  const publish=(command,args)=>{
    assert.equal(command,'npm');
    assert.equal(args[0],'publish');
    assert.equal(args[args.indexOf('--tag')+1],manifest.tag);
    const pkg=manifest.packages.find(item=>item.file===basename(args[1]));
    assert(pkg);
    assert.equal(stored.has(pkg.name),false);
    const digest=integrity(readFileSync(args[1]));
    assert.equal(digest,pkg.integrity);
    calls.push(pkg.name);
    stored.set(pkg.name,digest);
    if(calls.length===1)throw new Error('registry accepted, reply lost');
  };
  return {stored,calls,fetchAPI,publish};
}

for(const version of ['1.26.9','1.26.9-alpha.1']){
  test('冻结 '+version+' 原 11 包，恢复仅补缺包并保留原提交',async t=>{
    const {out,run,context,manifest}=fixture(t,version);
    assert.deepEqual(verify(context,out,run),manifest);
    const mirror=registry(manifest,manifest.packages.slice(0,7));
    await publishPackages(manifest,out,mirror.publish,mirror.fetchAPI);
    assert.deepEqual(mirror.calls,manifest.packages.slice(7).map(pkg=>pkg.name));
    await publishPackages(manifest,out,mirror.publish,mirror.fetchAPI);
    assert.equal(mirror.calls.length,4);
    const item=join(out,manifest.packages[0].file);
    writeFileSync(item,'bad');
    assert.throws(()=>verify(context,out,run));
  });
}

test('原包冲突在补写其他包前阻断，收尾只推一次并回读已合入 PR',async t=>{
  const {out,manifest}=fixture(t,'1.26.9');
  const mirror=registry(manifest,[manifest.packages.at(-1)]);
  mirror.stored.set(manifest.packages.at(-1).name,'incorrect');
  await assert.rejects(publishPackages(manifest,out,mirror.publish,mirror.fetchAPI),/原字节冲突/);
  assert.deepEqual(mirror.calls,[]);
  let head=manifest.sourceSha,prHead;
  let pr=false,pushes=0,creations=0;
  const platform=(command,args)=>{
    if(args[0]==='ls-remote')return head?head+'\t'+manifest.ref:'';
    if(args.includes('push')){
      assert(args.includes('--force-with-lease='+manifest.ref+':'+manifest.sourceSha));
      head=manifest.releaseSha;pushes++;return '';
    }
    assert.equal(command,'gh');
    if(args[1]==='list')return JSON.stringify(pr?[{headRefOid:prHead,state:'MERGED',author:{login:'app/github-actions'}}]:[]);
    pr=true;prHead=head;creations++;return '';
  };
  finalize(manifest,platform);
  finalize(manifest,platform);
  head=null;
  finalize(manifest,platform);
  pr=false;
  assert.throws(()=>finalize(manifest,platform),/没有已合入的原产品 PR/);
  assert.equal(pushes,1);
  assert.equal(creations,1);
});

test('恢复仅用 Actions 读权限核验原 run，拒绝无审批、自审和重建的同名环境',async()=>{
  const {verifyRecovery}=require('./release-frozen.cjs');
  const env={GITHUB_RUN_ATTEMPT:'2',GITHUB_RUN_ID:'77',GITHUB_TRIGGERING_ACTOR:'maintainer',GH_TOKEN:'fixture'};
  const environment={id:27713480379,name:'vtable-release-recovery'};
  let reviews=[];
  const api=async url=>{
    assert.equal(url,'https://api.github.com/repos/VisActor/VTable/actions/runs/77/approvals');
    return Response.json(reviews);
  };
  await assert.rejects(verifyRecovery(env,api),/审核回执/);
  reviews=[{state:'approved',user:{login:'MAINTAINER'},environments:[environment]}];
  await assert.rejects(verifyRecovery(env,api),/审核回执/);
  reviews[0].user.login='reviewer';
  reviews[0].environments=[{...environment,id:1}];
  await assert.rejects(verifyRecovery(env,api),/审核回执/);
  reviews[0].environments=[environment];
  await verifyRecovery(env,api);
  await verifyRecovery({...env,GITHUB_RUN_ATTEMPT:'1'},()=>assert.fail('首次运行无需回读恢复审核'));
});
