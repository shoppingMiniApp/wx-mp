// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
            data: {
              code: res.code,
            },
            success(res) {
              if (res.data.data.info) {
                wx.setStorageSync("registered", true);
                console.log(res.data.data.info);
                wx.setStorageSync("token", res.data.data.info.token);

              } else {
                console.log(res.data.data.openid, "2222");
                wx.setStorageSync("registered", false);
                wx.setStorageSync("openid", res.data.data.openid);
              }
            },
          });
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              console.log("111");
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
                console.log("222");
              }
            },
          });
        }
      },
    });
  },
  globalData: {
    userInfo: null,
  },
});
