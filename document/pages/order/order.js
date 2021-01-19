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
  handletap(e) {
    const operation = e.currentTarget.dataset.operation;
    let original_price;
    if (operation > 0) {
      this.setData({
        goodsNumber: this.data.goodsNumber += operation
      })
    } else {
      if (this.data.goodsNumber > 1) {
        this.setData({
          goodsNumber: this.data.goodsNumber += operation
        })
      }
    }
    original_price = (this.data.goodsMsg.promotion_price * this.data.goodsNumber).toFixed(2);
    this.setData({
      original_price
    })
  },

  //支付按钮
  async handleOrderPay() {
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
    wx.requestPayment({
      nonceStr: payres.data.data.nonce_str,
      package: mypackage,
      paySign: payres.data.data.paySign,
      timeStamp: payres.data.data.timeStamp,
      signType: "MD5",
      success: (result) => {
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        })
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        })
      }
    })
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

    let goodsMsgs = this.data.goodsMsg;
    let checkList = wx.getStorageSync('checkList');
    let checkLists = []; //临时数组
    checkLists.push(checkList); //临时添加
    goodsMsgs.push(checkList);
    let sumMoney = 0
    checkLists.forEach((ele) => {
      sumMoney += Number(ele.money) * ele.num;
    })
    this.setData({
      goodsMsg: goodsMsgs
    })
    this.setData({
      original_price: sumMoney
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