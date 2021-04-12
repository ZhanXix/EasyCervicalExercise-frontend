// pages/exercise/exercise.js
var call = require("../../utils/request.js")
const app = getApp()

Page({ 
  //  * 页面的初始数据
  data: {
    exerciseData:[
      {"exerciseId": 1,
      "exerciseName": "训练项目1", 
      "isCollect": 0,
      "time": 30,
      "usernum": 75,
      "image": "/icons/test.png"
      },
      {"exerciseId": 2,
      "exerciseName": "训练项目2", 
      "isCollect": 0,
      "time": 30,
      "usernum": 23,
      "image": "/icons/test2.png"
      },
      {"exerciseId": 3,
      "exerciseName": "训练项目3", 
      "isCollect": 0,
      "time": 30,
      "usernum": 49,
      "image": "/icons/test3.png"
      }
    ],
    keyId: 0
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
    that.setData({
      keyId: keyId
    })
    // GET add_user_favor
    // 127.0.0.1:5000/add_favor?user_id=1&exerciseId=1
    var url = "add_favor?user_id=" + userId + "&exerciseId=" + exerciseId
    call.getData(url, that.addFavoritesSuccess, that.addFavoritesFail);
  },
  addFavoritesSuccess (res) {
    var that = this;
    let arrCut = 'exerciseData[' + that.data.keyId + '].isCollect'  
    if (res=="200"){
      that.setData({
        [arrCut]:1
      })
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
    wx.showToast({
      title: "服务出错了OAO", 
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
    that.setData({
      keyId: keyId
    })
    // GET delete_user_favor
    // 127.0.0.1:5000/delete_favor?user_id=1&exerciseId=1
    var url = "delete_favor?user_id=" + userId + "&exerciseId=" + exerciseId
    call.getData(url, that.reduceFavoritesSuccess, that.reduceFavoritesFail);
  },
  reduceFavoritesSuccess(res){
    var that = this;
    if (res=="200"){
      let arrCut = 'exerciseData[' + that.data.keyId + '].isCollect'  
      that.setData({
        [arrCut]:0
      })
      console.log("reduceFavoritesSuccess, keyId =", that.data.keyId)
      wx.showToast({
        title: "取消收藏成功",
        icon: 'success',
        duration: 1000
      })
    } else {
      that.reduceFavoritesFail()
    }
  },
  reduceFavoritesFail(){
    console.log("reduceFavoritesFail, keyId =", this.data.keyId)
    wx.showToast({
      title: "服务出错了OAO", 
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