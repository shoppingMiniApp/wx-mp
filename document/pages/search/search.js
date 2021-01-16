// pages/search/search.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotArray: [
      { id: 1, title: "AJ11白蓝康扣" },
      { id: 2, title: "白蓝康扣" },
      { id: 3, title: "AJ11白蓝扣" },
      { id: 4, title: "1康扣" },
      { id: 5, title: "白蓝扣" },
      { id: 6, title: "AJ11康扣" },
      { id: 7, title: "AJ11白蓝扣" },
      { id: 8, title: "AJ11扣" },
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
    historyShow: false,
    // *热门搜索显示
    hotStatus: true,
    // *搜索结果列表展示状态
    searchGoodsListStatus: false,
    searchGoodsList: [],
  },
  // *定时器
  timeId: -1,
  hotKeyword: function (e) {
    console.log(e.currentTarget.dataset.item.title);
    this.setData({
      searchValue: e.currentTarget.dataset.item.title,
      deleteBtn: true,
    });
  },
  // *监测搜索框内值改变事件
  handleValue(e) {
    if (e.detail.value) {
      this.setData({
        deleteBtn: true,
        hotStatus: false,
        searchResultStatus: true,
      });
    } else {
      this.setData({
        deleteBtn: false,
        searchResultStatus: false,
        hotStatus: true,
      });
    }
    // *解决防抖  定时器
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.setData({
        searchValue: e.detail.value,
      });
      console.log(this.data.searchValue);
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
    });
  },
  resultTap(e) {
    console.log(e);
  },
  // *搜索按下功能
  enterSearch() {
    this.pushHistory();
    if (this.data.searchValue) {
      this.searchQuest(this.data.searchValue);
    }
    this.setData({
      searchGoodsListStatus: true,
    });
  },
  // *历史搜索
  pushHistory() {
    if (this.data.searchValue) {
      this.data.historyArray.push(this.data.searchValue);
      console.log(this.data.historyArray);
      this.setData({
        historyShow: true,
        historyArray: this.data.historyArray,
      });
    }
  },
  // *请求搜索数据
  async searchQuest(data) {
    var that = this;
    console.log(that);
    wx.request({
      url: "http://api_devs.wanxikeji.cn/api/goodList", // 仅为示例，并非真实的接口地址
      data: {
        search: data,
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      method: "POST", //发送post请求
      success(res) {
        console.log(res.data.data.data);
        that.setData({
          searchResult: res.data.data.data,
        });
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
  },
  // *垃圾桶取消按钮
  handleCancel() {
    this.setData({
      visible5: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "搜索",
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
