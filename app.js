const { login } = require("./api/login");

App({
    onLaunch: function() {
        // 初始化云函数
        wx.cloud.init({
          env: "babyface-4gku32vc4014f602",
          traceUser: true
        })

        // 获取用户信息
        wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          this.globalData.userInfo = res.userInfo

                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)
                          }
                      }
                  })
              }
          }
      })

      var e = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = e.statusBarHeight
      this.globalData.windowWidth = e.windowWidth
      this.globalData.windowHeight = e.windowHeight
    },

    globalData: {
      hasUser: false, // 数据库中是否有用户
      hasUserInfo: false, // 小程序的userInfo是否有获取
      userInfo: null,
      checkResult: null,
      code: null,
      openId: null,
      flag: 0,
      photos: [],
      id: null,
      prompt: " newborn chinese boy wrapped in a gray blanket,close eyes, in the style of light sky-blue and silver, gutai group, comfycore, #myportfolio, unpolished, elegantly formal",
      userphoto: [],
  }
});