var app = getApp();


Page({
    data: {},
    onLoad: function(a) {
        console.log('hello');
        console.log(app.globalData.photo)
        this.setData({
            detail: app.globalData.photo
        });
    },
    regenerate: function() {
        wx.navigateTo({
            url: "../spec-detail/spec-detail"
        });
    },
    saveImage: function() {
      wx.cloud.downloadFile({
        fileID: this.data.detail,
        fail: e => {
          wx.showToast({
            title: "保存失败",
            icon: "none"
          })
        },
        success: result => {
          const {
            tempFilePath,
          } = result
          wx.saveImageToPhotosAlbum({
            filePath: result.tempFilePath,
            success: function(e) {
              wx.showToast({
                title: "保存成功，可前往【手机相册】中查看",
                icon: "none",
                duration: 5e3
              });
            },
            fail: function(e) {
              console.log(e)
                "saveImageToPhotosAlbum:fail cancel" != e.errMsg ? wx.showModal({
                    content: "请打开相册权限",
                    confirmText: "去设置",
                    success: function(e) {
                        e.confirm && wx.openSetting();
                    }
                }) : wx.showToast({
                    title: "保存失败",
                    icon: "none"
                });
            }
          });
        }
      })
    }
});