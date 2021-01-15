export const request = (promise) => {
  const baseUrl = "http://api_devs.wanxikeji.cn";
  return new Promise((resolve, reject) => {
    wx.request({
      ...promise,
      url: baseUrl + promise.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};