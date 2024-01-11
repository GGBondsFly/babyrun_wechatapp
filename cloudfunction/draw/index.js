// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request-promise')
const fs = require('fs')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let fileid = event.fileid
  let prompt = event.prompt
  let openid = wxContext.OPENID
  let appid = wxContext.APPID
  let unionid = wxContext.UNIONID
  console.log('draw main')
  return drawfunc(event.id, fileid, prompt)
};

async function drawfunc (id, fileid, prompt){
  return cloud.getTempFileURL({
    fileList: [fileid]
  }).then(function(res) {
    console.info("get file url success")
    return callapi(id, res.fileList[0].tempFileURL, prompt)
  }).catch(function(err) {
    // 获取文件url失败
    console.info("get file url failed", err)
    return updateDb(id, {status: -1})
  })
}

async function mockDrawApi(options){
  return JSON.stringify({
    image_url:"https://midjourney.cdn.zhishuyun.com/attachments/1124768570157564029/1190124531227054160/cvye346_1baby_chinese_baby_1_years_old_id1676928_a5db8767-0c91-4b3c-8259-950572e79e9b.png?ex=65a0a8d7&is=658e33d7&hm=99388dcd7cc8fd06b3d155e928d895222f66d7b18e28f80cd1ad341d48dac8ca&width=1024&height=1024",
    image_width:1024,
    image_height:1024
  })
}

async function callapi (id, fileurl, prompt){
  // 发起绘画请求
  const options = {
    url: "https://api.zhishuyun.com/midjourney/imagine?token=2d0da011f83947aa91545bca51cd366d",
    method: "POST",
    headers: {
      "content-Type": "application/json"
    },
    body: JSON.stringify({
      action : "generate",
      prompt : fileurl + prompt
    })
  };
  console.info("post to draw with ", options)
  //set Rotation training mode five times.if success, return 
  // let count = 0
  // let ret = ""
  // while(count < 5){
  //   ret = await request(options)
  //   console.info("draw image: ", ret)
  //   let retobj = JSON.parse(ret)
  //   if(retobj.success == true){
  //     console.info("success draw image: ", ret)
  //     return savephoto(id, ret)
  //   }
  //   count++
  // }
  // console.info("failed post to draw image: ", ret)
  // return updateDb(id, {status: -2})
  return mockDrawApi(options).then(function (res) {
//   return request(options).then(function (res) {
    // 请求成功，上传文件
    let ret = JSON.parse(res)
    console.info("success draw image: ", ret)
    return savephoto(id, ret)
  }).catch(function (err) {
    // 请求失败，更新数据库状态为生成失败
    console.info("failed post to draw image: ", err)
    return updateDb(id, {status: -2})
  });
}

async function savephoto (id, drawret){
  downloadBin(drawret.image_url).then(function (res) {
    console.info("download from remote success")
    return upToWx(id, res, drawret.image_width, drawret.image_height)
  }).catch(function (err) {
    console.info("failed upload draw image: ", err)
    return updateDb(id, {status: -3})
  })
}

async function downloadBin(url){
  const options = {
    url: url,
    encoding: null,
    headers: {
      "content-type": "application/octet-stream",
    },
  }
  return request(options)
}

async function upToWx(id, res, width, height){
  let buf = Buffer.from(res)
  cloud.uploadFile({
    cloudPath: `gen_${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
    fileContent: buf
  }).then(function (res) {
    console.log("up generate image success!")
    return updateDb(
      id, 
      {
        status: 0,
        genFileID:res.fileID,
        genImgWidth:width,
        genImgHeight:height
      })
  }).catch(function (err) {
    console.info("failed upload draw image: ", err)
    return updateDb(id, {status: -4})
  })
}

async function updateDb(id, data){
  return db.collection('photo').doc(id).update({
    data: data
  }).then(
    function(res) {
      console.log("update db success!, id: ", id)
    }
  )
}