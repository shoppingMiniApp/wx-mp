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
      url: '../address/address?index=order'
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
        request({
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
  //初始化
  async init() {
    //获取缓存地址
    let LocalAddress = wx.getStorageSync('selectAddress');
    let address = {}
    if (!LocalAddress) {
      let token = wx.getStorageSync('token')
      const addressList = await request({
        url: "/api/userAddressList",
        data: {
          token
        }
      })
      //取出默认地址
      addressList.data.data.forEach(element => {
        if (element.default) {
          address = element;
        }
      });
      //如果默认地址存在，显示默认地址
      if (address.name) {
        this.setData({
          address,
          addressShow: true
        });
      }
    } else {
      this.setData({
        address: JSON.parse(LocalAddress),
        addressShow: true
      });
    }
    //情况商品列表
    let goodsMsgs = this.data.goodsMsg;
    goodsMsgs = [];
    //获取购物车传来的缓存商品列表
    let checkList = wx.getStorageSync('checkList');
    //更新商品列表
    checkList.forEach((element, index) => {
      goodsMsgs[index] = element;
    });

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