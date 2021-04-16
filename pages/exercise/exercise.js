// pages/exercise/exercise.js
var call = require("../../utils/request.js")
const app = getApp()

Page({ 
  //  * 页面的初始数据
  data: {
    exerciseData:[
      // {"duration": 30,
      // "exerciseId": 1,
      // "exerciseName": "训练项目1", 
      // "image": "/icons/test.png",
      // "isCollect": 0,
      // "main_points": "olik",
      // "title": "动作要点",
      // "user_id": "1",
      // "usernum": 99,
      // "video": "erty"
      // }
    ],
    keyId: 0
  },

  onLoad(){
    var that = this
    wx.showLoading({
      title: '服务器联络中...',
      mask: true
    })
    var userId = wx.getStorageSync('userId')
    var a = setInterval( function () { 
      //循环执行代码 
      userId = wx.getStorageSync('userId')
      console.log("wait to FirstLogin...")
      if(userId == "error"){
        wx.setStorageSync('userId', null)
        clearInterval(a) 
        wx.hideLoading()
        wx.showLoading({
          title: '服务器失踪中！',
          mask: true
        })
      } else 
      if (userId) { 
        clearInterval(a) 
        // GET show_exercise_video_by_userId
        // 127.0.0.1:5000/show_exercise_video?user_id=1
        var url = "show_exercise_video?user_id=" + userId
        call.getData(url, that.GetExerciseDataSuccess, that.GetExerciseDataFail)
      } 
    }, 1000)
  },
  GetExerciseDataSuccess(res){
    if(res.code == 200){
      var exerciseData = res.data
      for (let i = 0; i < exerciseData.length; i++) {
        exerciseData[i].image = app.globalData.host + res.data[i].image
      }
      console.log("GetExerciseDataSuccess,", exerciseData)
      this.setData({
        exerciseData: exerciseData
      })
    } else {
      console.log("GetExerciseData Server Error")
      wx.hideLoading()
      wx.showLoading({
        title: '服务器失踪中！',
        mask: true
      })
    }
  },
  GetExerciseDataFail(){
    console.log("GetExerciseData Fail")
    wx.hideLoading()
    wx.showLoading({
      title: '服务器失踪中！',
      mask: true
    })
  },

  //去运动详情页
  gotoDetail(e) {
    wx.setStorageSync('exerciseId', e.currentTarget.dataset.operation)
    console.log("setStorageSync, exerciseId =", e.currentTarget.dataset.operation)
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },

  //添加收藏
  addFavorites (e) {
    var that  = this;
    var exerciseId = e.target.dataset.exerciseid;
    var keyId = e.target.dataset.keyid;
    var userId = wx.getStorageSync("userId")
    let arrCut = 'exerciseData[' + keyId + '].isCollect'  
    that.setData({
      [arrCut]:1,
      keyId: keyId
    })
    // GET add_user_favor
    // 127.0.0.1:5000/add_favor?user_id=1&exerciseId=1
    var url = "add_favor?user_id=" + userId + "&exerciseId=" + exerciseId
    console.log("addFavorites", url)
    call.getData(url, that.addFavoritesSuccess, that.addFavoritesFail);
  },
  addFavoritesSuccess (res) {
    var that = this;
    if (res.code == 200){
      console.log("addFavoritesSuccess, keyId =", that.data.keyId)
      wx.showToast({
        title: "收藏成功",
        icon: 'success',
        duration: 1000
      })
    } else {
      that.addFavoritesFail()
    }
  },
  addFavoritesFail(){
    console.log("addFavoritesFail, keyId =", this.data.keyId)
    let arrCut = 'exerciseData[' + this.data.keyId + '].isCollect'  
    this.setData({
      [arrCut]:0,
    })
    wx.showToast({
      title: "收藏失败了OAO", 
      icon: 'error',
      duration: 2000
    })
  },

  //取消收藏
  reduceFavorites (e) {
    var that  = this;
    var exerciseId = e.target.dataset.exerciseid;
    var keyId = e.target.dataset.keyid;
    var userId = wx.getStorageSync("userId")
    let arrCut = 'exerciseData[' + keyId + '].isCollect'  
    that.setData({
      [arrCut]:0,
      keyId: keyId
    })
    // GET delete_user_favor
    // 127.0.0.1:5000/delete_favor?user_id=1&exerciseId=1
    var url = "delete_favor?user_id=" + userId + "&exerciseId=" + exerciseId
    console.log("reduceFavorites", url)
    call.getData(url, that.reduceFavoritesSuccess, that.reduceFavoritesFail);
  },
  reduceFavoritesSuccess(res){
    var that = this;
    if (res.code == 200){
      console.log("addFavoritesSuccess, keyId =", that.data.keyId)
      wx.showToast({
        title: "取消收藏成功",
        icon: 'success',
        duration: 1000
      })
    } else {
      that.addFavoritesFail()
    }
  },
  reduceFavoritesFail(){
    console.log("addFavoritesFail, keyId =", this.data.keyId)
    let arrCut = 'exerciseData[' + this.data.keyId + '].isCollect'  
    this.setData({
      [arrCut]:1,
    })
    wx.showToast({
      title: "取消收藏失败", 
      icon: 'error',
      duration: 2000
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