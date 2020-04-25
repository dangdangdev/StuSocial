// pages/my/myfollowed/myfollowed.js
var app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    followedStudentList:[],
    page:0,
    pagesize:12
  },

  pullUpload() {
    var that = this
    if (that.data.loading == true) {
      that.getFollowedStudents()
    }
  },

  getFollowedStudents(){
    var that = this
    wx.request({
      url: 'http://localhost:8080/stusocial/studentfollow/fromstudent/'+app.globalData.user.id,
      data: {
        page: that.data.page,
        pagesize: that.data.pagesize,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          followedStudentList: that.data.followedStudentList.concat(res.data),
          page: res.data.length > 0 ? that.data.page + 1 : that.data.page,
          loading: res.data.length < that.data.pagesize ? false : true
        })
      },
      fail: function () {

      },
      complete: function () {
        // complete
      }
    })
  },

  deleteStuFollow(e) {
    var toStuId = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    wx.showModal({
      title: '管理员',
      content: '确定要取消吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: "正在取消"
          })
          wx.request({
            url: 'http://localhost:8080/stusocial/studentfollow',
            data: {
              fromStuId: app.globalData.user.id,
              toStuId: toStuId
            },
            method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
              that.data.followedStudentList.splice(index, 1)
              that.setData({
                followedStudentList: that.data.followedStudentList
              })
            },
            fail: function () {
              wx.showToast({
                title: '出现了问题',
                icon: 'none',
                duration: 2000
              })
            },
            complete: function () {
              // complete
            }
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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