// pages/address/address.js
import {
  getSetting,
  chooseAddress,
  openSetting
} from "../../utils/asyncWx.js";
import {
  request
} from "../../request/index.js";
const {
  $Message
} = require('../../dist/base/index');
Page({
  data: {
    userAddressData: [],
    current: "",
    addressListShow: false
  },
  //编辑收货地址
  editAddress(e) {
    const address = JSON.stringify(e.currentTarget.dataset.address)
    wx.navigateTo({
      url: '../newAddress/newAddress?data=' + address,
    })
  },
  //新增收货地址
  handleAddSite() {
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },
  //单选按钮功能
  handleFruitChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value,
    });
    this.data.userAddressData.forEach((element) => {
      if (detail.value == element.address_id) {
        wx.setStorageSync("selectAddress", JSON.stringify(element));
        wx.navigateTo({
          url: "../order/order",
        });
      }
    });
  },
  //将获取到的微信地址添加至服务器
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

      this.getAddress();
      //设置本地数据

      //将数据上传至服务器
      // const address = await request({})
    } catch (error) {
      console.log(error);
    }
  },
  //获取服务器地址列表
  async getAddress() {
    const token = wx.getStorageSync("token");
    const reslists = await request({
      url: "/api/userAddressList",
      data: {
        token: token,
      },
    });
    let addressList = reslists.data.data;
    this.setData({
      userAddressData: addressList,
    });
  },

  onLoad: function (options) {
    if (options.index == "order") {
      this.setData({
        addressListShow: true
      })
    } else {
      this.setData({
        addressListShow: false
      })
    }
    if (options.address_id) {
      this.setData({
        current: options.address_id,
      });
    }
    this.getAddress();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});