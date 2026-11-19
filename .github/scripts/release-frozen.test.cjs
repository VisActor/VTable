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

// 模拟 registry，以冻结包为准线来记录每次实际提交。
function registry(manifest, preexisting, loseReply=true) {
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
    if(loseReply&&calls.length===1)throw new Error('registry accepted, reply lost');
  };
  return {stored,calls,fetchAPI,publish};
}

for(const version of ['1.26.9','1.26.9-alpha.1']){
  test('冻结 '+version+' 原 11 包，恢复仅补缺包并保留原提交',async t=>{
    const {out,run,context,manifest}=fixture(t,version);
    assert.deepEqual(verify(context,out,run),manifest);
    const mirror=registry(manifest,manifest.packages.slice(0,7),manifest.tag==='latest');
    const old=registry(manifest,manifest.packages.slice(0,7));
    const delayed=manifest.packages[7].name;
    let elapsed=0;
    const fetchAPI=async url=>{
      const [pkg,exact]=new URL(url).pathname.slice(1).split('/');
      if(decodeURIComponent(pkg)!==delayed||!mirror.calls.length)return mirror.fetchAPI(url);
      if(elapsed===0)return new Response(null,{status:503});
      if(elapsed<30_000)return old.fetchAPI(url);
      const response=await mirror.fetchAPI(url);
      if(exact||elapsed>=55_000)return response;
      const meta=await response.json();
      meta['dist-tags']=(await (await old.fetchAPI(url)).json())['dist-tags'];
      return Response.json(meta);
    };
    await publishPackages(manifest,out,mirror.publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed);
    assert.equal(elapsed,55_000);
    assert.deepEqual(mirror.calls,manifest.packages.slice(7).map(pkg=>pkg.name));
    await publishPackages(manifest,out,mirror.publish,mirror.fetchAPI);
    assert.equal(mirror.calls.length,4);
    const item=join(out,manifest.packages[0].file);
    writeFileSync(item,'bad');
    assert.throws(()=>verify(context,out,run));
  });
}

test('包已在目录出现但精确版本暂不可见，只等待原包',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.1');
  const mirror=registry(manifest,manifest.packages);
  const first=manifest.packages[0].name;
  const stale=registry(manifest,[]);
  let elapsed=0;
  const fetchAPI=async url=>{
    if(url.endsWith(encodeURIComponent(first)+'/'+manifest.version)&&elapsed===0)
      return new Response(null,{status:503});
    if(url.includes(encodeURIComponent(first))&&elapsed<35_000)return elapsed===0?mirror.fetchAPI(url):stale.fetchAPI(url);
    return mirror.fetchAPI(url);
  };
  await publishPackages(manifest,out,mirror.publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed);
  assert.equal(elapsed,35_000);
  assert.deepEqual(mirror.calls,[]);
});

test('同一次运行已核实的包后来返回 404，也不重复提交',async t=>{
  const {out,manifest}=fixture(t,'1.26.9');
  const mirror=registry(manifest,manifest.packages);
  const stale=registry(manifest,[]);
  const path=encodeURIComponent(manifest.packages[0].name);
  let elapsed=0,reads=0;
  const fetchAPI=async url=>{
    if(new URL(url).pathname.split('/')[1]===path&&++reads>2&&elapsed<5000)return stale.fetchAPI(url);
    return mirror.fetchAPI(url);
  };
  await publishPackages(manifest,out,mirror.publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed);
  assert.equal(elapsed,5000);
  assert.deepEqual(mirror.calls,[]);
});

test('模拟 alpha.3：第三个包超过 5 分钟才可见，仍完成全批 11 个包',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[],false);
  const stale=registry(manifest,[]);
  const delayed='@visactor/vtable', submittedAt=new Map();
  let elapsed=0;
  const publish=(...args)=>{
    mirror.publish(...args);
    submittedAt.set(mirror.calls.at(-1),elapsed);
  };
  const fetchAPI=async url=>{
    const [path,version]=new URL(url).pathname.slice(1).split('/');
    const name=decodeURIComponent(path), age=elapsed-(submittedAt.get(name)??Infinity);
    if(age<(name===delayed?310_000:90_000))return stale.fetchAPI(url);
    const response=await mirror.fetchAPI(url);
    if(name!==delayed||version||age>=330_000)return response;
    const meta=await response.json();
    meta['dist-tags']=(await (await stale.fetchAPI(url)).json())['dist-tags'];
    return Response.json(meta);
  };
  await publishPackages(manifest,out,publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed);
  assert.equal(elapsed,330_000);
  assert.deepEqual(mirror.calls,manifest.packages.map(pkg=>pkg.name));
  assert.deepEqual(new Set(submittedAt.values()),new Set([0]));
});

test('共享等待窗口耗尽只报告未核对的包，已受理的包均只提交一次',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[],false);
  const invisible=registry(manifest,[]);
  const remaining=manifest.packages.slice(-2).map(pkg=>pkg.name);
  let elapsed=0;
  const fetchAPI=url=>remaining.includes(decodeURIComponent(new URL(url).pathname.split('/')[1]))
    ?invisible.fetchAPI(url):mirror.fetchAPI(url);
  await assert.rejects(publishPackages(manifest,out,mirror.publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed),
    {message:'npm 发布结果待核对 '+remaining.join('、')});
  assert.equal(elapsed,28*60_000);
  assert.deepEqual(mirror.calls,manifest.packages.map(pkg=>pkg.name));
});

test('npm 明确拒绝时原地报出包名和错误码，不等待、不继续提交',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[]);
  for(const code of ['E403','E401','ENEEDAUTH','EOTP','E429']){
    let attempts=0;
    const publish=(_command,args,options)=>{
      attempts++;
      assert.ok(args.includes('--json'));
      assert.equal(options.stdio[1],'pipe');
      throw Object.assign(new Error('npm 已退出'),{status:1,
        stdout:JSON.stringify({error:{code,summary:'registry denied',detail:'fixture-only detail'}})});
    };
    await assert.rejects(publishPackages(manifest,out,publish,mirror.fetchAPI,
      ()=>assert.fail('明确拒绝不应等待')),{message:'npm 拒绝发布 '+manifest.packages[0].name+' ('+code+')'});
    assert.equal(attempts,1);
  }
});

test('npm 返回同版本已存在时仍核对原包，确认摘要后继续',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[],false);
  const [first]=manifest.packages;
  let elapsed=0;
  const publish=(...args)=>{
    mirror.publish(...args);
    if(mirror.calls.length===1)throw Object.assign(new Error('npm 已退出'),{status:1,
      stdout:JSON.stringify({error:{code:'E403',summary:'You cannot publish over the previously published versions: '+manifest.version}})});
    assert.equal(elapsed,15_000);
  };
  const fetchAPI=async url=>url.endsWith(encodeURIComponent(first.name)+'/'+manifest.version)&&elapsed<15_000
    ?new Response(null,{status:404}):mirror.fetchAPI(url);
  await publishPackages(manifest,out,publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed);
  assert.deepEqual(mirror.calls,manifest.packages.map(pkg=>pkg.name));
});

test('提交响应不明且一直不可见，只回读原包并阻断后续写入',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[]);
  const invisible=registry(manifest,[]);
  let elapsed=0;
  const [first]=manifest.packages;
  await assert.rejects(publishPackages(manifest,out,mirror.publish,invisible.fetchAPI,
    async ms=>{elapsed+=ms;},()=>elapsed),{message:'npm 发布结果待核对 '+first.name});
  assert.equal(elapsed,28*60_000);
  assert.deepEqual(mirror.calls,[first.name]);
});

test('全批收尾前重新核对等待期间发生的标签变化',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.3');
  const mirror=registry(manifest,[],false);
  const stale=registry(manifest,[]);
  const first=manifest.packages[0].name,last=manifest.packages.at(-1).name;
  let elapsed=0;
  const fetchAPI=async url=>{
    const [path,exact]=new URL(url).pathname.slice(1).split('/');
    const name=decodeURIComponent(path);
    if(name===last&&elapsed<310_000)return stale.fetchAPI(url);
    const response=await mirror.fetchAPI(url);
    if(name!==first||exact||elapsed<310_000)return response;
    const meta=await response.json();
    meta['dist-tags'].alpha='1.26.9-alpha.4';
    return Response.json(meta);
  };
  await assert.rejects(publishPackages(manifest,out,mirror.publish,fetchAPI,async ms=>{elapsed+=ms;},()=>elapsed),
    {message:'npm 目标标签不能后退 '+first});
  assert.equal(elapsed,310_000);
  assert.equal(mirror.calls.length,11);
});

test('目标标签已前进时停止，保留原发布包',async t=>{
  const {out,manifest}=fixture(t,'1.26.9-alpha.1');
  const mirror=registry(manifest,manifest.packages);
  const conflict=manifest.packages.at(-1).name;
  const fetchAPI=async url=>{
    const response=await mirror.fetchAPI(url);
    if(!url.endsWith('/'+encodeURIComponent(conflict)))return response;
    const meta=await response.json();
    meta['dist-tags'].alpha='1.26.9-alpha.2';
    return Response.json(meta);
  };
  await assert.rejects(publishPackages(manifest,out,mirror.publish,fetchAPI),/目标标签不能后退/);
  assert.deepEqual(mirror.calls,[]);
});

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
