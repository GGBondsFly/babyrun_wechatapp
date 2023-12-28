const { addUserPhotoWithBase64Alpha } = require("../../api/user_photo.js");
import settings from "../../settings"
import Dialog from '@vant/weapp/dialog/dialog'
var app = getApp();
let videoAd = null
let adEnable = false

Page({
    data: {
        edit: "",
        statusBarHeight: app.globalData.statusBarHeight,
        whitening: 0,
        buffing: 0,
        skipAd: settings.skipAd,
    },
    onLoad: function(t) {
        this.setData({
            img: app.globalData.alphaImage,
            openid: app.globalData.openid,
            name: app.globalData.spec.name,
            pix_width: app.globalData.spec.pix_width,
            pix_height: app.globalData.spec.pix_height,
            width: app.globalData.spec.width,
            height: app.globalData.spec.height,
            colors: app.globalData.spec.bg_colors,
            color: app.globalData.spec.bg_colors[0]
        })
        if (wx.createRewardedVideoAd) {
          videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-e4c915532522e3cd'
          })
          videoAd.onLoad(() => {console.log('onLoad event emit')})
          videoAd.onError((err) => {this.gen()})
          videoAd.onClose((res) => {
            if (res && res.isEnded) {
              this.gen()
            } else {
              console.log('user stop unfinsh')
            }
          })
          adEnable = true
        }
    },
    changeColor: function(t) {
        this.setData({
            color: t.currentTarget.dataset.color
        });
    },
    hexToRgb(color) {
      var hex = "#ffffff"
      if (color === "white") {
        hex = "#ffffff"
      } else if (color === "lightblue") {
        hex = "#8ec5e9"
      } else if (color === "blue") {
        hex = "#1a8ae4"
      } else if (color === "red") {
        hex = "#c40c20"
      } else if (color === "gray") {
        hex = "#818892"
      } else {
        wx.showToast({
          title: "[4002] 程序异常，请联系客服处理！",
          icon: "none",
          duration: 2000
        });
      }
      return {
        r: parseInt('0x' + hex.slice(1, 3)),
        g: parseInt('0x' + hex.slice(3, 5)),
        b: parseInt('0x' + hex.slice(5, 7)),
      }
    },

    
    // 上传图片
    uploadPhoto (filePath) {
      // 调用 wx.cloud.uploadFile 上传文件
      return wx.cloud.uploadFile({
        cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
        // cloudPath: "testimage.png",
        filePath
      })
    },

    formSubmit: function() {
      wx.showLoading({ title: '提交中' })
      console.log('im here')
      this.uploadPhoto(app.globalData.alphaImage).then(result => {
        this.addPhotos(result)
        wx.hideLoading()
        console.log('im here2')
        wx.switchTab({
            url: "../index/index"
        });
        console.log('im here3')
      }).catch(() => {
          wx.hideLoading()
          wx.showToast({ title: '上传图片错误', icon: 'error' })
          wx.switchTab({
            url: "../index/index"
        });
      })
      


      // if (adEnable && !this.data.skipAd) {
      //   Dialog.confirm({
      //     message: '完整观看视频可免费下载',
      //   }).then(() => {
      //     videoAd.show().catch(() => {
      //       videoAd.load()
      //         .then(() => videoAd.show())
      //         .catch(err => {
      //           console.log('激励视频 广告显示失败')
      //         })
      //     })
      //   })
      // } else {
      //   this.gen()
      // }
    },

    // 添加图片信息到数据库
    async addPhotos (photo) {
      const db = wx.cloud.database()
      // 图片数据写入数据库
      let result = await db.collection('photo').add({
        data: {
          oriFileID: photo.fileID,
          genFileID: null,
          createTime: db.serverDate(),
          genTime: null,
          status: "generating"
        }
      })

      // 更新本地缓存
      const oldPhotos = app.globalData.photos
      app.globalData.photos = [...oldPhotos, result]

      // 更新用户数据库
      db.collection('user').doc(app.globalData.id).update({
        data: {
        photos: db.command.set(app.globalData.photos)
        }
      }).then(result => {
        console.log('写入成功', result)
        wx.navigateBack()
      })

      return {subid : "result", fileid: photo.fileID}

    },


    gen() {
      wx.showLoading({
        title: "制作中...",
        mask: true
      });
      const {
        r,
        g,
        b
      } = this.hexToRgb(this.data.color)
      addUserPhotoWithBase64Alpha({
        image_base64: app.globalData.alphaImage, 
        r: r, 
        g: g, 
        b: b,
        openid: this.data.openid,
        name: this.data.name,
        width: this.data.width,
        height: this.data.height,
        pix_width: this.data.pix_width,
        pix_height: this.data.pix_height,
      }).then(result => {
        wx.hideLoading()
        wx.navigateTo({
          url: "../save-image/save-image?image=" + result.url + "&size=" + result.size
        });
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
        wx.showToast({
          title: "[5002] 选择图片制作失败，请尝试或客服处理！",
          icon: "none",
          duration: 2000
        });
      })
    }
});