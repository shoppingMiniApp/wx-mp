export const request = (promise) => {
  const baseUrl = "http://api_devs.wanxikeji.cn";
  return new Promise((resolve, reject) => {
    wx.request({
      ...promise,
      url: baseUrl + promise.url,
      success: (result) => {
        if (result.data.code > 2999) {
          const openid = wx.getStorageSync('openid')
          console.log("token过期,重新更新token")
          wx.request({
            url: baseUrl + "api/refreshToken",
            data: {
              openid: openid
            },
            success: (results) => {
              wx.setStorageSync('token', results.data.data.token);
              let token = wx.getStorageSync('token')
              wx.request({
                ...promise,
                url: baseUrl + promise.url,
                data: {
                  token
                },
                success: (result) => {
                  resolve(result);
                }
              })
            },
            fail: (err) => {
              reject(err);
            },
          })
        } else {
          console.log("token未过期,正常请求")
          resolve(result);
        }

      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};