const nodeFetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const host = `https://bug-server.zijieapi.com`;
const commonHeader = {};
const PRODUCT = 'VisActor/VTable';
const CHECK_SCM_BUILD_INTERVAL_MS = 10 * 1000;
const CHECK_SCM_BUILD_MAX_COUNT = 30;
const CHECK_PHOTO_TEST_INTERVAL_MS = 10 * 1000;
const CHECK_PHOTO_TEST_MAX_COUNT = 30;

const fetch = async (url, options) => {
  const newOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...commonHeader
    }
  };
  const result = await nodeFetch(url, newOptions);
  const json = await result.json();
  if (json.code === -1) {
    console.log(`request url: ${url}`);
    throw new Error(`Request Fail, msg: ${json.msg}`);
  }
  return json;
};

const getFormData = data => {
  const formData = new FormData({ readable: true });
  formData.append('product', PRODUCT);
  formData.append('token', process.env.BUG_SERVER_TOKEN);
  Object.entries(data).forEach(([key, value]) => {
    if (key) {
      formData.append(key, value ?? '');
    }
  });
  return formData;
};

async function uploadFile() {
  console.log(`file path: ${path.resolve(process.cwd(), `dist/vtable.js.js`)}`);
  const formData = getFormData({
    bundleFile: fs.createReadStream(path.resolve(process.cwd(), `dist/vtable.js.js`)),
    triggerType: 'upload-file'
  });
  const res = await fetch(`${host}/api/ci/trigger`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders()
    },
    body: formData
  });
  return res;
}

async function triggerScmBuild({ fileUrl }) {
  const formData = getFormData({
    triggerType: 'scm-build',
    fileUrl: fileUrl,
    createUser: process.env.GITHUB_ACTOR ?? ''
  });

  const res = await fetch(`${host}/api/ci/trigger`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders()
    },
    body: formData
  });
  return res;
}

async function getScmVersionInfo({ scmVersion }) {
  const formData = getFormData({
    triggerType: 'scm-version-info',
    scmVersion
  });

  const res = await fetch(`${host}/api/ci/trigger`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders()
    },
    body: formData
  });

  console.log(`getScmVersionInfo result: ${JSON.stringify(res)}`);
  return res;
}

async function waitUntilScmBuildOK({ scmVersion }) {
  let count = 0;

  return await new Promise(resolve => {
    const interval = setInterval(async () => {
      count++;
      const {
        data: { status }
      } = await getScmVersionInfo({ scmVersion });
      // build_ok/build_failed/building/prepare
      if (['build_ok', 'build_failed'].includes(status) || count > CHECK_SCM_BUILD_MAX_COUNT) {
        resolve({ status });
        clearInterval(interval);
      }
    }, CHECK_SCM_BUILD_INTERVAL_MS);
  });
}

async function triggerPhotoTest({ scmVersion, scmVersionStatus }) {
  const formData = getFormData({
    triggerType: 'photo-test',
    scmVersion: scmVersion,
    scmVersionStatus: scmVersionStatus,
    commitId: process.env.GITHUB_SHA ?? '',
    commitUrl: process.env.GITHUB_REF ?? '',
    commitBranchName: process.env.GITHUB_HEAD_REF ?? '',
    commitCreateUser: process.env.GITHUB_ACTOR ?? '',
    commitDescription: ''
  });

  const res = await fetch(`${host}/api/ci/trigger`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders()
    },
    body: formData
  });
  return res;
}

async function getPhotoResult({ scmVersion, bundleId }) {
  const formData = getFormData({
    triggerType: 'photo-result',
    scmVersion,
    bundleId
  });

  const res = await fetch(`${host}/api/ci/trigger`, {
    method: 'POST',
    headers: {
      ...formData.getHeaders()
    },
    body: formData
  });

  console.log(`getPhotoResult, result: ${JSON.stringify(res)} `);
  return res;
}

async function waitUntilPhotoTestOK({ bundleId, scmVersion }) {
  let count = 0;

  return await new Promise(resolve => {
    const interval = setInterval(async () => {
      count++;
      const { data } = await getPhotoResult({ scmVersion, bundleId });
      // pending / ok
      if (['ok'].includes(data.status) || count > CHECK_PHOTO_TEST_MAX_COUNT) {
        resolve(data);
        clearInterval(interval);
      }
    }, CHECK_PHOTO_TEST_INTERVAL_MS);
  });
}

async function trigger() {
  console.log('====start====');
  const {
    data: { fileUrl }
  } = await uploadFile();
  if (!fileUrl) {
    throw new Error('uploadFile fail');
  }
  console.log('uploadFile success');

  const {
    data: { scmVersion }
  } = await triggerScmBuild({ fileUrl });
  console.log(`triggerScmBuild scmVersion: ${scmVersion}`);

  const { status: scmVersionStatus } = await waitUntilScmBuildOK({
    scmVersion
  });
  console.log(`waitUntilScmBuildOK scmVersionStatus: ${scmVersionStatus}`);

  if (scmVersionStatus !== 'build_ok') {
    throw new Error(`scm build status: ${scmVersionStatus}`);
  }

  const {
    data: { bundleId }
  } = await triggerPhotoTest({ scmVersion, scmVersionStatus });
  console.log(`triggerPhotoTest bundleId:${bundleId}`);

  const {
    status: photoTestStatus,
    successCount,
    totalCount
  } = await waitUntilPhotoTestOK({
    bundleId,
    scmVersion
  });
  console.log(
    `waitUntilPhotoTestOK, status: ${photoTestStatus}, totalCount: ${totalCount}, successCount: ${successCount}`
  );

  if (photoTestStatus !== 'ok') {
    throw new Error(`photo test status: ${photoTestStatus}`);
  }

  if (successCount !== totalCount) {
    throw new Error(`totalCount: ${totalCount}, successCount: ${successCount}`);
  }
}
trigger();
