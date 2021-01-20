// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    registerStatus: "",
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
    swiperSrc: [],
    recommenMain: [],
    classify: [],
    alert: "",
    fix: false,
    top: false,
    message:
      "2020-01-19成都金桥发现新冠，社区连夜对周围住户进行核酸检测，及时控制了疫情的传播",
  },
  handleChange: function ({ detail }) {
    if (detail.key == "homepage") {
      wx.setNavigationBarTitle({ title: "商城" });
    }
    if (detail.key == "mine") {
      wx.setNavigationBarTitle({ title: "我的" });
    }

    if (detail.key == "cart") {
      wx.setNavigationBarTitle({ title: "我的购物车" });
    }
    this.setData({
      current: detail.key,
    });
    // console.log(this.data.current);
  },

  //页面初始化-zy
  star() {
    // 请求nav数据-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodType",
      success: (result) => {
        let json = {};
        json.type_name = "推荐";
        result.data.data.unshift(json);
        this.setData({
          recommendData: result.data.data,
        });
      },
    });
    // 请求banner-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/bannerList",
      success: (result) => {
        this.setData({
          swiperSrc: result.data.data,
        });
      },
    });
    //请求的4个推荐-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "小米",
      },
      success: (result) => {
        let arr = [];
        for (let i = 0; i < 4; i++) {
          arr[arr.length] = result.data.data.data[i];
        }
        this.setData({
          recommenMain: arr,
        });
      },
    });
    // 请求list数据-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "三只松鼠",
      },
      success: (result) => {
        result.data.data.data.forEach((item, index, arr) => {
          item.isactive = false;
        });
        this.setData({
          list: result.data.data.data,
        });
      },
    });
  },
  //头部分页点击事件-zy
  handleChangeScroll(e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      classify: [],
    });
    let title = e.currentTarget.dataset.title;
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
        success: (result) => {
          let length = result.data.data.data.length;
          if (length > 0) {
            this.setData({
              classify: result.data.data.data,
              alert: "",
            });
          } else {
            this.setData({
              alert: "这部分数据溜走了",
            });
          }
        },
      });
    } else {
      this.setData({
        current_scroll: title,
        navName: "头部导航名称",
      });
    }
  },
  // 跳search页面-zy
  jump() {
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },
  //点击其他分类的商品，跳转详情页-zy
  detailmore(e) {
    let id = this.data.classify[e.currentTarget.dataset.index].good_id;
    this.jumpTo(id);
  },
  //点击推荐的4个商品-zy
  handleRecommend(e) {
    let id = this.data.recommenMain[e.currentTarget.dataset.index].good_id;
    this.jumpTo(id);
  },
  //推荐列表点击跳转商品详情-zy
  detail(e) {
    let id = this.data.list[e.currentTarget.dataset.index].good_id;
    this.jumpTo(id);
  },
  // 带着id跳转商品详情页-zy
  jumpTo(id) {
    wx.navigateTo({
      url: "../product/product?good_id=" + id,
    });
  },
  //点击三个小点-zy
  care(e) {
    let index = e.currentTarget.dataset.hide;
    let arr = this.data.list;
    if (arr[index].isactive) {
      arr[index].isactive = false;
      this.setData({
        list: arr,
      });
    } else {
      arr.forEach((item, index, arr) => {
        item.isactive = false;
      });
      arr[index].isactive = true;
      this.setData({
        list: arr,
      });
    }
  },
  //不感兴趣删除-zy
  del(e) {
    let number = e.currentTarget.dataset.hide;
    let arr = this.data.list;
    arr.splice(number, 1);
    arr.forEach((item, index, arr) => {
      item.isactive = false;
    });
    this.setData({
      list: arr,
      care: -1,
    });
  },
  // 取消不感兴趣-zy
  cancel(e) {
    let index = e.currentTarget.dataset.hide;
    let arr = this.data.list;
    arr[index].isactive = false;
    this.setData({
      list: arr,
    });
  },
  // 页面滚动事件-zy
  onPageScroll(e) {
    // nav固定
    if (e.scrollTop >= 83) {
      this.setData({
        fix: true,
      });
    } else {
      this.setData({
        fix: false,
      });
    }
    // 回到顶部
    if (e.scrollTop >= 300) {
      this.setData({
        top: true,
      });
    } else {
      this.setData({
        top: false,
      });
    }
  },
  // 回到顶部-zy
  top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
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
    this.star();
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
    console.log(this.data.userInfo);
    this.register();
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
  change() {
    var reqTask = wx.request({
      url: "http://api_devs.wanxikeji.cn/api/shoppingCarList",
      data: {},
      header: { "content-type": "application/json" },
      method: "GET",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        console.log(result, "cart");
      },
      fail: () => {},
      complete: () => {},
    });
    return reqTask;
  },
  logIn() {
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: "http://api_devs.wanxikeji.cn/api/",
    //         data: {
    //           code: res.code,
    //         },
    //         success(res) {
    //           console.log(res.data);
    //           wx.request({
    //             url: "http://api_devs.wanxikeji.cn/api/refreshToken",
    //             data: {
    //               openid: res.data.data.openid,
    //             },
    //             success(res) {
    //               console.log(res, "token");
    //             },
    //           });
    //         },
    //       });
    //     } else {
    //       console.log("登录失败！" + res.errMsg);
    //     }
    //   },
    // });
    // var reqTask = wx.request({
    //   url: "http://api_devs.wanxikeji.cn/api/login",
    //   data: {},
    //   header: { "content-type": "application/json" },
    //   method: "GET",
    //   dataType: "json",
    //   responseType: "text",
    //   success: (result) => {
    //     console.log(result, "cart");
    //   },
    //   fail: () => {},
    //   complete: () => {},
    // });
    // return reqTask;
  },
  register() {
    wx.getStorage({
      key: "registered",
      success: (result) => {
        console.log(result.data, "!");
        this.setData({ registerStatus: result.data });
        if (result.data == false) {
          console.log(this.data.userInfo, "ewqewqeqweqweq");
          // this.getUserInfo();
          wx.getStorage({
            key: "openid",
            success: (result) => {
              wx.request({
                url: "http://api_devs.wanxikeji.cn/api/register",
                data: {
                  openid: result.data,
                  nick_name: this.data.userInfo.nickName,
                  icon: this.data.userInfo.avatarUrl,
                },
                success(res) {
                  console.log(res.data.data, "eqeq");
                },
              });
            },
          });
        }
      },
    });
  },
});
