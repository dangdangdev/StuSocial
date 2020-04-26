// pages/my/my.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
    
  },
  data: {
    student: null
  },
  attached() {
    var that = this 
    that.setData({
      student:app.globalData.user
    })
    
  },
  methods: {

    
  }
})

