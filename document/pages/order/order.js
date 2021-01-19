// pages/order/order.js
import {
  request
} from "../../request/index";
Page({

  data: {
    address: {},
    goodsMsg: [],
    addressShow: false,
    goodsNumber: 1,
    original_price: 0,
  },
  //更换地址
  handleChooseAdd() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  //加减数量
  // handletap(e) {
  //   const operation = e.currentTarget.dataset.operation;
  //   let original_price;
  //   if (operation > 0) {
  //     this.setData({
  //       goodsNumber: this.data.goodsNumber += operation
  //     })
  //   } else {
  //     if (this.data.goodsNumber > 1) {
  //       this.setData({
  //         goodsNumber: this.data.goodsNumber += operation
  //       })
  //     }
  //   }
  //   original_price = (this.data.goodsMsg.promotion_price * this.data.goodsNumber).toFixed(2);
  //   this.setData({
  //     original_price
  //   })
  // },
  //支付按钮
  handleOrderPay() {
    // const token = wx.getStorageSync('token');
    // const payres = await request({
    //   url: "/api/generateOrder",
    //   data: {
    //     token,
    //     address_id: JSON.parse(wx.getStorageSync('selectAddress')).address_id,
    //     money: this.data.original_price,
    //   }
    // })
  },
  //初始化
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
    let res = await request({
      url: "/api/goodInfo",
      data: {
        good_id: "1008"
      }
    })
    res.data.data.promotion_price = "0.10"
    let goodsMsgs = this.data.goodsMsg;
    goodsMsgs.push(res.data.data);
    this.setData({
      goodsMsg: goodsMsgs
    })
    this.setData({
      original_price: Number(res.data.data.promotion_price).toFixed(2)
    })
    console.log(this.data.original_price);
  },

  onLoad: function (options) {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})