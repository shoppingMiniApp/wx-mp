// pages/product/product.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodImg:
      "http://api_devs.wanxikeji.cn/app/pic/20201229/20201229025344643.jpg",
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
    goTop: false,
    skuData: [
      { id: 1, sku: "红色(现货)" },
      { id: 2, sku: "哈哈哈哈哈哈色(现货)" },
      { id: 3, sku: "红色(现货)" },
      { id: 4, sku: "256色(现货)" },
      { id: 5, sku: "红色(现货)" },
      { id: 6, sku: "纤纤嘻嘻色(现货)" },
      { id: 7, sku: "加单色(现货)" },
      { id: 8, sku: "机麻色(现货)" },
    ],
    skuColor: "skuColor",
    idx: 0,
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
        // console.log(res.data, "商品详情151515");
        that.setData({
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
    // 页面滚动监听
    // console.log(e);
    if (e.scrollTop) {
      this.setData({
        navOpacity: this.data.navOpacity + 0.01,
      });
    } else {
      this.setData({
        navOpacity: this.data.navOpacity - 0.01,
      });
    }
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
  addOkBtn() {},
  // *回到顶部
  goTopBtn() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },
  // *sku
  skuChoose(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    // console.log('每个index',index)
    this.setData({
      idx: index,
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
