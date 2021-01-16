// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    avatarUrl: "",
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    current: "homepage",

    num: 0,
    care: -1,
    current_scroll: "推荐",
    navName: "头部导航名称",
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
    classify: [],
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
  handleChangeScroll(e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      classify: [],
    });
    var title = e.currentTarget.dataset.title;
    if (title !== "推荐") {
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
          console.log(result.data.data.data);
          this.setData({
            classify: result.data.data.data,
          });
          console.log(this.data.classify[0].good_id);
        },
        fail: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("点击分类接口调用结束");
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
  //点击其他分类的商品，跳转详情页-zy
  detailmore(e) {
    let id = this.data.classify[e.currentTarget.dataset.index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
  },
  //点击推荐的4个商品-zy
  handleRecommend(_a) {
    let index = _a.currentTarget.dataset.index;
    console.log(this.data.recommenMain[index].good_id);
    //请求接口，获取数据，，跳转页面
  },
  //推荐列表点击跳转商品详情-zy
  detail(e) {
    let id = this.data.recommenMain[e.currentTarget.dataset.index].promotion_id;
    console.log(id);
    // 带着id跳转商品详情页
  },
  //点击三个小点-zy
  care(e) {
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
  //不感兴趣删除-zy
  del(e) {
    let number = e.currentTarget.dataset.index;
    let arr = this.data.swiperSrc;
    arr.splice(number, 1);
    this.setData({
      swiperSrc: arr,
      care: -1,
    });
  },

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
    // 请求分类数据-zy
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
    // 请求banner-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/bannerList",
      data: {},
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result.data.data);
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
    //请求的4个推荐-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "小米",
      },
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
       let arr = []
        for(let i = 0; i < 4; i++){
          arr[arr.length] = result.data.data.data[i]
        }
        this.setData({
          recommenMain: arr,
        });
      },
      fail: (erroe) => {
        console.log(error);
      },
      complete: () => {
        console.log("8个推荐接口调用结束");
      },
    });
    // 请求推荐数据-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "零食",
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
  onReady() {},

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
      url: "/pages/address/address",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
});
