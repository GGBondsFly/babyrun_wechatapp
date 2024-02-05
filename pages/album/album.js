// const { listUserPhoto, deleteUserPhoto } = require("../../api/user_photo");

var app = getApp();

Page({
    data: {
      next_id: 0,
      photos: [],
      moreIndex: -1,
      selected:[]
    },
    onLoad: function(t) {
    },
    onOpen(event){
      // 根据id选择instance，id为van-swipe-cell元素设置的id
      let instance = this.selectComponent(`#${event.target.id}`);
      this.data.selected.push(instance);
    },
    onTap(){//这是点击其他区域时，根据id让当前打开的元素关闭
      // 循环关闭
      this.data.selected.forEach(function (instance) {
        instance.close();
      });
      // 清空
      this.data.selected = [];
    },
    onShow: function() {
      
      this.getPhotos().then(res => {
        this.setData({
          photos: res
        })
        console.log("photosonshow",res)
      })
    },

    // 获取相册中的数据
    async getPhotos () {
      // 获取数据库实例
      // const db = wx.cloxud.database({})
      
      var batchSize = 10; // 每批次的记录数
      // const userphoto_all = await db.collection("photo").get(); // 保存结果的数组
      // //use _id in user database to get photo
      // const user = await db.collection("user").get()
      // console.log(app.globalData.id)
      // console.log("userdata")
      // console.log(user.data[0].photos)
      // const id_list = []
      // for(var i = 0; i < user.data[0].photos.length; i++){
      //   id_list.push(user.data[0].photos[i]["_id"])
      // }

      // const userphoto = await db.collection("photo").orderBy('createTime', 'desc').where({_id:db.command.in(id_list)}).get()
      // console.log('userphoto')
      // console.log(userphoto)
      

      // // 按照批次检索记录
      // for (var i = 0; i < app.globalData.photos.length; i += batchSize) {
      //   var batchIds = app.globalData.photos.slice(i, i + batchSize);
      //   var query = { id: { $in: batchIds } };
      //   var batchResult = db.collection("photo").where({_id:db.command.in(query)}).get()
      //   result = result.concat(batchResult);
      //   console.info(batchResult)
      // }
      // const userphoto = app.globalData.userphoto
      const db = wx.cloud.database({})
      // const user = await db.collection('user').get()
      // const userinfo = user.data[0]
      // var photos = userinfo.photos
      const user = await db.collection('user').get()
      const userinfo = user.data[0]

      app.globalData.photos = userinfo.photos
      var photos = app.globalData.photos
      console.log("photos222",photos)
      const id_list = []
      for(var i = 0; i < photos.length; i++){
        id_list.push(photos[i]["_id"])
      }

      const userphoto = await db.collection("photo").orderBy('createTime', 'desc').where({_id:db.command.in(id_list)}).get()
      this.data.photos = userphoto.data
      // 获取照片列表
      // const fileList = userphoto.data.map(photo => {
      //   if (photo.genFileID){
      //     return photo.genFileID
      //   }else{
      //     return photo.oriFileID
      //   }
      // })

      // // 根据照片列表拉取照片的实际地址
      // const photoData = []
      // const realUrlsRes = await wx.cloud.getTempFileURL({ fileList })
      
      // for (var i = 0; i < app.globalData.photos.length; i++) {
      //     console.log(realUrlsRes.fileList[i])
      //     console.log(realUrlsRes)
      //   if (realUrlsRes.fileList[i].status == 0){
      //     photoData.push({
      //       id: userphoto.data[i]._id,
      //       url: realUrlsRes.fileList[i].tempFileURL,
      //       oriFileID: userphoto.data[i].oriFileID,
      //       genFileID: userphoto.data[i].genFileID,
      //     })
      //   }
      // }
      

      const photoData = []
      for (var i = 0; i < userphoto.data.length; i++) {
          const dict = {}
          dict["status"] = userphoto.data[i].status
          if (userphoto.data[i].status == 1){
            
            dict["genFileID"] = "../../assets/icon/generating.png"}
          if (userphoto.data[i].status == 'failed'){
            dict["genFileID"] = "../../assets/icon/failed.png"}
          if (userphoto.data[i].status == 0){
            dict["genFileID"] = userphoto.data[i].genFileID}
          
          
          dict["oriFileID"] = userphoto.data[i].oriFileID
          dict["id"] = userphoto.data[i]._id
          photoData.push(dict)
      }
      return photoData
    },
    onPullDownRefresh () {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      this.getPhotos().then(res => {
        this.setData({
          photos: res
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
        wx.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 2000
        })
      })
    },
    onHide: function() {
    },
    // onReachBottom: function() {
    //     this.loadMore();
    // },
    // loadMore: function() {
    //     listUserPhoto({
    //       openid: app.globalData.openid,
    //       next_id: this.data.photos[this.data.photos.length - 1].id
    //     }).then(res => {
    //       if (res.length > 0) {
    //         this.setData({
    //           photos: this.data.photos.concat(res)
    //         })
    //       }
    //     })
    // },
    tapPage: function() {
    },
    more: function(t) {
        var index = t.currentTarget.dataset.index;
        this.setData({
            moreIndex: index,
            deletePosition: "bottom"
        });
    },
    gotoDetail_ori: function(t) {
        var index = t.currentTarget.dataset.index;
        console.log("gotoDetail_ori")
        console.log(this.data.photos[index].oriFileID, index)
        app.globalData.photo = this.data.photos[index].oriFileID
        
         wx.navigateTo({
            url: "../album-detail-ori/album-detail-ori"
        });
    },
    gotoDetail_gen: function(t) {
      var index = t.currentTarget.dataset.index;
      app.globalData.photo = this.data.photos[index].genFileID
      

      console.log("gotoDetail")
      console.log(this.data.photos[index], index)
      console.log('status',this.data.photos[index])
      if (this.data.photos[index].status == 0){
        wx.navigateTo({
          url: "../album-detail/album-detail"
        });
      }
      else{
        if (this.data.photos[index].status == 1){
          app.globalData.photo = '../../assets/icon/generating.png'
          wx.navigateTo({
            url: "../album-detail-ori/album-detail-ori"
          });
        }
        else{
          app.globalData.photo = '../../assets/icon/failed.png'
          wx.navigateTo({
            url: "../album-detail-ori/album-detail-ori"
          });
        }
      }
      //  wx.navigateTo({
      //     url: "../album-detail/album-detail"
      // });
    },
    deletePhoto: function(event) {

      const { position, instance } = event.detail;
      console.log(event)
      if (position==="right") {
        var index = event.currentTarget.dataset.index
        console.log("deletePhoto",this.data.photos[index])
        var _id = this.data.photos[index].id
        const db = wx.cloud.database({})
        const userid = app.globalData.id
        db.collection("user").doc(userid).update({
          data: {
            photos: db.command.pull({
              _id: _id
            })
          }
        }).then(res => {
          this.data.photos.splice(index, 1)
          // app.globalData.photos.splice(index, 1)
          
          this.setData({
              photos: this.data.photos,
              index: index
            })
          //delete photo from globaldata.photos
          
          console.log("deletePhoto1111",app.globalData.photos)
          console.log("deletePhoto222",this.data.photos)
          instance.close();
          wx.showToast({
            title: "照片已删除"
          })
        })
        
        // instance.close();
        // //reload the page
        // this.onShow()


        // wx.showToast({
        //   title: "照片已删除"
        // })
        
        
        // deleteUserPhoto(this.data.photos[index].id).then(res => {
        //   this.data.photos.splice(index, 1)
        //   this.setData(
        //     {
        //       photos: this.data.photos
        //     }  
        //   )
        //   instance.close();
        //   wx.showToast({
        //     title: "照片已删除"
        //   })
        // })
      }
    },
    gotoSpec: function(t) {
        wx.switchTab({
          url: '../index/index',
        })
    }
});