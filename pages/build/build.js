// pages/build/build.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    naviBarList: ["电影", "生活", "科研", "编程", "军事", "社会"],
    modalName: null,
    myAllFriends: [
      { name: "1", checked: false },
      { name: "2" },
      { name: "3" },
      { name: "4" },
      { name: "5" }
    ],
    comName: null,
    choosedFriends: [],
    imgList: [],
    comIntroduce: "",
    hasCommited: false,
    loading:false,
    loadingImage:0
  },

  comNameInput(e) {
    this.setData({
      comName: e.detail.value
    })
  },
  pickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 
   * 展示选择社区成员的模态窗 
   */
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  /**
   * 
   * 隐藏模态窗
   */
  hideModal(e) {
    this.setData({
      modalName: null
    });

  },

  chooseCheckbox(e) {
    let items = this.data.myAllFriends;
    let name = e.currentTarget.dataset.name;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].name == name) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      myAllFriends: items
    })
  },

  noChoosedChexbox(e) {
    let items = this.data.myAllFriends;
    items.forEach(element => {
      element.checked = false;
    });
    this.setData({
      myAllFriends: items
    });
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4 - this.data.imgList.length, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '管理员',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  textareaInput(e) {
    this.setData({
      comIntroduce: e.detail.value
    })
  },

  submit(e) {
    var that = this
    if (this.data.index == null || this.data.comName == null || this.data.comIntroduce == "" || this.data.imgList.length==0) {
      this.setData({
        hasCommited: true
      })
      if(this.data.imgList.length==0){
        wx.showToast({
          title:"至少要一张图片",
          duration:2000,
          icon:'none'
        })
      }
    } else {
      that.setData({
        loading:true
      })
      wx.request({
        url: 'http://localhost:8080/stusocial/community/add',
        data: {
          name: that.data.comName,
          category: that.data.naviBarList[that.data.index],
          content: that.data.comIntroduce,
          university: app.globalData.user.university,
          studentid: app.globalData.user.id,
          imgCount:that.data.imgList.length
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res)
          var id = res.data.id
          for (var i = 0; i < that.data.imgList.length; i++) {
            wx.uploadFile({
              url: 'http://localhost:8080/stusocial/community/uploadfile',
              filePath:that.data.imgList[i],
              name:'file',
              // header: {}, // 设置请求的 header
              formData: {
                method:"POST",
                'content-type':'multipart/form-data',
                communityid:id,
                count:i
              }, // HTTP 请求中其他额外的 form data
              success: function(res){
                that.setData({
                  loadingImage:that.data.loadingImage+1
                })
                if(that.data.loadingImage==that.data.imgList.length){
                  that.setData({
                    loading:false
                  })
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