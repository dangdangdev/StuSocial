// pages/questiondetail/questiondetail.js
var app = getApp()
var Util = require( '../../utils/util.js' )
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:null,
    page:0,
    pagesize:5,
    loading:true,
    answerList:[],
    clickPublish: false,
    canSend: false,
    answerContent:"",
    scrollTop: 0
  },

  onScroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },

  getQuestion(id){
    var that=this
    wx.request({
      url: 'http://localhost:8080/stusocial/question/'+id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          question:res.data
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

  getAnswerList(id){
    var that=this
    if(that.data.loading==true){
      wx.request({
        url: 'http://localhost:8080/stusocial/answers/question/'+id,
        data: {
          page:that.data.page,
          pagesize:that.data.pagesize
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){ 
          that.setData({
            answerList:that.data.answerList.concat(res.data),
            loading:res.data.length<that.data.pagesize?false:true,
            page:res.data.length==0?that.data.page:that.data.page+1
          })
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

  textareaInput(e) {
    var that = this
    console.log(that.data)
    that.setData({
      answerContent: e.detail.value
    })
    that.setData({
      canSend: that.data.answerContent != "" ? true : false
    })
  },

  clickPublishMethod(e) {
    var that = this
    that.setData({
      clickPublish: true
    })
  },

  closePublish(e) {
    var that = this
    that.setData({
      clickPublish: false,
      canSend: false,
      answerContent: "",
      scrollTop: 0
    })
  },
  sendAnswer(e) {
    var that = this
    if (that.data.canSend) {
      var answer={
        'content':that.data.answerContent,
        'studentId':app.globalData.user.id,
        'questionId':that.data.question.id
      }
      wx.request({
        url: 'http://localhost:8080/stusocial/answer',
        data: JSON.stringify(answer),
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "contentType": 'application/json'
        },
        success: function (res) {
          console.log("回答添加成功")
          var qid = that.data.question.id
          that.setData({
            clickPublish: false,
            page: 0,
            loading: true,
            answerList:[],
            scrollTop: 0
          })
          that.getQuestion(qid)
          that.getAnswerList(qid)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },

  enterAnswerDetail(e) {
    var that=this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/answerdetail/answerdetail?aid=' + id+"&qid="+that.data.question.id,
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

  pullUpload(e) {
    var that = this
    that.getAnswerList(that.data.question.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    that.getQuestion(id)
    that.getAnswerList(id)
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