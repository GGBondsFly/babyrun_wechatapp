const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils");
var app = getApp();
Page({
    data: {
        src:'',
        width: 250,//宽度
        height: 250,//高度
    },
    onLoad: function (options) {
    //获取到image-cropper实例
        this.cropper = this.selectComponent("#image-cropper");
        console.log('onload=======')
        // compress(app.globalData.alphaImage, 2*1024*1024, 80, r=> {
        //     // var tempFilePaths = r.tempFilePath;
        //     //开始裁剪
        //     this.setData({
        //         src:r,
        //     });
        // })
        console.log("onload",app.globalData.alphaImage)
        this.setData({
            src:app.globalData.alphaImage,
        });
        wx.showLoading({
            title: '加载中'
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