// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exerciseData:[
      {"exerciseId": 1,
      "exerciseName": "训练项目1", 
      "isCollect": 0,
      "time": 30,
      "usernum": 75,
      "image": "/icons/test.png"
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