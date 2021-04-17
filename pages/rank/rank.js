// pages/rank/rank.js
var call = require("../../utils/request.js")

Page({
  // * 页面的初始数据
  data: {
    "my":{
      "score": 0,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar":"/icons/default_avatar.png",
    },
    "myrank": "28",
    "rank_list":[
      {"score": 98,
      "user_name": "小机器人",
      "user_id": "",
      "avatar": "/icons/win_avatar.jpeg",
      },
      {"score": 95,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar": "/icons/default_avatar.png",
      },
      {"score": 94,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar": "/icons/default_avatar.png",
      },
      {"score": 92,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar": "/icons/default_avatar.png",
      },
      {"score": 91,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar": "/icons/default_avatar.png",
      },
    ]
  },

  // * 生命周期函数--监听页面加载
  onLoad: function (options) {
    var my = {
      "score": 80,
      "user_name": "未登录用户",
      "user_id": "",
      "avatar":"/icons/default_avatar.png",
    }
    var userId = wx.getStorageSync('userId')
    var exerciseId = wx.getStorageSync('exerciseId')
    let userInfo = wx.getStorageSync('userInfo')
    console.log("getStorageSync, userId =", userId, "exerciseId =", exerciseId, "userInfo = ", userInfo)
    if(userInfo.hasUserInfo){
      my.user_name = userInfo.nickName
      my.avatar = userInfo.avatarUrl
      my.user_id = userId
      this.setData({
        my: my
      })
    }
    var POST = {
      userId,
      exerciseId
    }
    //call.request("/getRank", POST, this.getRankSuccess, this.getRankFail)
  },
  getRankSuccess(res){},
  getRankFail(res){},

  //分享
  onShareAppMessage(res) {
    return {
      //let gbid = res.target.dataset.info;
      title: '我在轻松颈椎操的总排名是' + this.data.myrank + ',你也来看看吧！~',
      path: '/pages/rank/rank',
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