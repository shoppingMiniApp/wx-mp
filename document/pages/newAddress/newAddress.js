// pages/newAddress/newAddress.js
import {
  request
} from "../../request/index";
const {
  $Toast
} = require('../../dist/base/index');
const {
  $Message
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
    },
    delbtn: false,
    visible1: false
  },
  onLoad: function (options) {
    if (options.data) {
      let addressce = JSON.parse(options.data);
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
        address: addressce.procince + addressce.city + addressce.area,
        delbtn: true
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
  //删除地址按钮
  delAddress() {
    this.setData({
      visible1: true
    });
  },
  //模态框确定按钮回调
  async handleClose() {
    const token = wx.getStorageSync('token');
    const res = await request({
      url: "/api/userAddressDelete",
      data: {
        token,
        id: this.data.address_ids.address_id
      }
    })
    this.setData({
      visible1: false
    });
    $Toast({
      content: '删除成功',
      type: 'success',
      duration: 0
    });
    setTimeout(() => {
      $Toast.hide();
      wx.navigateTo({
        url: '../address/address',
      })
    }, 2000);
  },
  //模态框取消按钮回调
  handleClose1() {
    this.setData({
      visible1: false
    });
  },
  //保存地址按钮
  async saveAddress() {
    const addressMsg = this.data;
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
      const res = await request({
        url: "/api/userAddressAddModify",
        data: datas
      });

      if (res.data.code === 2000) {
        if (this.data.switch1) {
          let id = ""
          if (this.data.address_ids.address_id === "") {
            id = res.data.other.add_address_id;
          } else {
            id = this.data.address_ids.address_id;
          }
          const resl = await request({
            url: "/api/userAddressDfault",
            data: {
              token,
              id
            }
          })
        }
        $Toast({
          content: '操作成功',
          type: 'success',
          duration: 0
        });
        setTimeout(() => {
          $Toast.hide();
          wx.navigateTo({
            url: '../address/address',
          })
        }, 2000);
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