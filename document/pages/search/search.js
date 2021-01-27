// pages/search/search.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // *假热门数据
    hotArray: [
      { id: 1, title: "分期" },
      { id: 2, title: "AK47（伊拉克战损版）" },
      { id: 3, title: "三只松鼠" },
      { id: 4, title: "小米" },
      { id: 5, title: "洗衣机" },
      { id: 6, title: "奶奶甜" },
      { id: 7, title: "新冠肺炎疫苗（买一送一）" },
      { id: 8, title: "沙发" },
    ],
    // *搜索联想列表
    searchResult: [],
    // *输入框内值
    searchValue: "",
    // *历史搜索数据
    historyArray: [],
    // *删除按钮是否显示
    deleteBtn: false,
    //*历史搜删除按钮显示状态
    visible5: false,
    searchResultStatus: false,
    // *历史搜索模块显示状态
    historyShow: true,
    // *热门搜索显示
    hotStatus: true,
    // *搜索结果列表展示状态
    searchGoodsListStatus: false,
    searchGoodsList: [],
    // *没有数据显示状态
    noDataTip: false,
    statusInfo: "",
  },
  // *定时器
  timeId: -1,
  hotKeyword: function (e) {
    this.searchQuest(e.currentTarget.dataset.item.title);
    this.setData({
      searchValue: e.currentTarget.dataset.item.title,
      deleteBtn: true,
      searchGoodsListStatus: true,
      hotStatus: false,
      historyShow: false,
      searchResultStatus: false,
    });
    this.pushHistory();
  },
  // *监测搜索框内值改变事件
  handleValue(e) {
    if (e.detail.value) {
      this.setData({
        deleteBtn: true,
        hotStatus: false,
        searchResultStatus: true,
        searchGoodsListStatus: false,
        historyShow: false,
      });
    } else {
      this.setData({
        deleteBtn: false,
        searchResultStatus: false,
        hotStatus: true,
        searchGoodsListStatus: false,
        historyShow: true,
        noDataTip: false,
      });
    }
    // *解决防抖  定时器
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.setData({
        searchValue: e.detail.value,
      });
      // console.log(this.data.searchValue);
      if (this.data.searchValue) {
        this.searchQuest(this.data.searchValue);
      }
    }, 500);
  },
  // *垃圾桶按钮
  deleteHistery() {
    this.setData({
      visible5: true,
    });
  },
  // *删除按键
  deleteValue() {
    this.setData({
      searchValue: "",
      deleteBtn: false,
      searchResultStatus: false,
      hotStatus: true,
      searchResult: [],
      historyShow: true,
      noDataTip: false,
    });
  },
  // *搜索结果列表点击事件
  resultTap(e) {
    // console.log(e.currentTarget.dataset.item.good_name);
    this.searchQuest(e.currentTarget.dataset.item.good_name);
    this.setData({
      searchGoodsListStatus: true,
      hotStatus: false,
      historyShow: false,
      searchResultStatus: false,
    });
    this.pushHistory();
  },
  // *搜索按下功能
  enterSearch() {
    this.pushHistory();
    if (this.data.searchValue) {
      this.searchQuest(this.data.searchValue);
    }
    this.setData({
      searchGoodsListStatus: true,
      hotStatus: false,
      historyShow: false,
      searchResultStatus: false,
    });
  },
  // *历史搜索push =去重 =存入缓存
  pushHistory() {
    var that = this;
    if (this.data.searchValue) {
      for (let i = 0; i < this.data.historyArray.length; i++) {
        if (this.data.searchValue == this.data.historyArray[i]) {
          this.data.historyArray.splice(i, 1);
        }
      }
      this.data.historyArray.push(this.data.searchValue);
      // *存入缓存
      wx.setStorageSync("historyArray", this.data.historyArray);
      // *获取缓存
      wx.getStorage({
        key: "historyArray",
        success: function (res) {
          // console.log(res.data);
          that.setData({
            historyArray: res.data,
          });
        },
      });
    }
  },
  // *历史搜索的点击输入
  historyChoose(e) {
    this.searchQuest(e.currentTarget.dataset.item);
    this.setData({
      searchValue: e.currentTarget.dataset.item,
      deleteBtn: true,
      searchGoodsListStatus: true,
      hotStatus: false,
      historyShow: false,
      searchResultStatus: false,
    });
    this.pushHistory();
  },
  // *请求搜索数据
  async searchQuest(data) {
    var that = this;
    // console.log(that);
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList",
      data: {
        search: data,
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      method: "POST", //发送post请求
      success(res) {
        // console.log(res.data.data.data);
        that.setData({
          searchResult: res.data.data.data,
        });
        if (res.data.data.data.length == 0) {
          that.setData({
            noDataTip: true,
          });
        } else {
          that.setData({
            noDataTip: false,
          });
        }
        // console.log(this.data.searchResult);
      },
    });
  },
  // *垃圾桶确认按钮
  handleOK() {
    this.setData({
      visible5: false,
      historyShow: false,
      historyArray: [],
    });
    // *存入缓存
    wx.setStorageSync("historyArray", []);
  },
  // *垃圾桶取消按钮
  handleCancel() {
    this.setData({
      visible5: false,
    });
  },
  // *搜索结果商品列表每个点击事件跳转信息详情页
  goodsClick(e) {
    let status = this.data.statusInfo;
    console.log("sssssssss", status);
    // console.log(e.currentTarget.dataset.item.good_id);
    wx.navigateTo({
      url:
        "/pages/product/product?good_id=" +
        e.currentTarget.dataset.item.good_id +
        "&status=" +
        status,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option.status);
    this.setData({
      statusInfo: option.status,
    });
    var that = this;
    wx.setNavigationBarTitle({
      title: "搜索",
    });
    // *获取缓存
    wx.getStorage({
      key: "historyArray",
      success: function (res) {
        // console.log(res.data);
        if (res.data.length != 0) {
          that.setData({
            historyShow: true,
            historyArray: res.data,
          });
        } else {
          that.setData({
            historyShow: false,
            historyArray: res.data,
          });
        }
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
