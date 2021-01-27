// app.js

App({
  onLaunch() {
    // 展示本地存储能力
    var _this = this;
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: (res) => {
        if (res.code) {
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        // console.log(res, "g");
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
    this.getCode();
  },
  globalData: {
    userInfo: null,
  },
  async getCode() {
    let res = await wx.login({
      // success: (res) => {
      // wx.request({
      //   url: "http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
      //   data: {
      //     code: res.code,
      //   },
      //   success(res) {
      //     // console.log(res);
      //     wx.setStorageSync("openid", res.data.data.openid);
      //     if (res.data.data.info) {
      //       wx.setStorageSync("registered", true);
      //       wx.setStorageSync("token", res.data.data.info.token);
      //       // console.log("1");
      //     } else {
      //       // console.log(res.data.data.openid, "2222");
      //       wx.setStorageSync("registered", false);
      //       // console.log("2");
      //     }
      //     // console.log(res, "code");
      //     return res;
      //   },
      // });
      // },
    });

    console.log(res, "codeedwqdwqddqwdqw");
    const token = (url, param) => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: "POST",
          data: {
            code: param,
          },
          success(res) {
            console.log(res);
            resolve(res.data);
          },
          fail(err) {
            console.log(err);
            reject(err);
          },
        });
      });
    };
    let tok = await token(
      "http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
      res.code
    );
    if (tok.code == 2000) {
      console.log(tok);
      wx.setStorageSync("openid", tok.data.openid);
      if (tok.data.info) {
        wx.setStorageSync("registered", true);
        wx.setStorageSync("token", tok.data.info.token);
        // console.log("1");
      } else {
        // console.log(tok.data.openid, "2222");
        wx.setStorageSync("registered", false);
        // console.log("2");
      }
    }
  },
  async getToken(key) {
    // var reqTask = await wx.request({
    //   // url: "http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
    //   // data: {
    //   //   code: key,
    //   // },
    // });
    const res = new Promise((resolve, reject) => {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
        data: {
          code: key,
        },
        success: (res) => {
          resolve(res);
        },
      });
    });
    await res;
    console.log(res, "wqqwqwwqwqqwwqwq");
  },
});
