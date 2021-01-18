// pages/address/address.js
import {
  getSetting,
  chooseAddress,
  openSetting
} from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"

Page({

  data: {
    userAddressData: [{
      cityName: "广州市",
      consignee: "张三",
      countyName: "海珠区",
      detailInfo: "新港中路397号",
      id: "1",
      provinceName: "广东省",
      telNumber: "020-81167888",
      userName: "张三",
    },
    {
      cityName: "广州市",
      consignee: "张三",
      countyName: "海珠区",
      detailInfo: "新港中路397号",
      id: "2",
      provinceName: "广东省",
      telNumber: "020-81167888",
      userName: "张三",
    }],
    current: '',
  },
  handleFruitChange({ detail = {} }) {
    console.log(detail);
    this.setData({
      current: detail.value
    });

  },

  async handleImportSite() {
    try {
      const res2 = await chooseAddress();
      console.log(res2);
      let userAddressData = {
        id: "3",
        userName: res2.userName,
        consignee: res2.userName,
        telNumber: res2.telNumber,
        provinceName: res2.provinceName,
        cityName: res2.cityName,
        countyName: res2.countyName,
        detailInfo: res2.detailInfo
      }
      let addressList = this.data.userAddressData;
      addressList.push(userAddressData)
      // console.log(userAddressData);
      //设置本地数据
      this.setData({
        userAddressData: addressList
      })
      console.log(this.data.userAddressData, 1)
      //将数据上传至服务器
      // const address = await request({})

    } catch (error) {
      console.log(error);
    }
  },
  onLoad: function (options) {
    const token = wx.getStorageSync("token");
    console.log(token);
    // const reslist = await request({
    //   url: "/api/userAddressList",
    //   data: {
    //     token
    //   }
    // })
    // console.log(reslist);
    // if (!token) {
    //   const openid = wx.getStorageSync("openid");
    //   const restoken = await request({
    //     url: "/api/refreshToken",
    //     data: {
    //       openid
    //     }
    //   }).then((res) => {
    //     console.log(res);
    //   })
    //   return;
    // }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})