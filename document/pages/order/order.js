// pages/order/order.js
import {
  request,
  requestPayment,
  showToast
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
  //支付按钮
  async handleOrderPay() {
    try {
      const token = wx.getStorageSync('token');
      let goodsMsg = this.data.goodsMsg;
      let shopping_car_Id = []
      goodsMsg.forEach((ele) => {
        shopping_car_Id.push(ele.shopping_car_id);
      })
      const payres = await request({
        url: "/api/generateOrder",
        method: "POST",
        data: {
          token,
          address_id: JSON.parse(wx.getStorageSync('selectAddress')).address_id,
          money: this.data.original_price,
          shopping_car_ids: shopping_car_Id
        }
      })
      let mypackage = "prepay_id=" + payres.data.data.prepay_id;
      const requestPay = await requestPayment({
        nonceStr: payres.data.data.nonce_str,
        package: mypackage,
        paySign: payres.data.data.paySign,
        timeStamp: payres.data.data.timeStamp,
        signType: "MD5",
      })
      await showToast({
        title: '支付成功',
        icon: 'success'
      })
      //支付成功后删除购物车数据
      shopping_car_Id.forEach(ele => {
        await request({
          url: "/api/shoppingCarDelete",
          data: {
            token,
            shopping_car_id: ele
          }
        })
      });
      //支付成功后跳往的页面
      // wx.navigateTo({
      //   url: '',
      // })
    } catch (error) {
      await showToast({
        title: '支付失败',
        icon: 'none'
      })
    }

  },
  //查看订单
  handleOrderList() {
    const token = wx.getStorageSync('token');
    const addressList = request({
      url: "/api/orderList",
      method: "POST",
      data: {
        token
      }
    })
    console.log(addressList);
  },
  //初始化
  async init() {
    let LocalAddress = wx.getStorageSync('selectAddress');
    let address = {}
    if (!LocalAddress) {
      // console.log(2)
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
      // console.log(1)
      this.setData({
        address: JSON.parse(LocalAddress),
        addressShow: true
      });
    }
    console.log(this.data.address)

    let goodsMsgs = this.data.goodsMsg;
    goodsMsgs = [];
    let checkList = wx.getStorageSync('checkList');
    checkList.forEach((element, index) => {
      goodsMsgs[index] = element;
    });
    console.log(checkList)
    let sumMoney = 0
    checkList.forEach((ele) => {
      sumMoney += Number(ele.money) * ele.num;
    })
    this.setData({
      goodsMsg: goodsMsgs
    })
    this.setData({
      original_price: sumMoney.toFixed(2)
    })
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