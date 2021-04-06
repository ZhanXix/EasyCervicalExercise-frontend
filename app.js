// app.js
var call = require("utils/util.js")

App({
  globalData: {
    //放入本地缓存中的数据：
    // userId: 0,
    // userInfo: {
    //   avatarUrl: "/icons/default_avatar.png",
    //   nickName: "未登录用户",
    //   gender: 0,
    //   hasUserInfo: false,
    // },
    // exerciseId: 0,
    // videoSrc: null, //视频暂存
    host: 'http://192.168.123.13:5000'    //服务器url
  },

  onLaunch() {
    var that=this
    // 登录
    wx.login({
      success (res) {
        if (res.code) {
          console.log('wx.login success, code =', res.code)
          //call.require("/login", res.code, that.loginSuccess, that.loginFail)
          that.loginSuccess(1415926)
        } else {
          console.log('wx.login fail' + res.errMsg)
          wx.setStorageSync('userId', 0)
        }
        console.log("setStorageSync, userId =" ,wx.getStorageSync('userId'))
      }
    })
    // 获取用户信息
    var userInfo = {}
    if (wx.getStorageSync('userInfo')){
      userInfo = wx.getStorageSync('userInfo')
    } else {
      userInfo = {
        avatarUrl: "/icons/default_avatar.png",
        nickName: "未登录用户",
        gender: 0,
        hasUserInfo: false,
      }
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              userInfo.avatarUrl = res.userInfo.avatarUrl
              userInfo.nickName = res.userInfo.nickName
              userInfo.gender = res.userInfo.gender
              userInfo.hasUserInfo = true
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回，所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    try {
      wx.setStorageSync('userInfo', userInfo) 
    } catch (e) { 
      console.log("setStorageSync userInfo error", e)
    }
    console.log("setStorageSync, userInfo =",wx.getStorageSync('userInfo'))
  },

  loginSuccess(e) {
    wx.setStorageSync('userId', e)
  },
})
