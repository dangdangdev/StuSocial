// pages/home/home.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        StatusBar: app.globalData.StatusBar + 6.5,
        CustomBar: app.globalData.CustomBar,
        naviBarList: app.globalData.naviBarList,
        tabCur: 1,
        questionAndMaxZanAnsList:[],
        page:0,
        pagesize:5,
        category:"电影",
        loading:true
    },

    attached() {
        let that = this;
        that.setData({
            navH: app.globalData.navHeight
        })
        that.pullUpload()
        
    },
    methods: {
        tabSelect(e) {
            var that = this
            that.setData({
                tabCur: e.currentTarget.dataset.id,
                category:that.data.naviBarList[e.currentTarget.dataset.id],
                page:0,
                loading:true,
                questionAndMaxZanAnsList:[]
            })
            that.getQueAndMaxZanAnsList()
        },

        enterAnswerDetail(e) {
            var that = this
            var qid = e.currentTarget.dataset.qid
            var aid = e.currentTarget.dataset.aid
            wx.navigateTo({
                url: '/pages/answerdetail/answerdetail?aid=' + aid + "&qid=" + qid,
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

        pullUpload(e){
            var that=this
            if(that.data.loading){
                that.getQueAndMaxZanAnsList()
            }
        },

        getQueAndMaxZanAnsList(){
            var that=this
            wx.request({
                url: 'http://localhost:8080/stusocial/question',
                data: {
                    category:that.data.category,
                    page:that.data.page,
                    pagesize:that.data.pagesize
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res){
                    if(res.data==null || res.data.length==0){
                        that.setData({
                            loading:false,
                        })
                    }else{
                        that.setData({
                            page:that.data.page+1,
                            questionAndMaxZanAnsList: that.data.questionAndMaxZanAnsList.concat(res.data),
                            loading:res.data.length==that.data.pagesize?true:false
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

    }
})