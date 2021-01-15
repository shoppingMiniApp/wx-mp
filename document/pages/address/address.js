// pages/address/address.js
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js"

Page({

  data: {

  },

  async handleImportSite() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      console.log(res1);
      await openSetting();
      const res2 = await chooseAddress();
      console.log(res2);
    } catch (error) {
      console.log(error);
    }
  },
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})