App({
    onLaunch: function() {
        // 初始化云函数
        wx.cloud.init({
          env: "babyface-4gku32vc4014f602",
          traceUser: true
        })

      var e = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = e.statusBarHeight
      this.globalData.windowWidth = e.windowWidth
      this.globalData.windowHeight = e.windowHeight
    },

    globalData: {
      id: null,
      openId: null,
      photos: [],
      userphoto: [],
  }
});