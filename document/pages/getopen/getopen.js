// pages/getopen/getopen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  openSetting() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.address"]) {
          wx.authorize({
            scope: 'scope.address',
            success: res => {
              wx.chooseAddress({
                success: res => {
                }
              })
            },
            fail: res => {
              //如果用户点击了拒绝，就会走fail
              console.log("点击了拒绝，authorize--fail用户拒绝过");
            }
          })
        } else {
          wx.chooseAddress({
            success: res => {}
          })
        }
      }
    })
    wx.openSetting()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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