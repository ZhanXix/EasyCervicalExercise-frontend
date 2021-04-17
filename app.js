// app.js
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
    //host: 'http://1.116.103.4:5000/' //远程服务器地址
    host: 'http://192.168.43.74:5000/' //局域网调试地址
  },

  onLaunch() {
    wx.setStorageSync('userId', null)
    var that=this
    // 登录
    wx.login({
      success (res) {
        if (res.code) {
          var code = res.code
          console.log('wx.login success, code =', code)
          that.FirstLogin(code)
        } else {
          console.log('wx.login fail' + res.errMsg)
          wx.setStorageSync('userId', 1415926)
          console.log("getStorageSync, userId =" ,wx.getStorageSync('userId'))
        }
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

  FirstLogin(code){
    var that = this
    // 127.0.0.1:5000/first_login?code=zrx
    var url = that.globalData.host + "first_login?code=" + code
    wx.showLoading({
      title: '服务器联络中...',
      mask: true
    })
    wx.request({
      url: url,
      header: {
        "content-type": "application/json;charset=UTF-8"
       },
      method: 'GET',
      success: function (res) {
        if(res.statusCode == 200){
          console.log("FirstLogin Success")
          wx.setStorageSync('userId', res.data.data.user_id)
        } else{
          console.log("FirstLogin Server Error")
          wx.setStorageSync('userId', "error")
        }
      },
      fail: function () {
        console.log('FirstLogin Fail')
        wx.setStorageSync('userId', "error")
      },
      complete: function (){  
        // wx.hideLoading()
        console.log("getStorageSync, userId =" ,wx.getStorageSync('userId'))
      }
    }) 
  }
})
