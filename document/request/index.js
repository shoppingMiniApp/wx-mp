export const request = (promise) => {
  const baseUrl = "http://api_devs.wanxikeji.cn";
  return new Promise((resolve, reject) => {
    wx.request({
      ...promise,
      url: baseUrl + promise.url,
      success: (result) => {
        if (result.data.code > 2999) {
          const openid = wx.getStorageSync('openid')
          wx.request({
            url: baseUrl + "/api/refreshToken",
            data: {
              openid
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
          resolve(result);
        }

      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};


export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}
export const showToast = (toast) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      ...toast
    })
  })
}