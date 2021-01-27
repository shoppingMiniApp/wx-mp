// index.js
// 获取应用实例
const app = getApp();
const { $Toast } = require("../../dist/base/index");
Page({
  data: {
    registerStatus: "",
    avatarUrl: "",
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    current: "homepage",
    towList: [],
    num: 0,
    nums: 0,
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
    searchlist: "",
    message:
      "国家卫生健康委权威回应: 返乡人员需持7天内有效新冠病毒核酸检测阴性结果返乡，返乡后实行14天居家健康监测，期间不聚集、不流动，每7天开展一次核酸检测。",
    showEmpty: false,
    manageText: "管理",
    manageCart: true,
    cartTotal: 0,
    totalPrice: 0,
    checkList: [],
    cartItemCount: 0,
    iconShow: false,
    currentItem: "",
    registerStatus: false,
    openid: "",
    avatarUrl: "",
    userInfo: "",
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    visible: false,
  },

  handleChange: function ({ detail }) {
    if (detail.key == "homepage") {
      wx.setNavigationBarTitle({ title: "商城" });
    }
    if (detail.key == "mine") {
      wx.setNavigationBarTitle({ title: "我的" });
    }

    if (detail.key == "cart") {
      wx.setNavigationBarTitle({ title: "购物车" });
      this.getCartList();
    }
    this.setData({
      current: detail.key,
    });
    // console.log(this.data.current);
  },
  // 封装请求
  REQUEST(obj) {
    let URL = "http://api_devs.wanxikeji.cn";
    return new Promise((resolve, reject) => {
      wx.request({
        url: URL + obj.url,
        data: obj.data,
        success: (result) => {
          resolve(result);
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  },
  //页面初始化-zy
  star() {
    // 请求nav数据-zy
    this.REQUEST({
      url: "/api/goodType",
    }).then((res) => {
      console.log(res.data.data);
      let listt = [];
      this.parentDeal(res.data.data, 0, listt);
      let json = {};
      json.type_name = "推荐";
      listt.unshift(json);
      console.log(listt);
      this.setData({
        recommendData: listt,
      });
    });
    // 请求banner-zy
    this.REQUEST({
      url: "/api/bannerList",
    }).then((res) => {
      this.setData({
        swiperSrc: res.data.data,
      });
    });
    //请求的4个推荐-zy
    this.REQUEST({
      url: "/api/goodList",
      data: {
        search: "小米",
      },
    }).then((res) => {
      let arr = [];
      for (let i = 0; i < 4; i++) {
        arr[arr.length] = res.data.data.data[i];
      }
      this.setData({
        recommenMain: arr,
      });
    });
    // 请求list数据-zy
    this.REQUEST({
      url: "/api/goodList",
      data: {
        search: "三只松鼠",
      },
    }).then((res) => {
      res.data.data.data.forEach((item, index, arr) => {
        item.isactive = false;
      });
      this.setData({
        list: res.data.data.data,
      });
    });
  },
  //头部分类点击事件-zy
  handleChangeScroll(e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      classify: [],
      nums: 0,
      towList: [],
    });

    let title = e.currentTarget.dataset.title;
    if (title !== "推荐") {
      this.setData({
        current_scroll: title,
        navName: title,
      });
      let navName = "";
      this.data.recommendData.forEach((ele, index) => {
        if (this.data.num == index) {
          console.log(ele);
          if (ele.children) {
            navName = ele.children[0].type_name;
            this.setData({
              towList: ele.children,
            });
          }
        }
      });
      if (navName != "") {
        this.REQUEST({
          url: "/api/goodList",
          data: {
            search: navName,
          },
        }).then((res) => {
          let length = res.data.data.data.length;
          if (length > 0) {
            this.setData({
              classify: res.data.data.data,
              alert: "",
            });
          } else {
            this.setData({
              alert: "这部分数据溜走了",
            });
          }
        });
      } else {
        this.setData({
          alert: "这部分数据溜走了",
        });
      }
    } else {
      this.setData({
        current_scroll: title,
        navName: "头部导航名称",
        towList: [],
      });
    }
  },
  kids(e) {
    this.setData({
      nums: e.currentTarget.dataset.ind,
      classify: [],
    });
    let navName = e.currentTarget.dataset.child.type_name;
    console.log(navName);
    this.REQUEST({
      url: "/api/goodList",
      data: {
        search: navName,
      },
    }).then((res) => {
      console.log(res);
      let length = res.data.data.data.length;
      if (length > 0) {
        this.setData({
          classify: res.data.data.data,
          alert: "",
        });
      } else {
        this.setData({
          alert: "这部分数据溜走了",
        });
      }
    });
  },
  //跳search页面-zy
  jump() {
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },
  //点击商品，跳转详情页-zy
  detailmore(e) {
    let E = e;
    let id = this.getID(E);
    this.jumpTo(id);
  },
  //获取商品id-zy
  getID(e) {
    let name = e.currentTarget.dataset.arr;
    let str;
    if (name == "classify") {
      str = this.data.classify;
    } else if (name == "recommenMain") {
      str = this.data.recommenMain;
    } else if (name == "list") {
      str = this.data.list;
    }
    this.setData({
      searchlist: str,
    });
    let index = e.currentTarget.dataset.index;
    let id = this.data.searchlist[index].good_id;
    return id;
  },
  //带着id跳转商品详情页-zy
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
  //取消不感兴趣-zy
  cancel(e) {
    let index = e.currentTarget.dataset.hide;
    let arr = this.data.list;
    arr[index].isactive = false;
    this.setData({
      list: arr,
    });
  },
  //页面滚动事件-zy
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
  //回到顶部-zy
  top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },
  //nav分级处理-zy
  parentDeal(data, pid, list) {
    data.forEach((item) => {
      if (item.parent_id === pid) {
        delete item.parent_id;
        list.push(item);
        this.childrenDeal(data, item, item.good_type_id);
      }
    });
  },
  childrenDeal(arr, itemData, itemId) {
    itemData.children = itemData.children ? itemData.children : [];
    arr.forEach((item) => {
      if (item.parent_id === itemId) {
        delete item.parent_id;
        itemData.children.push(item);
        this.childrenDeal(arr, item, item.good_type_id);
      }
    });
    if (itemData.children.length == 0) {
      delete itemData.children;
    }
  },

  onLoad() {
    this.star();
    this.baseInfo();
  },
  baseInfo() {
    wx.setStorageSync("checkList", "");
    this.setData({
      registerStatus: wx.getStorageSync("registered"),
      openid: wx.getStorageSync("openid"),
    });
    console.log(wx.getStorageSync("registered"), "00");
    console.log(typeof wx.getStorageSync("registered"), "11");

    if (wx.getStorageSync("registered") == true) {
      console.log("3");
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
        });
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
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
    } else if (wx.getStorageSync("registered") == "") {
      console.log("1!!!");
      let _this = this;
      setTimeout(() => {
        _this.okRegister();
      }, 500);
    } else {
      console.log("4");
      // console.log(_this.data.registerStatus);
      this.setData({
        visible: true,
      });
    }
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
  toAddress(e) {
    // console.log(e.currentTarget, "tiao");
    let tag = e.currentTarget.dataset.set;
    if (tag == "address") {
      wx.navigateTo({
        url: "/pages/address/address",
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
    } else if (tag == "order") {
      let index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: "/pages/orderList/orderList?index=" + index,
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
    } else if (tag == "product") {
      let tmp = e.currentTarget.dataset.mark;
      wx.navigateTo({
        url: "/pages/product/product?good_id=" + tmp.good_id,
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
    }
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
  },
  cancelRegister() {
    this.setData({
      visible: false,
    });
  },
  register() {
    this.setData({
      registerStatus: wx.getStorageSync("registered"),
      openid: wx.getStorageSync("openid"),
    });
    if (wx.getStorageSync("registered") == false) {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/register",
        data: {
          openid: wx.getStorageSync("openid"),
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
      console.log("6");
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/refreshToken",
        data: {
          openid: wx.getStorageSync("openid"),
        },
        success(res) {
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
    this.setData({
      registerStatus: wx.getStorageSync("registered"),
      iconShow: false,
      totalPrice: 0,
      cartItemCount: 0,
      checkList: [],
    });

    if (this.data.registerStatus == true) {
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/shoppingCarList",
        data: {
          token: wx.getStorageSync("token"),
        },
        header: { "content-type": "application/json" },
        success: (result) => {
          console.log(result, "cart");
          let tmp = result.data.data.data;

          this.setData({
            cartList: tmp,
            cartTotal: tmp.length,
          });
          console.log("tmp", this.data.cartList);
          if (tmp.length <= 0) {
            this.setData({
              showEmpty: true,
            });
          } else {
            this.setData({
              showEmpty: false,
            });
          }
        },
        fail: () => {},
        complete: () => {},
      });
    } else {
    }
    if (this.data.manageCart == false) {
      this.manageCart();
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
  checkOut() {
    if (this.data.checkList.length > 0) {
      wx.setStorageSync("checkList", this.data.checkList);
      wx.navigateTo({
        url: "/pages/order/order",
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
    } else {
      $Toast({
        content: "未选择结算物品",
        type: "warning",
        duration: 0,
        mask: false,
      });
      setTimeout(() => {
        $Toast.hide();
      }, 1500);
    }
  },
  selectItem(e) {
    // console.log(e.currentTarget.dataset.type);
    let dataList = this.data.cartList;
    let counts = this.data.cartItemCount;
    let check = this.data.checkList;
    let price = 0;
    if (e.currentTarget.dataset.type == "single") {
      if (dataList[e.currentTarget.dataset.set].remark == true) {
        dataList[e.currentTarget.dataset.set].remark = false;
        counts--;
        for (let a = 0; a < check.length; a++) {
          if (
            check[a].shopping_car_id ==
            dataList[e.currentTarget.dataset.set].shopping_car_id
          ) {
            check.splice(a, 1);
            a--;
          }
        }
        for (let b = 0; b < check.length; b++) {
          price += Number(check[b].money) * Number(check[b].num);
        }
        this.setData({
          checkList: check,
        });
      } else {
        dataList[e.currentTarget.dataset.set].remark = true;
        counts++;
        check.push(dataList[e.currentTarget.dataset.set]);
        for (let b = 0; b < check.length; b++) {
          price += Number(check[b].money) * Number(check[b].num);
        }
        this.setData({
          checkList: check,
        });
      }
      
      this.setData({
        cartList: dataList,
        cartItemCount: counts,
        totalPrice: price.toFixed(2),
      });
      if (this.data.checkList.length == this.data.cartList.length) {
        this.setData({
          iconShow: true,
        });
      } else if (this.data.checkList.length < this.data.cartList.length) {
        this.setData({
          iconShow: false,
        });
      }
    } else {
      console.log("all");
      let show = this.data.iconShow;
      console.log(show, !show);
      this.setData({
        iconShow: !show,
      });
      check = [];
      price = 0;
      for (let i = 0; i < dataList.length; i++) {
        if (this.data.iconShow == true) {
          dataList[i].remark = true;
          price += Number(dataList[i].money) * Number(dataList[i].num);
          // console.log(dataList[i].money++);
          this.setData({
            cartItemCount: dataList.length,
          });
          check.push(dataList[i]);
        } else {
          dataList[i].remark = false;
          this.setData({
            cartItemCount: 0,
          });
          check = [];
          price = 0;
        }
      }
      this.setData({
        cartList: dataList,
        checkList: check,
        totalPrice: price.toFixed(2),
      });
      console.log(this.data.checkList, "check");
    }
  },
  manageCart() {
    let tmp = this.data.manageCart;
    let dataList = this.data.cartList;

    console.log(tmp);
    this.setData({
      manageCart: !tmp,
    });
    console.log(this.data.ma);
    if (this.data.manageCart == true) {
      this.setData({
        manageText: "管理",
        iconShow: false,
      });
    } else if (this.data.manageCart == false) {
      this.setData({
        manageText: "完成",
        iconShow: false,
      });
    }
    for (let i = 0; i < dataList.length; i++) {
      dataList[i].remark = false;
    }
    // console.log(price, "$");
    this.setData({
      cartList: dataList,
      cartItemCount: 0,
      totalPrice: 0,
      checkList: [],
    });
  },
  deleteCart() {
    let dataList = this.data.checkList;
    let cart = this.data.cartList;
    this.setData({
      iconShow: false,
    });
    for (let i = 0; i < dataList.length; i++) {
      for (let k = 0; k < cart.length; k++) {
        if (dataList[i].shopping_car_id == cart[k].shopping_car_id) {
          cart.splice(k, 1);
          k--;
        }
      }
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/shoppingCarDelete",
        data: {
          token: wx.getStorageSync("token"),
          shopping_car_id: dataList[i].shopping_car_id,
        },
        header: { "content-type": "application/json" },
        success: (result) => {
          console.log(result, "DEL");
        },
      });
    }
    if (cart.length <= 0) {
      this.setData({
        cartList: cart,
        showEmpty: true,
        cartTotal: 0,
        cartItemCount: 0,
      });
    } else {
      this.setData({
        cartList: cart,
        cartTotal: cart.length,
        cartItemCount: 0,
      });
    }
  },
});
