// const { listRecommendPhotoSize, listPhotoSize } = require("../../api/size_list.js");

var app = getApp()
let interstitialAd = null

Page({
    data: {
        active: "99",
        show: true,
        statusBarHeight: app.globalData.statusBarHeight,
    },
    onLoad: function() {
      this.checkUser()
    }, 

    // 检查是否有用户
    async checkUser () {
      const db = wx.cloud.database({})

      // user collection 设置权限为仅创建者及管理员可读写
      // 这样除了管理员之外，其它用户只能读取到自己的用户信息
      let user = await db.collection('user').get()
      // 如果没有用户，跳转到登录页面登录
      if (!user.data.length) {
        // 插入用户信息
        let result = await db.collection('user').add({
          data: {
            nickName: "微信用户",
            avatar: null,
            photos: [],
            credits: 0
          }
        })
        user = await db.collection('user').get()
      }else{
        // 从用户信息中获取相册
        this.getPhotos(user.data[0].photos) 
      }
      
      app.globalData.id = user.data[0]._id
      app.globalData.openId = user.data[0]._openid
      app.globalData.photos = user.data[0].photos

      console.info("刚登录时的用户状态", app.globalData)
    },

    async getPhotos (photos) {
      const db = wx.cloud.database({})
      const id_list = []
      for(var i = 0; i < photos.length; i++){
        id_list.push(photos[i]["_id"])
      }

      const userphoto_ = await db.collection("photo").orderBy('createTime', 'desc').where({_id:db.command.in(id_list)}).get()
      app.globalData.userphoto = userphoto_
      
    },
    gotoSpecDetail: function(a) {
      app.globalData.spec = a.currentTarget.dataset.spec
      wx.navigateTo({
          url: "../spec-detail/spec-detail"
      })
    },
    gotoOneInchSpec: function() {
      app.globalData.spec = {
        bg_colors: ["white", "lightblue", "blue", "red", "gray"],
        height: 35,
        name: "赤子宝贝",
        pix_height: 413,
        pix_width: 295,
        width: 25,
      } 
      wx.navigateTo({
          url: "../spec-detail/spec-detail"
      })
    },
    gotoTwoInchSpec: function() {
      app.globalData.spec = {
        bg_colors: ["white", "lightblue", "blue", "red", "gray"],
        height: 50,
        name: "二寸",
        pix_height: 591,
        pix_width: 413,
        width: 35,
      } 
      wx.navigateTo({
          url: "../spec-detail/spec-detail"
      })
    },
    gotochangeBg: function() {
      wx.navigateTo({
        url: "../change-bg/change-bg"
      })
    },
    gotoSearch: function() {
      wx.navigateTo({
        url: "../search/search"
      })
    },
    onShareAppMessage: function() {
        return {
            title: "赤子宝贝",
            path: "/pages/index/index"
        }
    }
})