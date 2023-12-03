const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils");
var app = getApp();

Page({
    data: {
        enableCamera: true,
        devicePosition: "back"
    },
    onLoad: function(e) {
      this.setData({
          data: app.globalData.spec
      })
    },
    unauth: function() {
      this.setData({
        enableCamera: false
      })
      wx.showModal({
        content: "请前打开摄像头权限",
        showCancel: false,
        confirmText: "去设置",
        success: (tipRes) => {
          if (tipRes.confirm) {
            wx.openSetting({
              success: (settingRes) => {
                if (settingRes.authSetting["scope.camera"]) {
                  this.setData({
                    enableCamera: true
                  })
                } else {
                  this.unauth()
                }
              },
            })
          }
        }
      })
    },
    changeDevicePhoto: function() {
        "back" == this.data.devicePosition ? this.setData({
            devicePosition: "front"
        }) : this.setData({
            devicePosition: "back"
        });
    },
    takePhoto: function() {
        wx.showLoading({
            title: "制作中.."
        })
        const {
          pix_height,
          pix_width
        } = this.data.data
        wx.createCameraContext().takePhoto({
            quality: "high",
            success: res => {
                var file = res.tempImagePath;
                var filename = 'example1130.png'
                wx.cloud.uploadFile({
                    cloudPath: filename, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
                    filePath: file, // 微信本地文件，通过选择图片，聊天文件等接口获取
                    config: {
                      env: 'prod-7gqrt3ipc65119e3' // 需要替换成自己的微信云托管环境ID
                    }
                  }).then(res => {
                    console.log(res.fileID)
                    // app.globalData.alphaImage = res.fileid
                    compress(file, 2*1024*1024, 80, r=> {
                        generateBase64AlphaPhoto(res.fileID).then(res => {
                          // app.globalData.alphaImage = res.image_base64
                          console.log(res)
                          app.globalData.alphaImage = res.data.fileid
                          wx.hideLoading()
                          wx.redirectTo({
                              url: "../preview/preview"
                          });
                        }).catch(err => {
                          wx.hideLoading()
                          console.log(err)
                          wx.showToast({
                            title: '[5000] 拍摄制作失败，请重试或联系客服处理！',
                            icon: 'none'
                          })
                        })
                      })
                    
                    wx.hideLoading()
                    wx.redirectTo({
                        url: "../preview/preview"
                    });
                  }).catch(error => {
                    console.error(err)
                  })
                
            },
            fail: err => {
              wx.hideLoading()
              console.log(err)
              wx.showToast({
                title: '[4001] 拍摄异常，请联系客服处理！',
                icon: 'none'
              })
            }
        });
    },
    cancel: function() {
        wx.navigateBack({
            delta: 1
        });
    }
});