/**
 * promise化接口
 */
function wxPromisify(functionName, params) {
  return new Promise((resolve, reject) => {
    wx[functionName]({
      ...params,
      success: res => resolve(res),
      fail: res => reject(res)
    });
  });
}

/**
 * 登录
 */
function login(params = {}) {
  return wxPromisify('login', params);
}

/**
 * 获取用户信息
 */
function getUserInfo(params = {}) {
  return wxPromisify('getUserInfo', params);
}

/**
 * 获取用户权限
 */
function getSetting(params = {}) {
  return wxPromisify('getSetting', params);
}

function downloadFile(params = {}){
  return wxPromisify('downloadFile', params);
}

module.exports = {
  login,
  getUserInfo,
  getSetting,
  downloadFile
}
