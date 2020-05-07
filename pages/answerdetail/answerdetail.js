// pages/answerdetail/answerdetail.js
var app = getApp();
var Util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: null,
    answer: null,
    zanStatus: 0,
    showComment: false,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    InputBottom1: 0,
    InputBottom2: 0,
    inputComment: "",
    inputReply: "",
    commentList: [],
    replyList: [],
    curComment: null,
    commentsZanStatus: [],
    repliesZanStatus: [],
    hideReplyModal: true,
    followStatus:0
  },

  judgeSelfAnswer(){
    var that = this
    if (that.data.answer.student.id == app.globalData.user.id) {
      that.setData({
        followStatus: 2
      })
      return true;
    } else {
      return false;
    }
  },

  getFollowStatus(){
    var that = this
    if(that.judgeSelfAnswer()==false){
      wx.request({
        url: 'http://localhost:8080/stusocial/studentfollow',
        data: {
          fromStuId: app.globalData.user.id,
          toStuId: that.data.answer.student.id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res.data)
          that.setData({
            followStatus:(res.data==null || res.data=="")?2:1
          })
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

  findAllAnswer(){
    var id = this.data.question.id
    wx.navigateTo({
      url: '/pages/questiondetail/questiondetail?id=' + id,
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

  commentInput(e) {
    var that = this
    that.setData({
      inputComment: e.detail.value
    })
  },

  replyInput(e) {
    var that = this
    that.setData({
      inputReply: e.detail.value
    })
  },

  clickCommentZan(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.request({
      url: 'http://localhost:8080/stusocial/studentzancomment',
      data: {
        sid: app.globalData.user.id,
        cid: that.data.commentList[index].id
      },
      method: that.data.commentsZanStatus[index] ? 'DELETE' : 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function (res) {
        var czs = that.data.commentsZanStatus
        var comlist = that.data.commentList
        if (czs[index]) {
          czs[index] = false
          comlist[index].zanCount = comlist[index].zanCount - 1
        } else {
          czs[index] = true
          comlist[index].zanCount = comlist[index].zanCount + 1
        }
        that.setData({
          commentsZanStatus: czs,
          commentList: comlist
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



  InputFocus1(e) {
    this.setData({
      InputBottom1: e.detail.height
    })
  },

  InputBlur1(e) {
    this.setData({
      InputBottom1: 0
    })
  },

  InputFocus2(e) {
    this.setData({
      InputBottom2: e.detail.height
    })
  },

  InputBlur2(e) {
    this.setData({
      InputBottom2: 0
    })
  },

  findAllComment: function () {
    var that = this
    that.setData({
      hideModal: false
    })
    that.getCommentList()
  },

  sendComment() {
    var that = this
    var comment = {
      'content': that.data.inputComment,
      'studentId': app.globalData.user.id,
      'answerId': that.data.answer.id
    }
    that.setData({
      inputComment: ""
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/comment',
      data: JSON.stringify(comment),
      method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "contentType": 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        that.getAnswer(that.data.answer.id)
        that.getCommentList()
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  sendReply(){
    var that = this
    var reply = {
      'content': that.data.inputReply,
      'studentId': app.globalData.user.id,
      'commentId': that.data.curComment.id
    }
    that.setData({
      inputReply: ""
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/reply',
      data: JSON.stringify(reply),
      method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "contentType": 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        that.getReplyList()
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  getQuestion(id) {
    var that = this
    wx.request({
      url: 'http://localhost:8080/stusocial/question/' + id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          question: res.data
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

  getAnswer(id) {
    var that = this
    wx.request({
      url: 'http://localhost:8080/stusocial/answer/' + id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          answer: res.data
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

  getstuZanAns(aid, sid) {
    var that = this
    wx.request({
      url: 'http://localhost:8080/stusocial/studentzananswer/student/' + sid + '/answer/' + aid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          zanStatus: res.data == "" ? 2 : 1
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

  getCommentList() {
    var that = this
    var aid = that.data.answer.id
    //要获得该用户有没有赞每个评论的状态
    wx.request({
      url: 'http://localhost:8080/stusocial/comments/student/' + app.globalData.user.id + "/answer/" + aid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          commentList: res.data.commentList,
          commentsZanStatus: res.data.commentsZanStatus
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

  getReplyList(){
    var that=this
    var cid=that.data.curComment.id
    wx.request({
      url: 'http://localhost:8080/stusocial/replies/comment/'+cid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          replyList:res.data
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

  deleteStuFollow(){
    var that =this
    that.setData({
      followStatus:0
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/studentfollow',
      data: {
        fromStuId:app.globalData.user.id,
        toStuId:that.data.answer.student.id
      },
      method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function(res){
        that.setData({
          followStatus:2
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

  addStuFollow(){
    var that = this
    if(that.judgeSelfAnswer()){
      wx.showToast({
        title:'不能关注自己~',
        duration:2000,
        icon:'none'
      })
    }else{
      that.setData({
        followStatus:0
      })
      wx.request({
        url: 'http://localhost:8080/stusocial/studentfollow',
        data: {
          fromStuId: app.globalData.user.id,
          toStuId: that.data.answer.student.id
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        success: function(res){
          that.setData({
            followStatus:1
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

  addzananswer() {
    var that = this
    that.setData({
      zanStatus: 0
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/studentzananswer/',
      data: {
        sid: app.globalData.user.id,
        aid: that.data.answer.id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function (res) {
        that.setData({
          answer: res.data,
          zanStatus: 1
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

  deletezananswer() {
    var that = this
    that.setData({
      zanStatus: 0
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/studentzananswer',
      data: {
        sid: app.globalData.user.id,
        aid: that.data.answer.id
      },
      method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function (res) {
        that.setData({
          answer: res.data,
          zanStatus: 2
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
    var qid = options.qid
    var aid = options.aid
    that.getQuestion(qid)
    that.getAnswer(aid)
    that.getstuZanAns(aid, app.globalData.user.id)
    setTimeout(() => {
      that.getFollowStatus()
    }, 1500);
     //延迟执行，要让上面先获得Answer

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

  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
    that.getCommentList()
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  showReplyModal(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      curComment: that.data.commentList[index],
      hideReplyModal: false
    })
    that.getReplyList()
  },

  hideReplyModal(e) {
    var that = this
    that.setData({
      hideReplyModal: true,
      inputReply:""
    })
  }
})