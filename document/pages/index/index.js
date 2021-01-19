// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    currentItem: "",
    registerStatus: false,
    openid: "",
    avatarUrl: "",
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    current: "cart",
    visible: false,
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
      "2021年7月-8月，将会在成都举办大运会，2022年将会在日本东京举办奥运会",
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
  // 跳search页面-zy
  jump() {
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },
  //点击其他分类的商品，跳转详情页-zy
  detailmore(e) {
    let id = this.data.classify[e.currentTarget.dataset.index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
    wx.navigateTo({
      url: "../product/product?good_id=" + id,
    });
  },
  //点击推荐的4个商品-zy
  handleRecommend(_a) {
    let index = _a.currentTarget.dataset.index;
    let id = this.data.recommenMain[index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
    wx.navigateTo({
      url: "../product/product?good_id=" + id,
    });
  },
  //推荐列表点击跳转商品详情-zy
  detail(e) {
    // console.log(e.currentTarget.dataset.index);
    let id = this.data.list[e.currentTarget.dataset.index].good_id;
    console.log(id);
    // 带着id跳转商品详情页
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
    // console.log(number);
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
    // console.log(e.scrollTop);
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
  // 回到顶部
  top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },

  onLoad() {
    // let resisterStatus = ;
    // console.log(tmp);
    this.setData({
      registerStatus: wx.getStorageSync("registered"),
      openid: wx.getStorageSync("openid"),
    });
    if (this.data.registerStatus == true) {
      console.log("3");
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
    } else {
      console.log("4");

      this.setData({
        visible: true,
      });
    }
    this.getCartList();
    // 请求分类数据-zy
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
        // console.log("接口调用结束");
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
        // console.log("8个推荐接口调用结束");
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
        result.data.data.data.forEach((item, index, arr) => {
          item.isactive = false;
        });
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
    // console.log(this.data.userInfo);
    this.register();
  },
  logOut() {
    this.setData({
      userInfo: {},
      hasUserInfo: false,
    });
    // app.globalData.userInfo = false;
    wx.setStorageSync("token", "");
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
    wx.getStorage({
      key: "token",
      success: (result) => {
        wx.request({
          url: "http://api_devs.wanxikeji.cn/api/shoppingCarList",
          data: {
            token: result.data,
          },
          header: { "content-type": "application/json" },
          success: (result) => {
            console.log(result, "cart");
          },
        });
      },
    });

    // wx.request({
    //   url: "http://api_devs.wanxikeji.cn/api/goodList",
    //   data: {},
    //   header: { "content-type": "application/json" },
    //   success: (result) => {
    //     console.log(result, "cart");
    //   },
    // });
  },
  addToCart() {
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/shoppingCarAddModify",
      data: {
        token: wx.getStorageSync("token"),
        good_id: "1008",
        num: "1",
        price: "2259.00",
        money: "2259.00",
        sku: "台",
      },
      header: { "content-type": "application/json" },
      success: (result) => {
        console.log(result, "Addcart");
      },
    });
  },
  okRegister() {
    wx.getUserInfo({
      success: (res) => {
        console.log("7");
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        this.register();
        this.setData({
          visible: false,
        });
      },
    });
    // this.getUserInfo();
  },
  cancelRegister() {
    this.setData({
      visible: false,
    });
    wx.setStorageSync("registered", false);
  },
  register() {
    if (this.data.registerStatus == false) {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/register",
        data: {
          openid: this.data.openid,
          nick_name: this.data.userInfo.nickName,
          icon: this.data.userInfo.avatarUrl,
        },
        success(res) {
          console.log("5", res);

          wx.setStorageSync("token", res.data.data.token);
          wx.setStorageSync("registered", true);
        },
      });
    } else {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/refreshToken",
        data: {
          openid: this.data.openid,
        },
        success(res) {
          console.log("6");
          wx.setStorageSync("token", res.data.data.token);
          wx.setStorageSync("registered", true);
        },
        fail() {
          console.log("error");
        },
      });
    }
  },
  getCartList() {
    if (this.data.registerStatus == true) {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/shoppingCarList",
        data: {
          token: wx.getStorageSync("token"),
        },
        header: { "content-type": "application/json" },
        success: (result) => {
          console.log(result, "cart");
          this.setData({
            cartList: result.data.data.data,
          });
        },
        fail: () => {},
        complete: () => {},
      });
    } else {
    }
  },
  modifyNum(e) {
    let dataList = this.data.cartList;
    let tmp =
      dataList[e.currentTarget.dataset.set].num + e.currentTarget.dataset.unit;
    if (tmp <= 1) {
      tmp = 1;
    } else if (tmp >= 99) {
      tmp = 99;
    }
    dataList[e.currentTarget.dataset.set].num = tmp;
    this.setData({
      cartList: dataList,
    });
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/shoppingCarAddModify",
      data: {
        token: wx.getStorageSync("token"),
        good_id: dataList[e.currentTarget.dataset.set].good_id,
        num: tmp,
        price: dataList[e.currentTarget.dataset.set].price,
        money: "0.01",
        sku: dataList[e.currentTarget.dataset.set].sku,
        shopping_car_id: dataList[e.currentTarget.dataset.set].shopping_car_id,
      },
      header: { "content-type": "application/json" },
      success: (result) => {
        console.log(result, "se");
      },
    });
  },
  checkOut() {
    wx.setStorageSync("checkList", this.data.cartList[0]);
    wx.navigateTo({
      url: "/pages/order/order",
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
  },
});
