var app = getApp();


Page({
    data: {src: "",detail: "",canvas: ""},
    onLoad: function(a) {
      console.log('hello');
      console.log(app.globalData.photo)
      this.setData({
          detail: app.globalData.photo
      });
      
      //get tempfile url
      // wx.cloud.getTempFileURL({
      //   fileList: [app.globalData.photo],
      //   success: res => {
      //     console.log('temp',res.fileList)
      //     this.setData({
      //       src: res.fileList[0].tempFileURL
      //     })
      //   }
      // })
      const query = wx.createSelectorQuery()
      query.select('#canvas1')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('canvas',res)
        const canvas = res[0].node
        const widthca = res[0].width
        const heightca = res[0].height
        
        this.setData({
          widthca: widthca
        })
        this.setData({
          heightca: heightca
        })
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        var width = 300
        var height = 300
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        //add image to canvas
        const img = canvas.createImage()
        wx.cloud.getTempFileURL({
          fileList: [app.globalData.photo],
          success: res => {
            console.log('temp',res.fileList)
            img.src = res.fileList[0].tempFileURL
          }
        })
        console.log('imgs',img.src)
        // img.src = "../../assets/icon/tab1.png"
        //if img.src is not empty, draw image else draw a default image in dir
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height)
        }
        this.setData({
          canvas: canvas
        })
      }
      )
    },
    
    saveImageupleft: function() {
      console.log('save')
      console.log(this.data.detail)
      var width = this.data.widthca/2
      var height = this.data.heightca/2
      console.log('savecanvas',this.data.canvas)
      
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: Math.floor(width),
        height: Math.floor(height),
        destWidth: 512,
        destHeight: 512,
        canvas: this.data.canvas,
        success: res => {
          console.log('canvas',res.tempFilePath)
          const tempFilePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
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
    },
    saveImagedownleft: function() {
      console.log('save')
      console.log(this.data.detail)
      var width = this.data.widthca/2
      var height = this.data.heightca/2
      console.log('savecanvas',this.data.canvas)
      
      wx.canvasToTempFilePath({
        x: 0,
        y: Math.ceil(height),
        width: Math.floor(width),
        height: Math.floor(height),
        destWidth: 512,
        destHeight: 512,
        canvas: this.data.canvas,
        success: res => {
          console.log('canvas',res.tempFilePath)
          const tempFilePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
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
    },
    saveImageupright: function() {
      console.log('save')
      console.log(this.data.detail)
      var width = this.data.widthca/2
      var height = this.data.heightca/2
      console.log('savecanvas',this.data.canvas)
      
      wx.canvasToTempFilePath({
        x: Math.ceil(width),
        y: 0,
        width: Math.floor(width),
        height: Math.floor(height),
        destWidth: 512,
        destHeight: 512,
        canvas: this.data.canvas,
        success: res => {
          console.log('canvas',res.tempFilePath)
          const tempFilePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
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
    },
    saveImagedownright: function() {
      console.log('save')
      console.log(this.data.detail)
      var width = this.data.widthca/2
      var height = this.data.heightca/2
      console.log('savecanvas',this.data.canvas)
      
      wx.canvasToTempFilePath({
        x: Math.ceil(width),
        y: Math.ceil(height),
        width: Math.floor(width),
        height: Math.floor(height),
        destWidth: 512,
        destHeight: 512,
        canvas: this.data.canvas,
        success: res => {
          console.log('canvas',res.tempFilePath)
          const tempFilePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
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