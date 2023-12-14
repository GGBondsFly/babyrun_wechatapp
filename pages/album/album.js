const { listUserPhoto, deleteUserPhoto } = require("../../api/user_photo");

var app = getApp();

Page({
    data: {
      next_id: 0,
      photos: [],
      moreIndex: -1
    },
    onLoad: function(t) {
    },
    onShow: function() {
      this.getPhotos().then(res => {
        this.setData({
          photos: res,
        })
      })
    },

    // 获取相册中的数据
    async getPhotos () {
      // 获取数据库实例
      const db = wx.cloud.database({})
      var batchSize = 10; // 每批次的记录数
      const userphoto = await db.collection("photo").get(); // 保存结果的数组

      // // 按照批次检索记录
      // for (var i = 0; i < app.globalData.photos.length; i += batchSize) {
      //   var batchIds = app.globalData.photos.slice(i, i + batchSize);
      //   var query = { id: { $in: batchIds } };
      //   var batchResult = db.collection("photo").where({_id:db.command.in(query)}).get()
      //   result = result.concat(batchResult);
      //   console.info(batchResult)
      // }

      // 获取照片列表
      const fileList = userphoto.data.map(photo => {
        if (photo.genFileID){
          return photo.genFileID
        }else{
          return photo.oriFileID
        }
      })

      // 根据照片列表拉取照片的实际地址
      const photoData = []
      const realUrlsRes = await wx.cloud.getTempFileURL({ fileList })

      for (var i = 0; i < app.globalData.photos.length; i++) {
        if (realUrlsRes.fileList[i].status == 0){
          photoData.push({
            id: userphoto.data[i]._id,
            url: realUrlsRes.fileList[i].tempFileURL,
            oriFileID: userphoto.data[i].oriFileID,
            genFileID: userphoto.data[i].genFileID,
          })
        }
      }
      return photoData
    },

    onHide: function() {
    },
    onReachBottom: function() {
        this.loadMore();
    },
    loadMore: function() {
        listUserPhoto({
          openid: app.globalData.openid,
          next_id: this.data.photos[this.data.photos.length - 1].id
        }).then(res => {
          if (res.length > 0) {
            this.setData({
              photos: this.data.photos.concat(res)
            })
          }
        })
    },
    tapPage: function() {
    },
    more: function(t) {
        var index = t.currentTarget.dataset.index;
        this.setData({
            moreIndex: index,
            deletePosition: "bottom"
        });
    },
    gotoDetail: function(t) {
        var index = t.currentTarget.dataset.index;
        app.globalData.photo = this.data.photos[index]
        console.log(this.data.photos[index], index)
         wx.navigateTo({
            url: "../album-detail/album-detail"
        });
    },
    deletePhoto: function(event) {
      const { position, instance } = event.detail;
      if (position==="right") {
        var index = event.currentTarget.dataset.index
        deleteUserPhoto(this.data.photos[index].id).then(res => {
          this.data.photos.splice(index, 1)
          this.setData(
            {
              photos: this.data.photos
            }  
          )
          instance.close();
          wx.showToast({
            title: "照片已删除"
          })
        })
      }
    },
    gotoSpec: function(t) {
        wx.switchTab({
          url: '../index/index',
        })
    }
});