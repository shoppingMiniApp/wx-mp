// pages/newAddress/newAddress.js
import {
  request
} from "../../request/index";
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    address: "",
    procince: "",
    city: "",
    area: "",
    name: "",
    detailed: "",
    phone: "",
    switch1: false,
    hintShow: false,
    address_ids: {
      address_id: ""
    }
  },
  onLoad: function (options) {
    if (options.data) {
      let addressce = JSON.parse(options.data);
      console.log(addressce)
      let address_ids = {}
      address_ids.address_id = addressce.address_id;
      let area = addressce.area;
      let city = addressce.city;
      let detailed = addressce.detailed;
      let name = addressce.name;
      let phone = addressce.phone;
      let procince = addressce.procince;
      this.setData({
        area,
        city,
        detailed,
        name,
        phone,
        procince,
        address_ids,
        address: addressce.procince + addressce.city + addressce.area
      });
      if (addressce.default) {
        this.setData({
          switch1: true
        })
      }
    }
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'switch1': detail.value
    })
  },
  async saveAddress() {
    const addressMsg = this.data;
    console.log(addressMsg);
    let temp = true;
    for (const key in addressMsg) {
      if (addressMsg[key] === "") {
        temp = false;
        break;
      }
    }
    if (temp) {
      const token = wx.getStorageSync('token');
      let datas = {
        token,
        phone: this.data.phone,
        procince: this.data.procince,
        city: this.data.city,
        area: this.data.area,
        name: this.data.name,
        detailed: this.data.detailed
      }
      if (this.data.address_ids.address_id != "") {
        datas.address_id = this.data.address_ids.address_id
      }
      // const res = await request({
      //   url: "/api/userAddressAddModify",
      //   data: datas
      // });
      console.log(datas)
      if (this.data.switch1) {
        console.log(1)
      }
    } else {
      $Toast({
        content: '有信息填写错误或为空请重新填写',
        type: 'error',
        duration: 3
      });
    }
  },
  bindAddressInput(e) {
    let temp = e.detail.value.includes("省") & e.detail.value.includes("市") & e.detail.value.includes("区")
    if (!temp) {
      this.setData({
        hintShow: true
      })
    } else {
      this.setData({
        hintShow: false
      });
      const procince = e.detail.value.split("省")[0] + "省";
      const city = e.detail.value.split("省")[1].split("市")[0] + "市";
      const area = e.detail.value.split("省")[1].split("市")[1].split("区")[0] + "区";
      this.setData({
        procince,
        city,
        area,
      })
    }

    this.setData({
      address: e.detail.value
    })

  },
  bindDetailedInput(e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  bindNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handeLocation() {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        const procince = res.address.split("省")[0] + "省";
        const city = res.address.split("省")[1].split("市")[0] + "市";
        const area = res.address.split("省")[1].split("市")[1].split("区")[0] + "区";
        const detailed = res.address.split("省")[1].split("市")[1].split("区")[1];
        that.setData({
          procince,
          city,
          area,
          detailed,
        })
        that.setData({
          address: that.data.procince + that.data.city + that.data.area
        });
      },
    })
  }
})