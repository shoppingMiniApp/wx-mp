// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    avatarUrl: "",
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    num: 0,
    care: -1,
    current: "homepage",
    current_scroll: "家居",
    recommendData: [],
    swiperSrc: [
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
    ],
    recommenMain: [
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
      {
        src: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        info: "这是一只猫",
      },
    ],
    navName: "头部导航名称",
    //这之前的data数据是曾勇的
  },
  handleChange: function ({ detail }) {
    if (detail.key == "mine") {
      wx.setNavigationBarTitle({ title: "我的" });
    }

    if (detail.key == "cart") {
      wx.setNavigationBarTitle({ title: "我的购物车" });
    }
    this.setData({
      current: detail.key,
    });
    console.log(this.data.current);
  },
  //头部分页点击事件-zy
  handleChangeScroll: function (e) {
    this.setData({ num: e.currentTarget.dataset.index });
    var title = e.currentTarget.dataset.title;
    if (title !== "家居") {
      this.setData({
        current_scroll: title,
        navName: title,
      });
      let navName = this.data.navName;
      // 根据分类请求到的数据
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/goodList",
        data: {
          search: navName,
        },
        header: { "content-type": "application/json" },
        method: "post",
        dataType: "json",
        responseType: "text",
        success: (result) => {
          console.log(result.data.data);
        },
        fail: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("接口调用结束");
        },
      });
    } else {
      this.setData({
        current_scroll: title,
        navName: "头部导航名称",
      });
    }
    console.log(this.data.navName);
  },
  //点击推荐的8个商品
  handleRecommend: function (_a) {
    let index = _a.currentTarget.dataset.index;
    console.log(index);
    //请求接口，获取数据，，跳转页面
  },
  //点击三个小点
  care: function (e) {
    if (this.data.care == -1) {
      this.setData({
        care: e.currentTarget.dataset.hide,
      });
    } else {
      this.setData({
        care: -1,
      });
    }
  },
  //不感兴趣删除
  del: function (e) {
    let number = e.currentTarget.dataset.index;
    this.data.splice(number, 1);
    console.log(this.data.swiperSrc);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求分类数据
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodType",
      data: {},
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result.data.data);
        let json = {};
        json.type_name = "推荐";
        result.data.data.unshift(json);
        console.log(result.data.data);
        this.setData({
          recommendData: result.data.data,
        });
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("接口调用结束");
      },
    });
    // 请求banner
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/bannerList",
      data: {},
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        this.setData({
          swiperSrc: result.data.data,
        });
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("接口调用结束");
      },
    });
    // 请求家居数据
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "家居",
      },
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result.data.data);
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("接口调用结束");
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
    // console.log(this.data.userInfo);
  },
  logOut() {
    this.setData({
      userInfo: {},
      hasUserInfo: false,
    });
    // app.globalData.userInfo = false;
  },
  toAddress() {
    wx.navigateTo({
      url: "/pages/order/order",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
});
