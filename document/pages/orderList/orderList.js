// pages/orderList/orderList.js
import {
  request,
} from "../../request/index";
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    tabs: [{
        id: 0,
        name: "所有订单",
        isActive: true
      },
      {
        id: 1,
        name: "未付款",
        isActive: false
      },
      {
        id: 2,
        name: "已付款",
        isActive: false
      },
    ],
    orderList: [],
    orderListshow: false
  },
  //商品点击事件
  handeGoodCheng(e) {
    const {
      goosid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../product/product?good_id=${goosid}`,
    })
  },
  //再次购买按钮
  async handleBuyAgain(e) {
    let {
      goosmsg
    } = e.currentTarget.dataset;
    const token = wx.getStorageSync('token')
    await goosmsg.forEach(ele => {
      request({
        url: "/api/shoppingCarAddModify",
        data: {
          token,
          good_id: ele.good_id,
          num: ele.num,
          price: ele.price,
          money: ele.money,
          sku: ele.sku
        }
      })
    })
    $Toast({
      content: ' -已成功添加至购物车- 请前往购物车结算',
      type: 'success',
      duration: 2
    });
  },
  //顶部切换按钮
  async handeItemChange(e) {
    const {
      index
    } = e.detail
    let tabs = JSON.parse(JSON.stringify(this.data.tabs));
    tabs.forEach((ele, i) => i === index ? ele.isActive = true : ele.isActive = false)
    this.setData({
      tabs
    })
    const token = wx.getStorageSync('token');
    let resOrderList;
    if (index) {
      resOrderList = await request({
        url: "/api/orderList",
        data: {
          token,
          status: index
        }
      })
    } else {
      resOrderList = await request({
        url: "/api/orderList",
        data: {
          token,
        }
      })
    }
    this.orderListShow(resOrderList)
  },
  //初始化
  async init(index) {
    let tabs = JSON.parse(JSON.stringify(this.data.tabs));
    tabs.forEach((ele, i) => i === index ? ele.isActive = true : ele.isActive = false)
    this.setData({
      tabs
    })
    const token = wx.getStorageSync('token');
    let resOrderList;
    if (index) {
      resOrderList = await request({
        url: "/api/orderList",
        data: {
          token,
          status: index
        }
      })
    } else {
      resOrderList = await request({
        url: "/api/orderList",
        data: {
          token,
        }
      })
    }
    this.orderListShow(resOrderList)
  },
  //判断有无数据是否页面
  orderListShow(datas) {
    if (datas.data.data.data) {
      datas.data.data.data.forEach((ele, index) => {
        console.log(ele)
        if (ele.status === 1) {
          ele.status_text = "已取消"
        } else if (ele.status === 2) {
          ele.status_text = "已支付"
        } else if (ele.status === 3) {
          ele.status_text = "未发货"
        } else if (ele.status === 4) {
          ele.status_text = "已发货"
        } else if (ele.status === 5) {
          ele.status_text = "已收货"
        } else if (ele.status === 6) {
          ele.status_text = "退款"
        }
      })
      for (let i = 0; i < datas.data.data.data.length; i++) {
        if (!datas.data.data.data[i].childern) {
          datas.data.data.data.splice(i, 1);
          i--;
        }
      }
      this.setData({
        orderList: datas.data.data.data
      });
      this.setData({
        orderListshow: true
      })
    } else {
      this.setData({
        orderListshow: false
      })
    }
  },
  onLoad: function (options) {
    let index = Number(options.index)
    this.init(index);
  },
})