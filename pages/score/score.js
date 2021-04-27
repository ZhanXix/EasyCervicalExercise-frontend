// pages/score/score.js
var call = require("../../utils/request.js")
const app = getApp()

Page({
  // * 页面的初始数据
  data: {
    userVideoSrc: '',
    //"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/69d7fa0e-663c-4607-91ad-2f585d5aa785.mp4",
    score: '',
    photoList: []
  },

  //* 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '评分中...',
    })
    var userId = wx.getStorageSync('userId')
    var userVideoSrc = wx.getStorageSync('videoSrc')
    var score = wx.getStorageSync('score')
    var photoList = wx.getStorageSync('photoList')
    console.log("getStorageSync, userId =", userId, "userVideoSrc =", userVideoSrc)
    var a = setInterval( function () { 
      //循环执行代码 
      score = wx.getStorageSync('score')
      photoList = wx.getStorageSync('photoList')
      console.log("wait to get score...")
      if (score){
        clearInterval(a) 
        wx.hideLoading()
        for(var i=0; i<photoList.length; i++){
          photoList[i] = app.globalData.host + photoList[i]
        }
        that.setData({
          userVideoSrc: userVideoSrc,
          score: score,
          photoList: photoList
        })
        console.log("get score =", score)
      }
    }, 1000)
  },

  DoAgain: function() {
    console.log("用户点击再来一次")
    wx.navigateBack()
  },

  LookUserRank: function() {
    wx.navigateTo({ 
      url: "/pages/rank/rank", // 需要跳转到的页面
    })
  },

  //分享
  onShareAppMessage(res) {
    return {
      //let gbid = res.target.dataset.info;
      title: '我在轻松颈椎操获得了' + this.data.score + '分！你也一起来吧~',
      path: '/pages/exercise/exercise',
      imageUrl: '/icons/share_pic.jpg',
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
})