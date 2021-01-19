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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "商品详情",
    });
    console.log(options.good_id);
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
        console.log(res.data, "商品详情151515");
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
    } else if (this.data.current == "评价") {
      wx.pageScrollTo({
        scrollTop: 697,
        duration: 300,
      });
    } else if (this.data.current == "详情") {
      wx.pageScrollTo({
        scrollTop: 1213,
        duration: 300,
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
    // if (e.scrollTop > this.data.tabScrollTop) {
    //   this.setData({
    //     tabFixed: true,
    //   });
    // } else {
    //   this.setData({
    //     tabFixed: false,
    //   });
    // }
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
