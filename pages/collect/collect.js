// pages/collect/collect.js
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exerciseData:[]
  },

  onLoad(){
    // GET show_exercise_video_by_userId
    // 127.0.0.1:5000/show_exercise_video?user_id=1
    let userId = wx.getStorageSync('userId')
    let url = "show_exercise_video?user_id=" + userId
    call.getData(url, this.GetCollectSuccess, this.GetCollectFail)
  },
  GetCollectSuccess(res){

  },
  GetCollectFail(){

  },  

  //去运动详情页
  gotoDetail(e) {
    wx.setStorageSync('exerciseId', e.currentTarget.dataset.operation)
    console.log("setStorageSync, exerciseId =", e.currentTarget.dataset.operation)
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },

  //分享
  onShareAppMessage(res) {
    return {
      //let gbid = res.target.dataset.info;
      title: '一起来做轻松颈椎操~',
      path: '/pages/exercise/exercise',
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