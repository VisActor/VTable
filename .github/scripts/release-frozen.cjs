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

// 逐包提交已确认缺失的原包，受理后按同一截止时间回读全批版本、摘要和标签。
async function publishPackages(manifest, out, run, fetchAPI=fetch,
  wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)), now=()=>performance.now()) {
  const {version,tag,packages}=manifest;
  // 35 分钟作业还需下载和校验产物，发布阶段只使用其中 28 分钟。
  const deadline=now()+28*60_000;
  const seen=new Set();
  const remaining=(targets,limit)=>{
    const ms=Math.min(limit,Math.ceil(deadline-now()));
    if(ms<=0)throw new Error('npm 发布结果待核对 '+targets.map(pkg=>pkg.name).join('、'));
    return ms;
  };
  const networkError=cause=>Object.assign(new Error('npm 回读网络错误',{cause}),{retryable:true});
  const read=async (path,signal)=>{
    const response=await fetchAPI(registry+'/'+path,{redirect:'error',signal,headers:{
      accept:'application/vnd.npm.install-v1+json','cache-control':'no-cache'}}).catch(error=>{throw networkError(error);});
    if(response.status===404){await response.body?.cancel();return null;}
    if(!response.ok){
      await response.body?.cancel();
      throw Object.assign(new Error('npm 回读失败 HTTP '+response.status),
        {retryable:response.status===429||response.status>=500});
    }
    return response.json().catch(error=>{
      if(error instanceof SyntaxError&&!signal.aborted)throw new Error('npm 回读 JSON 格式无效 '+path,{cause:error});
      throw networkError(error);
    });
  };
  const parts=value=>value.match(/\d+/g).map(BigInt);
  const newer=(left,right)=>{
    const a=parts(left),b=parts(right);
    const i=b.findIndex((value,index)=>value!==a[index]);
    return i!==-1&&a[i]>b[i];
  };
  const verifyPackage=async (pkg,signal)=>{
    const path=encodeURIComponent(pkg.name);
    const meta=await read(path,signal);
    if(meta?.name!==pkg.name||!meta.versions||typeof meta.versions!=='object'||Array.isArray(meta.versions)||
      !stable.test(meta['dist-tags']?.latest))
      throw new Error('npm 标签或包名不符 '+pkg.name);
    const latest=meta['dist-tags'].latest,current=meta['dist-tags'][tag];
    const listed=Object.hasOwn(meta.versions,version);
    const listedIntegrity=listed?meta.versions[version]?.dist?.integrity:undefined;
    if(listed||current===version)seen.add(pkg.name);
    if(listedIntegrity!==undefined&&listedIntegrity!==pkg.integrity)
      throw new Error('已发布包与原字节冲突 '+pkg.name);
    const exact=await read(path+'/'+version,signal);
    if(exact)seen.add(pkg.name);
    if(exact&&(exact.name!==pkg.name||exact.version!==version||exact.dist?.integrity!==pkg.integrity))
      throw new Error('已发布包与原字节冲突 '+pkg.name);
    if(exact&&listed&&current===version)return 'published';
    if(current!==version&&(!newer(version,latest)||
      tag==='alpha'&&current!==undefined&&(!alpha.test(current)||!newer(version,current))))
      throw new Error('npm 目标标签不能后退 '+pkg.name);
    return exact||listed||current===version?'pending':'missing';
  };
  // 未确认的包并行回读，整批通过前再核对一轮已通过的包，捕获等待期间的标签变化。
  const observe=async (targets,allowMissing=false)=>{
    let outstanding=targets;
    const published=new Set();
    while(outstanding.length){
      const timeout=remaining(outstanding,15_000);
      const states=await Promise.all(outstanding.map(async pkg=>{
        try{return await verifyPackage(pkg,AbortSignal.timeout(timeout));}
        catch(error){if(!error.retryable)throw error;return 'retry';}
      }));
      const pending=outstanding.filter((pkg,index)=>{
        if(states[index]==='published'){published.add(pkg.name);return false;}
        return states[index]!=='missing'||!allowMissing||seen.has(pkg.name);
      });
      if(!pending.length&&!allowMissing&&outstanding.length!==targets.length){
        outstanding=targets;
        continue;
      }
      outstanding=pending;
      if(outstanding.length)await wait(remaining(outstanding,5000));
    }
    return published;
  };
  // 首次写入前核对全批，之后逐包再核对。只有明确受理的提交可以推迟到批量回读。
  await observe(packages,true);
  for(const pkg of packages){
    if((await observe([pkg],true)).has(pkg.name))continue;
    const path=join(out,pkg.file);
    if(integrityOf(readFileSync(path))!==pkg.integrity)throw new Error('原包字节变化 '+pkg.name);
    const timeout=remaining([pkg],60_000);
    try {
      run('npm',['publish',path,'--ignore-scripts','--access','public','--registry='+registry,'--tag',tag,
        '--fetch-retries=0','--fetch-timeout=30000'],{stdio:'inherit',timeout});
    }catch {
      // 响应丢失时只回读原版本，收到证据前不继续写其他包。
      console.log('npm 提交未确认，回读原版本 '+pkg.name);
      await observe([pkg]);
      continue;
    }
    console.log('npm 已受理，等待版本与标签可见 '+pkg.name);
  }
  await observe(packages);
}

// 重跑只快进原分支；正式版源分支已删除时，仅已合入的原 PR 能证明收尾。
function finalize(manifest, run) {
  const {ref,releaseSha,sourceSha,version,tag}=manifest;
  const remote=run('git',['ls-remote','--refs','origin',ref]).trim();
  const rows=remote.split(/\s+/);
  if(remote&&(rows.length!==2||rows[1]!==ref||![sourceSha,releaseSha].includes(rows[0])))throw new Error('原发版分支不符');
  const head=ref.slice('refs/heads/'.length);
  const prs=tag==='alpha'?[]:JSON.parse(run('gh',['pr','list','--repo',repository,'--base','main','--head',head,'--state','all',
    '--limit','2','--json','headRefOid,state,author']));
  if(!Array.isArray(prs)||prs.length>1||prs.length===1&&(prs[0].headRefOid!==releaseSha||!['OPEN','MERGED'].includes(prs[0].state)||
    !['github-actions[bot]','github-actions','app/github-actions'].includes(prs[0].author?.login)))throw new Error('原产品 PR 不符');
  if(!remote){
    if(prs[0]?.state==='MERGED')return;
    throw new Error('原发版分支不存在且没有已合入的原产品 PR');
  }
  if(rows[0]===sourceSha)run('git',['-c','core.hooksPath=/dev/null','push','--force-with-lease='+ref+':'+sourceSha,'origin',releaseSha+':'+ref],{stdio:'inherit'});
  if(tag==='latest'&&!prs.length)run('gh',['pr','create','--repo',repository,'--base','main','--head',head,
    '--title','[Auto release] release '+version,'--body','Release '+version+' from '+releaseSha],{stdio:'inherit'});
}

// CI 作业在受保护环境通过后才开始；Actions 只读令牌仅用于检查原运行的审批回执。
async function verifyRecovery(env,fetchAPI) {
  const attempt=Number(env.GITHUB_RUN_ATTEMPT);
  if(!Number.isSafeInteger(attempt)||attempt<1)throw new Error('发布 attempt 无效');
  if(attempt===1)return;
  const runId=Number(env.GITHUB_RUN_ID),actor=env.GITHUB_TRIGGERING_ACTOR;
  if(!env.GH_TOKEN||!Number.isSafeInteger(runId)||runId<1||!actor)throw new Error('缺少原恢复运行身份');
  const response=await fetchAPI('https://api.github.com/repos/'+repository+'/actions/runs/'+runId+'/approvals',{
    redirect:'error',signal:AbortSignal.timeout(15000),headers:{
      authorization:'Bearer '+env.GH_TOKEN,accept:'application/vnd.github+json'}});
  if(!response.ok)throw new Error('原恢复审批回执无法核验');
  const reviews=await response.json();
  // 绑定已配置的环境 ID，避免删除后重建同名无保护环境时复用旧审批。
  if(!Array.isArray(reviews)||!reviews.some(review=>review.state==='approved'&&
     typeof review.user?.login==='string'&&review.user.login.toLowerCase()!==actor.toLowerCase()&&
     review.environments?.some(environment=>environment.id===27713480379&&environment.name==='vtable-release-recovery')))
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
