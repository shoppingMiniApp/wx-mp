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
