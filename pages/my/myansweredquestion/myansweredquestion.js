// pages/my/mypublishedAnswer/mypublishedAnswer.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    answerList: [],
    page: 0,
    pagesize: 6
  },

  pullUpload() {
    var that = this
    if (that.data.loading == true) {
      that.getAnswerList()
    }
  },

  enterAnswerDetail(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var qid = e.currentTarget.dataset.qid
    wx.navigateTo({
      url: '/pages/answerdetail/answerdetail?aid=' + id + "&qid=" + qid,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  deleteAnswer(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    wx.showModal({
      title: '管理员',
      content: '确定要删除此回答吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: "正在删除"
          })
          wx.request({
            url: 'http://localhost:8080/stusocial/answer/' + id,
            data: {
            },
            method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            }, // 设置请求的 header
            success: function (res) {
              if (res.data == "success") {
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.data.answerList.splice(index, 1)
                that.setData({
                  answerList: that.data.answerList
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '出现了问题',
                  icon: 'none',
                  duration: 2000
                })
              }

            },
            fail: function () {
              wx.hideloading()
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

  getAnswerList() {
    var that = this
    wx.request({
      url: 'http://localhost:8080/stusocial/answer',
      data: {
        sid: app.globalData.user.id,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          answerList: that.data.answerList.concat(res.data),
          page: res.data.length > 0 ? that.data.page + 1 : that.data.page,
          loading: res.data.length < 5 ? false : true
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.pullUpload()
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