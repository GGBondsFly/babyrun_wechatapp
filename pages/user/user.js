// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[
      {
        icon: "images/aboutUs.png",
        title: "关于我们",
        click: "about"
      }, {
        icon: "images/update.png",
        title: "更新日志",
        click: "journal"
      }, {
        icon: "images/login.png",
        title: "登录/注销账号",
        click: "login"
      }
    ]
    // userInfo:[
    //   {
    //     icon: "images/class.png",
    //     title: "班级",
    //     littleTitle: "访客班级",
    //     click: "class"
    //   },{
    //     icon: "images/academy.png",
    //     title: "专业",
    //     littleTitle: "访客专业",
    //     click: "academy"
    //   }
    // ]
  },
  onLoad() {
    if (app.globalData.userInfo) {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
        })
    } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
    } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo

                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    }
  },
  getUserInfo (e) {
    if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo

        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
  },
 })
