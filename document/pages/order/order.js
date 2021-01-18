// pages/order/order.js
import {
  request
} from "../../request/index";
Page({
  data: {
    address: {},
    goodsMsg: {},
    addressShow: false,
    goodsNumber: 1,
    original_price: 0
  },
  handleChooseAdd() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  handletap(e) {
    const operation = e.currentTarget.dataset.operation;
    let goodsMsg;

    if (operation > 0) {
      this.setData({
        goodsNumber: this.data.goodsNumber += operation
      })

    } else {
      if (this.data.goodsNumber > 1) {
        this.setData({
          goodsNumber: this.data.goodsNumber += operation
        })
      }
    }
    goodsMsg = this.data.goodsMsg;
    goodsMsg.promotion_price = (this.data.original_price * this.data.goodsNumber).toFixed(2);
    this.setData({
      goodsMsg
    })

  },
  async init() {
    let LocalAddress = wx.getStorageSync('selectAddress');
    let address = {}
    if (!LocalAddress) {
      console.log(2)
      let token = wx.getStorageSync('token')
      const addressList = await request({
        url: "/api/userAddressList",
        data: {
          token
        }
      })
      console.log(addressList);
      addressList.data.data.forEach(element => {
        if (element.default) {
          address = element;
        }
      });
      if (address.name) {
        this.setData({
          address,
          addressShow: true
        });
      }
    } else {
      console.log(1)
      this.setData({
        address: JSON.parse(LocalAddress),
        addressShow: true
      });
    }
    console.log(this.data.address)
  },
  onLoad: function (options) {
    request({
      url: "/api/goodInfo",
      data: {
        good_id: "1008"
      }
    }).then((res) => {
      res.data.data.promotion_price = "0.10"
      this.setData({
        goodsMsg: res.data.data
      })
      this.data.original_price = Number(res.data.data.promotion_price);
      console.log(this.data.goodsMsg);
    });
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})