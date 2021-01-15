export const request = (aaa) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...aaa,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};