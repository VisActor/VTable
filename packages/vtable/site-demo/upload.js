/**
 * 用于将 example 上传至 cms 的脚本。会将当前目录下所有 markdown 文件按照目录路径上传至 cms
 * 1. 会保留当前的路径关系。文件夹名称为路径名称，markdown 文件名为文档名
 * 2. 如果想要中文的文件名，请在 cms 上更新
 * 准备工作：
 * 1. 确认要上传的地址，请在 cms 上确认要上传的地址。同时在当前地址的页面设置中获取 token ，之后要设置到 Authorization 上。
 * 2. 确认文件上传到地址里的路由名称比如为 example
 * 执行脚本: 第一个参数是上传地址，第二个参数是路由名称，第三个参数是 token，不传则使用默认值（默认值不保证可用）
 * node upload.js http://urlOfCms route token
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 参数
const args = process.argv.slice(2);
const siteUrl = args[0];
const exampleRoutePath = args[1];
const Authorization = args[2] ?? '62265155-f6b3-5241-ad94-7158fe558c4a';
if (!siteUrl || !exampleRoutePath || !Authorization) {
  console.log('please enter siteUrl, route and token, command like this: node upload.js https://xxx route token');
  process.exit();
}

// 文档站点配置，站点路径，token
// const Authorization = '62265155-f6b3-5241-ad94-7158fe558c4a';
const exampleRoute = {
  name: {
    1: '图表示例',
    2: 'example'
  },
  path: exampleRoutePath,
  fullPath: exampleRoutePath,
  type: 1
};

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

async function readDirAsync(path, dir, directoryCallBack, fillCallBack) {
  const pa = fs.readdirSync(path);
  for (let i = 0; i < pa.length; i++) {
    const ele = pa[i];
    const info = fs.statSync(path + '/' + ele);
    if (info.isDirectory()) {
      await directoryCallBack?.(path + '/' + ele, ele, dir);
      await readDirAsync(path + '/' + ele, [...dir, ele], directoryCallBack, fillCallBack);
    } else {
      await fillCallBack?.(path, ele, dir);
    }
  }
}

async function createRouteInParent(parentInfo, name, type) {
  return new Promise(resolve => {
    axios({
      method: 'post',
      url: siteUrl + 'api/open/route',
      headers: { Authorization },
      data: {
        name: {
          1: name,
          2: name
        },
        p_id: parentInfo.id,
        path: name,
        fullPath: parentInfo.path + '/' + name,
        type
      }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          const callBack = parseCallBack(response.data.data);
          parentInfo.children = parentInfo.children || [];
          parentInfo.children.push(callBack);
          resolve();
        } else {
          exitWithError('create path: ', name, ' error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('create path: ', name, ' error', error);
      });
  });
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
            // create example route
            axios({
              method: 'post',
              url: siteUrl + 'api/open/route',
              headers: { Authorization },
              data: exampleRoute
            })
              .then(response => {
                if (response.status === 200 && response.data.data) {
                  const callBack = parseCallBack(response.data.data);
                  resolve(callBack);
                } else {
                  exitWithError('prepare example path error', response.status, response.statusText);
                }
              })
              .catch(error => {
                exitWithError('prepare example path error', error);
              });
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

function getParentInfoInRoot(rootInfo, dir) {
  if (!dir || dir.length === 0) {
    return rootInfo;
  }
  let tempParent = rootInfo;
  for (let i = 0; i < dir.length; i++) {
    tempParent = tempParent.children.find(info => info.path === dir[i]);
    if (!tempParent) {
      return null;
    }
  }
  return tempParent;
}

async function preparePath(routeInfo) {
  const root = path.join(__dirname);
  await readDirAsync(root, [], async (path, name, dir) => {
    const parentInfo = getParentInfoInRoot(routeInfo, dir);
    if (!parentInfo) {
      return;
    }
    if (parentInfo.children && parentInfo.children.find(r => r.path === name)) {
      return null;
    }
    console.log('start create path: ', [...dir], name);
    await createRouteInParent(parentInfo, name, 1);
    console.log('create path success!: ', [...dir], name);
  });
}

async function _uploadDocument(path, name, dir, docInfo) {
  return new Promise(resolve => {
    // 更新
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      if (!data) {
        data = '';
        console.log('markdown content empty: ', [...dir], name);
        // exitWithError('uploadMarkDown fail in read fill: ', path + '/' + name);
        // return;
      }
      console.log('start upload markdown content: ', [...dir], name);
      axios({
        method: 'put',
        url: siteUrl + `api/open/document/${docInfo.id}/1`,
        headers: { Authorization },
        data: {
          content: data
        }
      })
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            exitWithError('upload markDown fail in path: ', docInfo.id, name);
          }
        })
        .catch(error => {
          exitWithError('upload markDown fail in path: ', docInfo.id, name, error);
        });
    });
  });
}

async function uploadMarkDown(routeInfo) {
  const root = path.join(__dirname);
  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md')) {
      return;
    }
    const parentInfo = getParentInfoInRoot(routeInfo, dir);
    if (!parentInfo) {
      exitWithError('uploadMarkDown fail in path: ', JSON.stringify(dir));
      return;
    }
    const pathName = name.substr(0, name.lastIndexOf('.md'));
    // 如果没有此文档，创建文档
    let docInfo = parentInfo.children?.find(r => r.path === pathName);
    if (!docInfo) {
      console.log('start create markdown: ', [...dir], name);
      await createRouteInParent(parentInfo, pathName, 2);
      console.log('create markdown success!: ', [...dir], name);
      docInfo = parentInfo.children?.find(r => r.path === pathName);
    }
    await _uploadDocument(path, name, dir, docInfo);
    console.log('upload markdown content success!: ', [...dir], name);
  });
}

async function uploadExample() {
  const rootPath = await prepareTopPath();
  console.log('root path ready');
  const routeInfo = await getCurrentRoute(rootPath);
  console.log('routeInfo ready');
  await preparePath(routeInfo);
  console.log('all path ready');
  await uploadMarkDown(routeInfo);
  console.log('all markdown upload');
}
uploadExample();
