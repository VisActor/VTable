/**
 * 用于将 cms 某路径下错误的示例删除。
 * 1. 会递归删除指定的顶级route下全部内容，包括路径route
 * 准备工作：
 * 1. 确认要上传的地址，请在 cms 上确认要上传的地址。同时在当前地址的页面设置中获取 token ，之后要设置到 Authorization 上。
 * 2. 确认要删除的一级路由名称比如为 example-test
 * 执行脚本: 第一个参数是上传地址，第二个参数是路由名称，第三个参数是 token，不传则使用默认值（默认值不保证可用）
 * node removeExample.js http://urlOfCms route token
 */
const axios = require('axios');
const args = process.argv.slice(2);
const siteUrl = args[0];
const exampleRoutePath = args[1];
const Authorization = args[2] ?? '62265155-f6b3-5241-ad94-7158fe558c4a';
if (!exampleRoutePath) {
  console.log(
    'please enter siteUrl, route and token, command like this: node removeExample.js https://xxx route token'
  );
  process.exit();
}

function exitWithError(msg, ...args) {
  console.log(msg, ...args);
  process.exit();
}

function parseCallBack(data) {
  if (!data) {
    return data;
  }
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  return data;
}

async function prepareTopPath() {
  return new Promise(resolve => {
    // get top path
    axios({
      method: 'get',
      url: siteUrl + 'api/open/site/top',
      headers: { Authorization }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          // check example isExist
          const callBack = parseCallBack(response.data.data);
          const examplePath = callBack.find(d => d.name['2'] === exampleRoutePath);
          if (examplePath) {
            resolve(examplePath);
          } else {
            exitWithError(exampleRoutePath, 'not exist');
          }
        } else {
          exitWithError('prepare example path error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('prepare example path error', error);
      });
  });
}

async function getCurrentRoute(parentInfo) {
  return new Promise(resolve => {
    axios({
      method: 'get',
      url: siteUrl + 'api/open/site/top/' + parentInfo.id,
      headers: { Authorization }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          const callBack = parseCallBack(response.data.data);
          resolve(callBack[0]);
        } else {
          exitWithError('get route error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('get route error', error);
      });
  });
}

async function removeOnRoute(info) {
  return new Promise(resolve => {
    axios({
      method: 'delete',
      url: siteUrl + 'api/open/route/' + info.id,
      headers: { Authorization }
    })
      .then(response => {
        if (response.status === 200 && response.data.code === 0) {
          resolve();
        } else {
          exitWithError('remove error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('remove error ', error);
      });
  });
}

async function removeRouteDeep(routeInfo) {
  console.log(routeInfo);
  if (routeInfo.children && routeInfo.children.length > 0) {
    for (let i = 0; i < routeInfo.children.length; i++) {
      await removeRouteDeep(routeInfo.children[i]);
    }
  }
  console.log('start remove:', routeInfo.fullPath);
  await removeOnRoute(routeInfo);
  console.log('remove success!:', routeInfo.fullPath);
}

async function removeExample() {
  const rootPath = await prepareTopPath();
  console.log('root path ready');
  const routeInfo = await getCurrentRoute(rootPath);
  console.log('routeInfo ready');
  await removeRouteDeep(routeInfo);
  console.log('remove success!');
}
removeExample();
