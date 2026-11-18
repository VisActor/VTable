const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { mkdirSync, readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { isAbsolute, join } = require('node:path');
const expected = require('./release-packages.json');

const repository = 'VisActor/VTable';
const registry = 'https://registry.npmjs.org';
const sha = /^[a-f0-9]{40}$/;
const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const alpha = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-alpha\.(0|[1-9]\d*)$/;
const readJSON = file => JSON.parse(readFileSync(file, 'utf8'));
const integrityOf = bytes => 'sha512-' + createHash('sha512').update(bytes).digest('base64');

// 只接受运行所在的正式版或 Alpha 分支，从 GitHub 上下文取原 SHA 和 run。
function releaseContext(env) {
  const ref = env.GITHUB_REF, sourceSha = env.GITHUB_SHA, runId = Number(env.GITHUB_RUN_ID);
  const isStable = ref?.startsWith('refs/heads/release/');
  const version = ref?.slice(isStable ? 19 : 23);
  if (env.GITHUB_REPOSITORY !== repository || env.GITHUB_EVENT_NAME !== 'push' || !sha.test(sourceSha) ||
      !Number.isSafeInteger(runId) || runId < 1 || !isAbsolute(env.RELEASE_ARTIFACT_DIR ?? '') ||
      (isStable ? !stable.test(version) : !ref?.startsWith('refs/heads/pre-release/') || !alpha.test(version)))
    throw new Error('发布事件、分支或目录不符');
  return {schema: 1, repository, ref, version, tag: isStable ? 'latest' : 'alpha', sourceSha, runId, runAttempt: 1};
}

// 核对原 tarball 包名、版本和内部依赖，返回固定文件及字节摘要。
function packageEvidence(out, pkg, version, run) {
  const file = pkg.name.slice(1).replace('/', '-') + '-' + version + '.tgz';
  const path = join(out, file);
  const metadata = JSON.parse(run('tar', ['-xOf', path, 'package/package.json'], {maxBuffer: 1024 ** 2}));
  if (metadata.name !== pkg.name || metadata.version !== version) throw new Error('包名或版本不符 ' + pkg.name);
  for (const dependencies of [metadata.dependencies,metadata.optionalDependencies,metadata.peerDependencies]) {
    for (const [name,range] of Object.entries(dependencies??{})) {
      if (range.startsWith('workspace:') || expected.some(item=>item.name===name) && range!==version)
        throw new Error('包依赖与冻结版本不符 ' + pkg.name);
    }
  }
  return {name:pkg.name,file,integrity:integrityOf(readFileSync(path))};
}

// 在首次 attempt 生成唯一发版提交和原始包。收尾从 bundle 恢复该提交。
function prepare(context, out, run, root) {
  const {sourceSha,version,tag}=context;
  if (run('git',['rev-parse','HEAD']).trim()!==sourceSha)throw new Error('准备提交的父提交不符');
  const projects=readJSON(join(root,'rush.json')).projects.filter(pkg=>pkg.shouldPublish)
    .map(pkg=>({name:pkg.packageName,folder:pkg.projectFolder})).sort((a,b)=>a.name.localeCompare(b.name));
  if (JSON.stringify(projects)!==JSON.stringify(expected))throw new Error('Rush 发布包全集不符');
  const message='build: '+(tag==='latest'?'release':'prerelease')+' version '+version+' [skip ci]';
  run('git',['add','-u']);
  run('git',['-c','core.hooksPath=/dev/null','commit','-m',message],{stdio:'inherit'});
  const releaseSha=run('git',['rev-parse','HEAD']).trim();
  mkdirSync(out,{recursive:true,mode:0o700});
  const packages=expected.map(pkg=>{
    run('pnpm',['pack','--pack-destination',out],{cwd:join(root,pkg.folder),stdio:'inherit'});
    return packageEvidence(out,pkg,version,run);
  });
  run('git',['bundle','create',join(out,'prepared.bundle'),'HEAD','^'+sourceSha]);
  writeFileSync(join(out,'manifest.json'),JSON.stringify({...context,releaseSha,packages})+'\n',{mode:0o600});
}

// 重跑只读取首次准备产物，完整比对所有包和发版提交。
function verify(context, out, run) {
  const manifest=readJSON(join(out,'manifest.json'));
  if(Object.entries(context).some(([key,value])=>manifest[key]!==value)||!sha.test(manifest.releaseSha)||
    manifest.releaseSha===context.sourceSha)throw new Error('原发布清单绑定不符');
  const packages=expected.map(pkg=>packageEvidence(out,pkg,context.version,run));
  if(JSON.stringify(packages)!==JSON.stringify(manifest.packages)||
    JSON.stringify(readdirSync(out).filter(file=>file.endsWith('.tgz')).sort())!==JSON.stringify(packages.map(pkg=>pkg.file).sort()))
    throw new Error('原发布包摘要或全集不符');
  run('git',['bundle','verify',join(out,'prepared.bundle')]);
  run('git',['fetch','--no-tags',join(out,'prepared.bundle'),'HEAD']);
  if(run('git',['rev-parse','FETCH_HEAD']).trim()!==manifest.releaseSha||
    run('git',['rev-list','--parents','-n','1',manifest.releaseSha]).trim()!==manifest.releaseSha+' '+context.sourceSha)
    throw new Error('原发版提交来源不符');
  return manifest;
}

// 精确版本 404 才可以尝试发包。包已存在时核对原摘要和标签。
async function publishPackages(manifest, out, run, fetchAPI=fetch, wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))) {
  const {version,tag,packages}=manifest;
  const read=async path=>{
    const response=await fetchAPI(registry+'/'+path,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{
      accept:'application/vnd.npm.install-v1+json','cache-control':'no-cache'}});
    if(response.status===404){await response.body?.cancel();return null;}
    if(!response.ok){await response.body?.cancel();throw new Error('npm 回读失败 HTTP '+response.status);}
    return response.json();
  };
  const verifyPackage=async pkg=>{
    const meta=await read(encodeURIComponent(pkg.name));
    if(meta?.name!==pkg.name||!meta.versions||!stable.test(meta['dist-tags']?.latest))
      throw new Error('npm 标签或包名不符 '+pkg.name);
    const exact=await read(encodeURIComponent(pkg.name)+'/'+version);
    if(!exact){
      if(Object.hasOwn(meta.versions,version))throw new Error('npm 精确版本与包目录不一致 '+pkg.name);
      const latest=meta['dist-tags'].latest, current=meta['dist-tags'][tag];
      const parts=value=>value.match(/\d+/g).map(BigInt);
      const newer=(left,right)=>{const a=parts(left),b=parts(right);const i=b.findIndex((value,index)=>value!==a[index]);return i!==-1&&a[i]>b[i];};
      if(!newer(version,latest)||tag==='alpha'&&current!==undefined&&(!alpha.test(current)||!newer(version,current)))
        throw new Error('npm 目标标签不能后退 '+pkg.name);
      return false;
    }
    if(exact.name!==pkg.name||exact.version!==version||exact.dist?.integrity!==pkg.integrity)
      throw new Error('已发布包与原字节冲突 '+pkg.name);
    if(meta['dist-tags'][tag]!==version)throw new Error('npm 目标标签与原发布不符 '+pkg.name);
    return true;
  };
  // 写入前先检查整个集合，拒绝部分包标签或字节已冲突的恢复。
  for(const pkg of packages)await verifyPackage(pkg);
  for(const pkg of packages){
    if(await verifyPackage(pkg))continue;
    const path=join(out,pkg.file);
    if(integrityOf(readFileSync(path))!==pkg.integrity)throw new Error('原包字节变化 '+pkg.name);
    try {
      run('npm',['publish',path,'--ignore-scripts','--access','public','--registry='+registry,'--tag',tag,
        '--fetch-retries=0','--fetch-timeout=30000'],{stdio:'inherit',timeout:60000});
    }catch { /* 以 npm 精确版本回读判断是否受理。 */ }
    let accepted=false;
    for(const delay of [0,2000,6000]){
      if(delay)await wait(delay);
      if(await verifyPackage(pkg)){accepted=true;break;}
    }
    if(!accepted)throw new Error('npm 发布结果待核对 '+pkg.name);
  }
}

// 重跑只快进原分支并回读唯一产品 PR，已合入的原 PR 同样可恢复收尾。
function finalize(manifest, run) {
  const {ref,releaseSha,sourceSha,version,tag}=manifest;
  const rows=run('git',['ls-remote','--refs','origin',ref]).trim().split(/\s+/);
  if(rows.length!==2||rows[1]!==ref||![sourceSha,releaseSha].includes(rows[0]))throw new Error('原发版分支不符');
  if(rows[0]===sourceSha)run('git',['-c','core.hooksPath=/dev/null','push','--force-with-lease='+ref+':'+sourceSha,'origin',releaseSha+':'+ref],{stdio:'inherit'});
  if(tag==='alpha')return;
  const head=ref.slice('refs/heads/'.length);
  const prs=JSON.parse(run('gh',['pr','list','--repo',repository,'--base','main','--head',head,'--state','all',
    '--limit','2','--json','headRefOid,state,author']));
  if(prs.length>1||prs.length===1&&(prs[0].headRefOid!==releaseSha||!['OPEN','MERGED'].includes(prs[0].state)||
    !['github-actions[bot]','github-actions','app/github-actions'].includes(prs[0].author?.login)))throw new Error('原产品 PR 不符');
  if(!prs.length)run('gh',['pr','create','--repo',repository,'--base','main','--head',head,
    '--title','[Auto release] release '+version,'--body','Release '+version+' from '+releaseSha],{stdio:'inherit'});
}

// 重跑写入前再次确认恢复环境已配置审核，避免平台自动创建无保护环境。
async function verifyRecovery(env,fetchAPI) {
  const attempt=Number(env.GITHUB_RUN_ATTEMPT);
  if(!Number.isSafeInteger(attempt)||attempt<1)throw new Error('发布 attempt 无效');
  if(attempt===1)return;
  if(!env.GH_TOKEN)throw new Error('缺少恢复环境只读身份');
  const base='https://api.github.com/repos/'+repository;
  const read=async path=>{
    const response=await fetchAPI(base+path,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{
      authorization:'Bearer '+env.GH_TOKEN,accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error('恢复环境无法核验');
    return response.json();
  };
  const settings=await read('/environments/vtable-release-recovery');
  const reviews=await read('/actions/runs/'+Number(env.GITHUB_RUN_ID)+'/approvals');
  if(settings.name!=='vtable-release-recovery'||settings.can_admins_bypass===true||
     !settings.protection_rules?.some(rule=>rule.type==='required_reviewers'&&rule.reviewers?.length)||
     !Array.isArray(reviews)||!reviews.some(review=>review.state==='approved'&&
       review.environments?.some(environment=>environment.id===settings.id&&environment.name===settings.name)))
    throw new Error('恢复运行缺少受保护环境的审核回执');
}

// CI CLI 仅允许规定阶段。恢复 attempt 一律消费原始准备产物。
async function main({phase=process.argv[2],env=process.env,root=process.cwd(),execute=execFileSync,fetchAPI=fetch}={}){
  const context=releaseContext(env),out=env.RELEASE_ARTIFACT_DIR;
  const run=(command,args,options={})=>execute(command,args,{cwd:root,encoding:'utf8',stdio:'pipe',...options});
  if(phase==='prepare'){
    if(env.GITHUB_RUN_ATTEMPT!=='1')throw new Error('首次准备产物不能重建');
    return prepare(context,out,run,root);
  }
  if(!['publish','finalize'].includes(phase))throw new Error('未知发布阶段');
  await verifyRecovery(env,fetchAPI);
  const manifest=verify(context,out,run);
  if(phase==='publish')return publishPackages(manifest,out,run,fetchAPI);
  return finalize(manifest,run);
}

module.exports={releaseContext,prepare,verify,publishPackages,finalize,verifyRecovery};
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
