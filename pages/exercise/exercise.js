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
    ]
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
    var that=this;
    var exerciseId=e.target.dataset.exerciseid;
    var keyId=e.target.dataset.keyid;
    //call.request(url, postData,this.addFavoritesSuccess, this.fail);
    this.addFavoritesSuccess(keyId);
  },
  addFavoritesSuccess (res) {
    var that = this;
    let arrCut = 'exerciseData[' + res + '].isCollect'  
    that.setData({
      [arrCut]:1
    })
    console.log("addFavoritesSuccess, keyId =", res)
    wx.showToast({
      title: "收藏成功",
      icon: 'success',
      duration: 1000
    })
  },

  //取消收藏
  reduceFavorites (e) {
    var that=this;
    var exerciseId=e.target.dataset.exerciseid;
    var keyId=e.target.dataset.keyid;
    //call.request(url, postData,this.reduceFavoritesSuccess, this.fail);
    that.reduceFavoritesSuccess(keyId);
  },
  reduceFavoritesSuccess(res){
    var that = this;
    let arrCut = 'exerciseData[' + res + '].isCollect'  
    that.setData({
      [arrCut]:0
    })
    console.log("reduceFavoritesSuccess, keyId =", res)
    wx.showToast({
      title: "取消收藏成功",
      icon: 'success',
      duration: 1000
    })
  },

  //request失败
  fail: function () {
    console.log("request失败");
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