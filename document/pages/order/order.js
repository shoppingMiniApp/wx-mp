// pages/order/order.js
import { request } from "../../request/index";
Page({
  data: {
    address: {
      username: "李嘉城",
      phonenumber: "18512828693",
      site: "四川省充市"
    },
    goodsMsg: {
      good_name: "",
      img: "",
      promotion_price: "",

    }
  },
  handleChooseAdd() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  onLoad: function (options) {
    request({
      url: "/api/goodInfo",
      data: {
        good_id: "1008"
      }
    }).then((res) => {
      console.log(res);
    });
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