// pages/login/login.js
var app=getApp()
var Util = require( '../../utils/util.js' )
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    appid: "wx86d519867a6e52d8",
    appsecret: "45502553b6e95e873188f76b27174baf",
    provinceList: app.globalData.provinceList,
    universityList: app.globalData.universityList,
    multiIndex: [0, 0],
    multiArray: [],
    isload:false
  },

  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },

  bindMultiPickerColumnChange(e) {
    console.log(e.detail.column)
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      data.multiArray[1] = this.data.universityList[e.detail.value]
    }
    this.setData(data)
  },


  submit(e){
    var that=this
    that.setData({
      isload:true
    })
    app.globalData.user.university=that.data.multiArray[1][that.data.multiIndex[1]]
    
    wx.request({
      url: 'http://localhost:8080/stusocial/student/register',
      data: JSON.stringify(app.globalData.user),
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "contentType" : 'application/json'
      },
      success: function(res){
        that.setData({
          isload:false
        })
        app.globalData.user=res.data
        var timestamp=Date.parse(new Date())
        var session={
          'user':app.globalData.user,
          'expiration':timestamp+3*24*3600
        }
        wx.setStorageSync('stusocial_login', session)
        wx.redirectTo({
          url: '/pages/index-1/index-1',
          success: function(res){
           
                       
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    that.setData({
      multiArray: [that.data.provinceList, that.data.universityList[that.data.multiIndex[0]]]
    })
    
  },

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      app.globalData.user.name = e.detail.userInfo.nickName;
      app.globalData.user.avatarUrl = e.detail.userInfo.avatarUrl;
      that.setData({
        isload:true
      })
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code:" + res.code);
          // 可以传给后台，再经过解析获取用户的 openid
          // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          wx.request({
            url: 'http://localhost:8080/stusocial/student/login',
            data: {
              code:res.code
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              that.setData({
                isload:false
              })
              if(res.data.id==null || res.data.id==""){
                app.globalData.user.openid=res.data.openid
                that.setData({
                  isHide:true
                })
              }else{
                app.globalData.user=res.data
                var timestamp=Date.parse(new Date())
                var session={
                  'user':res.data,
                  'expiration':timestamp+3*24*3600
                }
                wx.setStorageSync('stusocial_login', session)
                wx.redirectTo({
                  url: '/pages/index-1/index-1',
                  success: function(res){
                    // success
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
                })
              }
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
          
        }
      });
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})