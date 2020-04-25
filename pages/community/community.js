// pages/community/community.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        loading1:true,
        loading2:true,
        page1:0,
        page2:0,
        StatusBar: app.globalData.StatusBar + 6.5,
        tabTopCur: 1,
        curProvince: "",
        curUniversity: "",
        provinceList: app.globalData.provinceList,
        universityList: app.globalData.universityList,
        multiIndex: null,
        multiArray: [],
        naviBarList: ["电影", "生活", "科研", "编程", "军事", "社会"],
        tabCur: 0,
        communityList1: [],
        communityList2:[]
    },

    attached() {
        let that = this;
        for(var i=0;i<that.data.universityList.length;i++){
            for(var j=0;j<that.data.universityList[i].length;j++){
                if(that.data.universityList[i][j]==app.globalData.user.university){
                    that.setData({
                        multiArray: [that.data.provinceList, that.data.universityList[i]],
                        multiIndex:[i,j]
                    })
                }
            }
        }
        that.pullUpload1(0)
    },
    methods: {
        joinCommunity(e){
            var id = e.currentTarget.dataset.id
            wx.request({
                url: 'http://localhost:8080/stusocial/stuBelongCom',
                data: {
                    sid:app.globalData.user.id,
                    cid:id
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, // 设置请求的 header
                success: function(res){
                    if(res.data=="success"){
                        wx.showToast({
                            title:'成功加入该社区',
                            duration:2000
                        })
                    }else{
                        wx.showToast({
                            title:'你已加入该社区',
                            duration:2000
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
        },

        enterCommunity(e){
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/communitydetail/communitydetail?id='+id,
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

        pullUpload1(e){
            var that=this;
            console.log("请求1Page:"+that.data.page1)
            if(that.data.loading1==true){
                wx.request({
                    url: 'http://localhost:8080/stusocial/community/byUniversity',
                    data: {
                        page:that.data.page1,
                        size:5,                        
                        university:that.data.universityList[that.data.multiIndex[0]][that.data.multiIndex[1]]
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }, // 设置请求  的 header
                    success: function(res){
                        console.log(res)
                        var page=that.data.page1+1
                        that.setData({
                            communityList1:that.data.communityList1.concat(res.data),
                            page1:page,
                        })
                        if(res.data.length<5){
                            that.setData({
                                loading1:false
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

        pullUpload2(e){
            var that=this;
            console.log("请求2Page:"+that.data.page2)
            if(that.data.loading2==true){
                wx.request({
                    url: 'http://localhost:8080/stusocial/community/byCategory',
                    data: {
                        category:that.data.naviBarList[that.data.tabCur],
                        page:that.data.page2,
                        size:10
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }, // 设置请求的 header
                    success: function(res){
                        console.log(res)
                        var page=that.data.page2+1
                        that.setData({
                            communityList2:that.data.communityList2.concat(res.data),
                            page2:page,
                        })
                        if(res.data.length<5){
                            that.setData({
                                loading2:false
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

        tabTopSelect(e) {
            var that=this
            that.setData({
                tabTopCur: that.data.tabTopCur == 1 ? 2 : 1
            })
            if(that.data.tabTopCur==1){
                if(that.data.communityList1.length==0){
                    that.pullUpload1(e)
                }
            }else{
                if(that.data.communityList2.length==0){
                    that.pullUpload2(e)
                }
            }
        },

        tabSelect(e) {
            var that=this
            that.setData({
                tabCur: e.currentTarget.dataset.id,
                loading2:true,
                page2:0,
                communityList2:[]
            })
            that.pullUpload2(e)
        },

        bindMultiPickerChange(e) {
            var that=this
            that.setData({
                multiIndex: e.detail.value,
                loading1:true,
                page1:0,
                communityList1:[]
            })
            that.pullUpload1(e)
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
    }
})