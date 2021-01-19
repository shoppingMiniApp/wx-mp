// pages/address/address.js
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";

Page({
  data: {
    userAddressData: [],
    current: "",
  },
  handleFruitChange({ detail = {} }) {
    console.log(detail);
    this.setData({
      current: detail.value,
    });
    this.data.userAddressData.forEach((element) => {
      if (detail.value == element.address_id) {
        wx.setStorageSync("selectAddress", JSON.stringify(element));
        wx.navigateTo({
          url: "../order/order",
          success: (result) => {},
        });
      }
    });
  },

  async handleImportSite() {
    try {
      const res2 = await chooseAddress();
      let userAddressData = {
        name: res2.userName,
        consignee: res2.userName,
        phone: res2.telNumber,
        procince: res2.provinceName,
        city: res2.cityName,
        area: res2.countyName,
        detailed: res2.detailInfo,
      };
      // console.log(userAddressData);
      const token = wx.getStorageSync("token");
      const setAddress = await request({
        url: "/api/userAddressAddModify",
        data: {
          token: token,
          phone: userAddressData.phone,
          procince: userAddressData.procince,
          city: userAddressData.city,
          area: userAddressData.area,
          name: userAddressData.name,
          detailed: userAddressData.detailed,
        },
      });

      console.log(setAddress);
      this.getAddress();
      //设置本地数据

      //将数据上传至服务器
      // const address = await request({})
    } catch (error) {
      console.log(error);
    }
  },
  async getAddress() {
    const token = wx.getStorageSync("token");
    const reslists = await request({
      url: "/api/userAddressList",
      data: {
        token: token,
      },
    });
    let addressList = reslists.data.data;
    console.log(addressList);
    this.setData({
      userAddressData: addressList,
    });
  },
  onLoad: function (options) {
    this.getAddress();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
