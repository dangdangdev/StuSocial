// pages/index-1/index-1.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pageCur: "",
	},
	/**
	 * 更换tabbar页面
	 */
	navChange(e) {
		this.setData({
			pageCur: e.currentTarget.dataset.cur
		})
	},

	buildCommunity(e) {
		wx.navigateTo({
			url: '../build/build',
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

	
	judgeSession(){
		var that=this
		var session=wx.getStorageSync('stusocial_login')
		console.log(session)
		if(session!=""){
			var expirationTime = session.expiration
			var timestamp=Date.parse(new Date())
			console.log("expirationTime"+expirationTime)
			console.log("nowTime"+timestamp)
			if(expirationTime<timestamp){
				wx.removeStorageSync('stusocial_login')
				return false;
			}else{
				session.expiration=timestamp+ 3*24*3600
				wx.setStorageSync('stusocial_login', session)
				app.globalData.user = session.user
				return true;
			}
		}else{
			return false;
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		
		if(that.judgeSession()){
			that.setData({
				'pageCur':'home'
			})
		}else{
			wx.redirectTo({
				url: '/pages/login/login',
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