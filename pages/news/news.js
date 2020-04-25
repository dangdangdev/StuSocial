// pages/my/my.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        StatusBar: app.globalData.StatusBar + 6.5,
        CustomBar: app.globalData.CustomBar,
    },
    attached() {


    },
    methods: {


    }
})