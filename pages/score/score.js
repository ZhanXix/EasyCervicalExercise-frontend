// pages/score/score.js
var call = require("../../utils/request.js")

Page({
  // * 页面的初始数据
  data: {
    userVideoSrc: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/69d7fa0e-663c-4607-91ad-2f585d5aa785.mp4",
    score: 80,
  },

  //* 生命周期函数--监听页面加载
  onLoad: function (options) {
    var userId = wx.getStorageSync('userId')
    var userVideoSrc = wx.getStorageSync('videoSrc')
    console.log("getStorageSync, userId =", userId, "userVideoSrc =", userVideoSrc)
    if (userVideoSrc){
      this.setData({
        userVideoSrc: userVideoSrc
      })
    }
    //call.require('/getScore', userId, this.getScoreSuccess, this.getScoreFail)
  },
  getScoreSuccess(res){
    this.setData({
      score: res.score
    })
  },
  getScoreFail(res){
  },

  shareUservideo: function() {
    //分享
    console.log("用户点击分享")
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