// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request-promise')


cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let id = event.id
  let fileid = event.fileid
  let prompt = event.prompt
  let openid = wxContext.OPENID
  let appid = wxContext.APPID
  let unionid = wxContext.UNIONID

  let retdata = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

  // 获取图像临时地址
  const fileurls = await cloud.getTempFileURL({fileList: [fileid]})
  if(fileurls.fileList==null || 
    fileurls.fileList.length==0 ||
    fileurls.fileList[0].status != 0){
      console.info("获取文件地址失败")
      retdata["status"] = -1 // 获取文件地址失败
      return retdata
    }

  // 发起绘画请求
  const options = {
    url: "https://api.zhishuyun.com/midjourney/imagine",
    method: "POST",
    headers: {
      "content-Type": "application/json"
    },
    body: JSON.stringify({
      tocken : "45ace4ba8f6f46ff958d7e7d088821ca",
      action : "generate",
      prompt : prompt
    })
  };

  // 上传并存入数据库
  const db = cloud.database()

  let result = await request(
    options
  ).then(function (res) {
    // 请求成功，上传生成的图像，存入数据库
    console.info(res)
    return res
  })
  .catch(function (err) {
    // 请求失败，更新数据库状态为生成失败
    console.info(res)
    return '请求失败'
  });
  return result
};