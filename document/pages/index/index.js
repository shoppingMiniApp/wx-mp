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

          // console.log(this.data.classify[0].good_id);
        },
        fail: (error) => {
          console.log(error);
        },
        complete: () => {
          // console.log("点击分类接口调用结束");
        },
      });
    } else {
      this.setData({
        current_scroll: title,
        navName: "头部导航名称",
      });
    }
    // console.log(this.data.navName);
  },
  //点击其他分类的商品，跳转详情页-zy
  detailmore(e) {
    let id = this.data.classify[e.currentTarget.dataset.index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
    wx.navigateTo({
      url: "",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
  //点击推荐的4个商品-zy
  handleRecommend(_a) {
    let index = _a.currentTarget.dataset.index;
    let id = this.data.recommenMain[index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
    wx.navigateTo({
      url: "",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
  
  //推荐列表点击跳转商品详情-zy
  detail(e) {
    // console.log(e.currentTarget.dataset.index);
    let id = this.data.list[e.currentTarget.dataset.index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
    wx.navigateTo({
      url: "",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
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
      arr.forEach((item,index,arr)=>{
        item.isactive = false
      })
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
    this.setData({
      list: arr,
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
    // 请求nav数据-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodType",
      data: {},
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        // console.log(result.data.data);
        let json = {};
        json.type_name = "推荐";
        result.data.data.unshift(json);
        // console.log(result.data.data);
        this.setData({
          recommendData: result.data.data,
        });
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {
        // console.log("nav接口调用结束");
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
        // console.log(result.data.data);
        this.setData({
          swiperSrc: result.data.data,
        });
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {
        // console.log("banner接口调用结束");
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
        let arr = [];
        for (let i = 0; i < 4; i++) {
          arr[arr.length] = result.data.data.data[i];
        }
        this.setData({
          recommenMain: arr,
        });
      },
      fail: (erroe) => {
        console.log(error);
      },
      complete: () => {
        // console.log("4个推荐接口调用结束");
      },
    });
    // 请求list数据-zy
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: "三只松鼠",
      },
      header: { "content-type": "application/json" },
      method: "post",
      dataType: "json",
      responseType: "text",
      success: (result) => {
        result.data.data.data.forEach( (item,index,arr)=>{
          item.isactive = false
        })
        this.setData({
          list: result.data.data.data,
        });
      },
      fail: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  },
  onReady() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  // 这个onload与上面的onload冲突，导致我拿不到数据，先注释掉-zy
  // onLoad() {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true,
  //     });
  //   } else if (this.data.canIUse) {
  //     app.userInfoReadyCallback = (res) => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true,
  //       });
  //     };
  //   } else {
  //     wx.getUserInfo({
  //       success: (res) => {
  //         app.globalData.userInfo = res.userInfo;
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true,
  //         });
  //       },
  //     });
  //   }

  //   this.register();
  //   console.log(this.data.registerStatus, "r");
  // },
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
