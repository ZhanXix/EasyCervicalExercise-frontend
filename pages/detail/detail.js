// pages/detail/detail.js
var call = require("../../utils/request.js")
const app = getApp()

Page({
  // * 页面的初始数据
  data: {
    exercise_video_src: ''
    //"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/69d7fa0e-663c-4607-91ad-2f585d5aa785.mp4"
    ,
    if_record: 0,
    not_hide: 1,
    record_end: 0,
    ctx: null, //ctx, 即CameraContext, 与页面内唯一的 camera 组件绑定，操作对应的 camera 组件
    },

  // * 生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.setStorageSync('score', null)
    this.setData({
      not_hide: 1
    })
    //GET show_exercise_video_by_userId&exerciseId
    //127.0.0.1:5000/show_exercise_video?user_id=1&exerciseId=1
    var url = "/show_exercise_video?user_id=" + wx.getStorageSync('userId') + "&exerciseId=" + wx.getStorageSync('exerciseId')
    console.log("getData:" + url)
    call.getData(url, this.getExerciseVideoSrcSuccess, this.getExerciseVideoSrcFail)
    //创造CameraContext，申请摄像权限
    this.ctx = wx.createCameraContext()
    //console.log("createCameraContext, this.ctx =", this.ctx)
    //申请录音权限
    wx.startRecord({})
    wx.stopRecord({})
  },
  getExerciseVideoSrcSuccess(res){
    var that = this
    //console.log(res)
    if(res.code == 200){
      that.setData({
        exercise_video_src: app.globalData.host + res.data[0].video
      })
      console.log("getExerciseVideoSrcSuccess, src =", that.data.exercise_video_src)
    } else {
      taht.getExerciseVideoSrcFail()
    }
  },
  getExerciseVideoSrcFail(){
    wx.showToast({
      title: "加载失败了OAO", 
      icon: 'error',
      duration: 2000
    })
  },

  //按钮：进入录制评分界面
  EnterRecord:function(){
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.camera"] && res.authSetting["scope.record"]) {
          //用户提供了摄像头权限
          that.setData({
            if_record: 1,
          })
          that.StartRecord()
        } else {
          //用户未提供摄像头权限
          that.setData({
            if_record: 0,
          })
          that.NotAllowCamera()
        } 
      }
    })
  },
  //开始录制
  StartRecord:function(){
    var that = this
    that.ctx.startRecord({
      success: () => {
        console.log('StartRecord success')
      },
      fail:(res) =>{
        console.log("StartRecord fail",res)
      },
      timeoutCallback: (res) =>{  //超时
        if(!that.data.record_end){
          that.setData({
            record_end: 1
          })
          wx.setStorageSync('videoSrc', res.tempVideoPath)
          console.log('StartRecord timeout, tempVideoPath =', res.tempVideoPath);
          that.UploadRecord()
          wx.navigateTo({ //实现页面的跳转
            url: "/pages/score/score",
          })
        }   
      }
    })
  },
  //中途退出录制
  ExitRecord:function(){
    this.setData({
      if_record: 0,
      record_end: 0,
    })
    this.ctx.stopRecord()
    console.log("ExitRecord")
  },
  //结束录制并打分
  EndRecord: function(){
    var that = this
    if(!that.data.record_end){
      that.setData({
        record_end: 1
      })
      that.ctx.stopRecord({ 
        fail:(res)=>{
          console.log('EndRecord fail',res)
          wx.showModal({
            title: '提示',
            content: '录制视频出错了o(╥﹏╥)o',
            showCancel: false,//是否显示取消按钮
            confirmText:"确定",//默认是“确定”
          })
          this.setData({
            if_record: 0,
          })
          this.ctx.stopRecord()
        },
        success: (res) => {
          wx.setStorageSync('videoSrc', res.tempVideoPath)
          console.log('EndRecord success, tempVideoPath =', res.tempVideoPath)
          that.UploadRecord()
          wx.navigateTo({ //实现页面的跳转
            url: "/pages/score/score",
          })
        },
        complete:(res)=>{},
      })
    }
  },
  //上传录像
  UploadRecord: function(){
    var userId = wx.getStorageSync('userId')
    var exerciseId = wx.getStorageSync('exerciseId')
    var videoSrc = wx.getStorageSync('videoSrc')
    console.log("UploadRecord, userId =", userId, "exerciseId =", exerciseId , "videoSrc =", videoSrc)
    wx.showLoading({
      title: '评分中...',
      mask: true,
    })
    wx.uploadFile({
      filePath: videoSrc,
      name: "user_video",
      // header: {
      //   "content-type": "application/json;charset=UTF-8"
      // },
      formData : {
        user_id: JSON.stringify(userId),
        exerciseId: JSON.stringify(exerciseId)
      }, 
      url: app.globalData.host + '/upload_user_video',
      success:(res)=>{
        console.log("upLoadFile success", res)
        if(res.statusCode == 200){
          let score = JSON.parse(res.data).data.score
          wx.setStorageSync('score', score)
        } else {
          console.log("upLoadFile error:", res.errMsg)
        }
      },
      fail:()=>{
        console.log("upLoadFile fail")
      },
    })
  },
  //用户不允许使用摄像头和麦克风
  NotAllowCamera:function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您未开启摄像头与麦克风，无法评分！（录制视频仅用于打分使用，我们将保护您的隐私）',
      showCancel: true,//是否显示取消按钮
      cancelText:"取消",//默认是“取消”
      confirmText:"确定",//默认是“确定”
      success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击确定
            wx.openSetting({
              withSubscriptions: false, //是否同时获取用户订阅消息的订阅状态，默认不获取
            })
          }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  
  // * 生命周期函数--监听页面隐藏
  onHide: function () {
    this.setData({
      if_record: 0,
      record_end: 0,
      not_hide: 0
    });
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