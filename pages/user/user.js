// index.js
// 获取应用实例
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickName: "微信用户",
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
    if (this.data.hasUserInfo) {
      return
    }else{
      db.collection('user').get().then(res => 
        {
          console.log(res)
          let avatarUrl = res.data[0].avatar
          if(avatarUrl){
            this.setData({avatarUrl:avatarUrl})
          }
          let nickName = res.data[0].nickName
          if(nickName){
            this.setData({nickName: nickName})
          }
        }
      )
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })

    wx.cloud.uploadFile({
      cloudPath: `usr-data/${app.globalData.openId}/avatar.jpg`, 
      filePath: avatarUrl,
      success (res){
        db.collection('user').doc(app.globalData.id).update({
          data: {
            avatar: res.fileID
          }
        }).then(
            console.log("update user avatar success!: ", res.fileID)
          )
      }
    })
  }





 })
