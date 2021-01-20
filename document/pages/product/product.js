// pages/product/product.js
const { $Toast } = require("../../dist/base/index");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodImg: "",
    goodTitle:
      "美国正品BILTWEL姑姑头盔摩托车人头盔哈雷印第安姑姑头盔摩托车人头盔哈雷印第安姑姑头盔摩托车人头盔哈雷印第安",
    goodPrice: "",
    current: "宝贝",
    // *导航透明度
    navOpacity: 0,
    visible1: false,
    click: false, //是否显示弹窗内容
    option: false, //显示弹窗或关闭弹窗的操作动画
    inventory: 99,
    itemNum: 1,
    goods_id: "",
    goTop: false,
    skuData: [
      { id: 1, sku: "红色(ass)" },
      { id: 2, sku: "哈哈哈哈哈哈色(ass)" },
      { id: 3, sku: "红色(ass)" },
      { id: 4, sku: "256色(ass)" },
      { id: 5, sku: "红色(ass)" },
      { id: 6, sku: "纤纤嘻嘻色(ass)" },
      { id: 7, sku: "加单色(ass)" },
      { id: 8, sku: "机麻色(ass)" },
    ],
    skuColor: "skuColor",
    idx: -1,
    showNav: false,
    unselect: true,
    isselect: false,
    isselectSku: "",
    loadingHidden: true,
    // *收藏
    collectionIcon: "collection",
    collectionColor: "",
    collectionTxt: "收藏",
  },
  // *计数器
  modifyNum(e) {
    let tmp = this.data.itemNum + e.currentTarget.dataset.unit;
    if (tmp <= 1) {
      tmp = 1;
    } else if (tmp >= 99) {
      tmp = 99;
    }
    this.setData({
      itemNum: tmp,
    });
  },

  // 用户点击显示弹窗
  clickPup: function () {
    let _that = this;
    if (!_that.data.click) {
      _that.setData({
        click: true,
      });
    }

    if (_that.data.option) {
      _that.setData({
        option: false,
      });

      // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
      setTimeout(() => {
        _that.setData({
          click: false,
        });
      }, 500);
    } else {
      _that.setData({
        option: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "商品详情",
    });
    // console.log(options.good_id);
    this.getGoodData(options.good_id);
  },
  // *请求数据
  getGoodData(goodid) {
    var that = this;
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodInfo",
      data: {
        good_id: goodid,
      },
      header: {
        "content-type": "application/json",
      },
      success: function (res) {
        that.setData({
          goods_id: res.data.data.good_id,
          goodImg: res.data.data.img,
          goodTitle: res.data.data.good_name,
          goodPrice: res.data.data.price,
        });
      },
    });
  },
  // *顶部tab栏
  handleChange({ detail }) {
    this.setData({
      current: detail.key,
    });
    if (this.data.current == "宝贝") {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
      this.setData({
        goTop: false,
      });
    } else if (this.data.current == "评价") {
      wx.pageScrollTo({
        scrollTop: 697,
        duration: 300,
      });
      this.setData({
        goTop: false,
      });
    } else if (this.data.current == "详情") {
      wx.pageScrollTo({
        scrollTop: 1213,
        duration: 300,
      });
      this.setData({
        goTop: true,
      });
    }
  },
  onPageScroll: function (e) {
    //监听用户滑动页面事件

    if (e.scrollTop <= 0) {
      // 滚动到最顶部
      e.scrollTop = 0;
      this.setData({
        navOpacity: e.scrollTop,
      });
    } else if (e.scrollTop > this.data.scrollHeight) {
      // 滚动到最底部
      e.scrollTop = this.data.scrollHeight;
    }
    if (
      e.scrollTop > this.data.scrollTop ||
      e.scrollTop >= this.data.scrollHeight
    ) {
      //向下滚动
      // console.log("向下 ", this.data.scrollHeight);
      this.setData({
        navOpacity: this.data.navOpacity + 0.04,
      });
    } else {
      //向上滚动
      // console.log("向上滚动 ", this.data.scrollHeight);
      this.setData({
        navOpacity: this.data.navOpacity - 0.04,
      });
    }
    //给scrollTop重新赋值
    this.setData({
      scrollTop: e.scrollTop,
    });
    // 页面滚动监听
    if (e.scrollTop >= 0 && e.scrollTop < 696) {
      this.setData({
        current: "宝贝",
        goTop: false,
      });
    } else if (e.scrollTop >= 696 && e.scrollTop < 1213) {
      this.setData({
        current: "评价",
        goTop: false,
      });
    } else if (e.scrollTop >= 1213) {
      this.setData({
        current: "详情",
        goTop: true,
      });
    }
  },
  // *关闭按钮
  close() {
    this.clickPup();
  },
  // *加入购物车弹窗确认键
  addOkBtn() {
    this.setData({
      loadingHidden: false,
    });
    this.addToCart();
    var that = this;
    setTimeout(function () {
      that.setData({
        loadingHidden: true,
      });
      that.clickPup();
      $Toast({
        content: "已成功添加购物车",
        type: "success",
        duration: 1,
      });
    }, 800);
  },
  // *回到顶部
  goTopBtn() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },
  // *sku
  skuChoose(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      idx: index,
      unselect: false,
      isselect: true,
      isselectSku: e.currentTarget.dataset.item.sku,
    });
  },
  // *加入购物车借口
  addToCart() {
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/shoppingCarAddModify",
      data: {
        token: wx.getStorageSync("token"),
        good_id: this.data.goods_id,
        num: this.data.itemNum,
        price: this.data.goodPrice,
        money: "2259.00",
        sku: this.data.isselectSku,
      },
      header: { "content-type": "application/json" },
      success: (result) => {
        console.log(result, "Addcart");
      },
    });
  },
  // *收藏
  collection() {
    if (this.data.collectionIcon == "collection") {
      this.setData({
        collectionIcon: "collection_fill",
        collectionColor: "#f00",
      });
      $Toast({
        content: "收藏成功！",
        icon: "collection_fill",
        duration: 1,
      });
    } else {
      this.setData({
        collectionIcon: "collection",
        collectionColor: "",
      });
      $Toast({
        content: "取消收藏",
        icon: "collection",
        duration: 1,
      });
    }
  },
  // *立即购买按钮
  buyNow() {
    $Toast({
      content: "该功能暂未开放！",
      type: "error",
      duration: 1,
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
