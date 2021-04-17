// pages/userlog/userlog.js
var Charts = require('../../utils/wxcharts')
var call = require("../../utils/request.js")
const app = getApp()

// 为了使canvas在不同屏幕自适应进行以下换算
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
const code_w = 680 / rate;           //柱状图的宽
const code_h = 290 / rate;       //柱状图的高

Page({
  // * 页面的初始数据
  data: {
    total_times: 34,
    total_duration: 26,
    total_day:9,
    continuous_day:3,
    day_time:[2,1,4,0,6,2,3],
    from_day:'',
    to_day:'',
    categories:[],
    max: 999
  },

  // * 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setChartData()
    this.charts()
  },

  //设置图表数据
  setChartData: function () {
    var that = this
    //运动数据相关
    //call.require("/getUserLog",wx.getStorageSync('userId'),this.getUserLogSuccess,this.getUserLogFail)
    let max = that.data.day_time[0];
    for (let i = 0; i < that.data.day_time.length - 1; i++) {
      max = max < that.data.day_time[i+1] ? that.data.day_time[i+1] : max
    }
    if (max == 0){
      max = 999
    } 
    //日期相关
    var from_day = ''
    var to_day = ''
    var categories = []
    var week_arry = ['周日','周一','周二','周三','周四','周五','周六']
    var date = new Date()
    var week_day = date.getDay()
    console.log(week_day)
    var month = date.getMonth() + 1
    to_day =  month + '/' + date.getDate()
    for(let i = 6; i >= 0; i--){
      categories[i] = week_arry[week_day]
      week_day--
      if(week_day < 1){
        week_day += 7
      }
    }
    date.setDate(date.getDate() - 6);
    month = date.getMonth() + 1
    from_day = month + '/' + date.getDate()
    //设置数据
    that.setData({  
      from_day: from_day,
      to_day: to_day,
      categories : categories,
      max : max
    })
  },
  getUserLogSuccess(){
    console.log("require getUserLog Success")
  },
  getUserLogFail(){
    console.log("require getUserLog Fail")
  },
 
  //分享
  onShareAppMessage(res) {
    return {
      //let gbid = res.target.dataset.info;
      title: '我在轻松颈椎操已经运动了' + this.data.total_times + '次啦, 你也一起来吧！~',
      path: '/pages/userlog/userlog',
      success: function (res) {
	    // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
        console.log("onShareAppMessage success, path =", path)
      },
      fail: function (res) {
        console.log("onShareAppMessage fail")
      },
    }
  },

  //画图
  charts:function(){
    let _this=this
    return new Promise(function () {

    new Charts({
      canvasId: 'columnCanvas',
      dataPointShape: false,
      type: 'column',
      legend: false,
      dataLabel: false,  //是否在图表中显示数据内容值
      categories: _this.data.categories,
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      series: [{
        name: '成交量',
        data: _this.data.day_time,
        color: "rgba(0, 0, 0, 1)"
      }
      ],
      yAxis: {
        disableGrid: false,
        gridColor: "#E7E7E7",
        fontColor: "#E7E7E7",
        min: 0,
        max: _this.data.max,
        disabled: true,
      },
      dataItem: {
        color: "#e7e7e7"
      },
      width: code_w,
      height: code_h,
      extra: {
        column: {
          width: 18,
        },
      }
    })
    })
  }
  // charts:function(){
  //   let _this=this
  //   new Charts({
  //     canvasId: 'columnCanvas',
  //     dataPointShape: false,
  //     type: 'column',
  //     legend: false,
  //     dataLabel: false,  //是否在图表中显示数据内容值
  //     categories:_this.data.categories,
  //     series: [{
  //       name: '打卡记录',
  //       data: _this.data.day_time,
  //       color: "rgba(0, 0, 0, 1)"
  //     }],
  //     xAxis: {
  //       disableGrid: true,
  //       type: 'calibration'
  //     },
  //     yAxis: {
  //       disableGrid: true,
  //       type: 'calibration',
  //       gridColor: "#E7E7E7",
  //       fontColor: "#ffffff",
  //       min: 0,
  //       max: _this.data.max,
  //       disabled: true,
  //       fontColor: "#e7e7e7"
  //     },
  //     dataItem: {
  //       color: "#e7e7e7"
  //     },
  //     width: code_w,
  //     height: code_h,
  //     extra: {
  //       column: {
  //         width: 18,
  //         legendTextColor: "#313131"
  //       },
  //     }
  //   })
  //  }
})