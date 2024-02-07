// const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils");
var app = getApp();
let videoAd = null
let adEnable = false
Page({
    data: {
        src:'',
        width: 250,//宽度
        height: 250,//高度
    },
    onLoad: function (options) {
        this.cropper = this.selectComponent("#image-cropper");
        this.setData({
            src:app.globalData.alphaImage,
        });

        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
              adUnitId: 'adunit-8c2d32286c9585a5'
            })
            videoAd.onLoad(() => {console.log('onLoad event emit')})
            videoAd.onError((err) => {
                console.log('onError event emit', err)
            })
            videoAd.onClose((res) => {
              if (res && res.isEnded) {
                this.cropper.generatepic(this.submit)
              } else {
                console.log('user stop unfinsh')
              }
            })
            adEnable = true
        }
        wx.showLoading({
            title: '加载中'
        })
    },

    generatepic(event){
        if (adEnable) {
            console.log("激励视频广告生效，正在弹出广告")
            videoAd.show().catch(() => {
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                console.log('激励视频 广告显示失败, 免费生成')
                this.cropper.generatepic(this.submit)
                })
            })
        } else {
            console.log("激励视频广告未生效，免费生成中")
            this.cropper.generatepic(this.submit)
        }
    },

    backindex(event){
        console.log("backindex")
        app.globalData.alphaImage = null
        wx.redirectTo({
            url: '../../pages/spec-detail/spec-detail',
          });        
    },

    // 上传图片
    uploadPhoto (filePath) {
        // 调用 wx.cloud.uploadFile 上传文件
        let nowtime = new Date(Date.parse(new Date())+ 60*60*1000*8).toISOString().substring(0,10)
        return wx.cloud.uploadFile({
        cloudPath: `usr-data/${app.globalData.openId}/${nowtime}-${Math.floor(Math.random(0, 1) * 10000000)}.jpg`,
        // cloudPath: "testimage.png",
        filePath
        })
    },

    // 添加图片信息到数据库
    async addPhotos (photo) {
        const db = wx.cloud.database()
        console.log('photo')
        console.log(photo)
        // 图片数据写入数据库
        let result = await db.collection('photo').add({
        
        data: {
            oriFileID: photo.fileID,
            genFileID: null,
            genImgWidth: null,
            genImgHeight: null,
            createTime: db.serverDate(),
            genTime: null,
            status: 1,
            width: this.data.width * this.data.export_scale,
            height: this.data.height * this.data.export_scale
        }
        })
        console.log('result')
        console.log(result)
        // 更新本地缓存
        // app.globalData.photos = [...oldPhotos, result]
        await db.collection("photo").doc(result._id).get().then(res => {
            console.log('=======res')
            console.log(res)
            app.globalData.photos.push(result)
        })

        // 更新用户数据库
        db.collection('user').doc(app.globalData.id).update({
            data: {
                photos: db.command.set(app.globalData.photos)
            }
        }).then(result => {
            console.log('写入成功', result)
        })
        return {
            id : result._id,
            fileid: photo.fileID
        }
    },

    submit() {
        wx.showLoading({ title: '提交中' })
        console.info("正在提交生成，用户状态：", app.globalData)
        this.uploadPhoto(app.globalData.alphaImage).then(result => {
            this.addPhotos(result).then(dbresult =>{
                dbresult.prompt = app.globalData.prompt
                wx.cloud.callFunction({
                    // 云函数名称
                    name: 'draw',
                    // 传给云函数的参数
                    data: dbresult,
                    success: function(res) {
                        console.log(res.result)
                    },
                    fail: console.error
                })
                console.log('callFunction draw')
            })
            wx.hideLoading()
            console.log('im here2')
            wx.switchTab({
                url: "../album/album"
            });
            console.log('im here3')
            }).catch(() => {
                wx.hideLoading()
                wx.showToast({ title: '上传图片错误', icon: 'error' })
                wx.switchTab({
                url: "../spec-detail/spec-detail"
            });
        })
    },

    upload() {
        console.log('upload=======')
        let that = this;
        wx.chooseMedia ({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                wx.showLoading({
                    title: '加载中',
                })
                const tempFilePaths = res.tempFilePaths[0];
                //重置图片角度、缩放、位置
                that.cropper.imgReset();
                that.setData({
                    src: tempFilePaths
                });
            }
        })
    },
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        //重置图片角度、缩放、位置
        this.cropper.imgReset();
        console.log(e.detail)
    },
    clickcut(e) {
        console.log('e.detail')
        console.log(e.detail);
        //点击裁剪框阅览图片
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    
})