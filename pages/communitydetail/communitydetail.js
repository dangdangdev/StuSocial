// pages/communitydetail/communitydetail.js
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    community:null,
    questionList:[],
    clickPublish:false,
    questionContent:"",
    canSend:false,
    stuJoinComStatus:0,  //0代表正在查询，1代表是本社区成员，2代表不是(可加入)
    page:0,
    pagesize:5,
    loading:true,
    scrollTop: 0,
    showModal:false, //展示模态窗显示用户列表
    comMembers:[],   //社区成员
    privilege:-1  //权限：0代表该用户是该社区的创建者，1代表不是创建者
  },

  onScroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },

  textareaInput(e){
    var that=this
    console.log(that.data)
    that.setData({
      questionContent:e.detail.value
    })
    that.setData({
      canSend:that.data.questionContent!=""?true:false
    })
  },

  showModal(){    //展示所有的
    var that = this
    that.setData({
      showModal:true
    })
    wx.request({
      url: 'http://localhost:8080/stusocial/stuBelongCom',
      data: {
        cid:that.data.community.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          comMembers:res.data
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

  hideModal(){
    var that = this
    that.setData({
      showModal:false
    })
  },

  clickPublishMethod(e){
    var that=this
    if(that.data.stuJoinComStatus==1){
      that.setData({
        clickPublish:true
      })
    }else{
      wx.showToast({
        title:'只有本社区成员才可以提问...',
        duration:'1000'
      })
    }
  },

  closePublish(e){
    var that=this
    that.setData({
      clickPublish:false,
      canSend:false,
      questionContent:"",
      scrollTop:0
    })
  },
  sendQuestion(e){
    var that=this
    if(that.data.canSend){
      wx.request({
        url: 'http://localhost:8080/stusocial/question/add',
        data: {
          content:that.data.questionContent,
          studentid:app.globalData.user.id,
          communityid:that.data.community.id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          console.log("问题添加成功")
          var comid=that.data.community.id
          that.getCommunity(comid)
          that.getQuestionList(comid)
          that.setData({
            clickPublish:false,
            page:0,
            loading:true,
            scrollTop:0,
            questionList:[]
          })
          that.getCommunity(comid)
          that.getQuestionList(comid)
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
  
  enterQuestionDetail(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/questiondetail/questiondetail?id='+id,
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
  },

  getCommunity(id){
    var that=this
    wx.request({
      url: 'http://localhost:8080/stusocial/community/byId',
      data: {
        id:id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          community:res.data
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

  leaveCommunity(e){
    var that = this
    var cid = e.currentTarget.dataset.id
    if(that.data.privilege==0){
      wx.showToast({
        title:"你是创建者",
        duration:2000
      })
    }else{
      that.setData({
        stuJoinComStatus: 0
      })
      wx.request({
        url: 'http://localhost:8080/stusocial/stuBelongCom',
        data: {
          sid:app.globalData.user.id,
          cid:cid
        },
        method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function(res){
          that.setData({
            stuJoinComStatus:2
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

  getJoinComStatus(comid){
    var that=this
    wx.request({
      url: 'http://localhost:8080/stusocial/stuBelongCom/byComAndStu',
      data: {
        communityid:comid,
        studentid:app.globalData.user.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        that.setData({
          stuJoinComStatus:res.data==null?2:1,
          privilege:res.data == null?1:res.data.privilege
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
  getQuestionList(comid){
    var that=this
    if(that.data.loading==true){
      wx.request({
        url: 'http://localhost:8080/stusocial/question/byCommunityId',
        data: {
          id: comid,
          page: that.data.page,
          pagesize: that.data.pagesize
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, // header: {}, // 设置请求的 header
        success: function (res) {
          that.setData({
            questionList:that.data.questionList.concat(res.data),
            loading:res.data.length<that.data.pagesize?false:true,
            page:res.data.length==0?that.data.page:that.data.page+1
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

  pullUpload(e){
     var that=this
     that.getQuestionList(that.data.community.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id=options.id
    console.log(options)
    that.getCommunity(id)
    that.getJoinComStatus(id)
    that.getQuestionList(id)
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