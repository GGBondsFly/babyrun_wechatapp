import settings from "../settings"

wx.cloud.init({
    env: 'prod-7gqrt3ipc65119e3', //填上你的云开发环境id
    traceUser: true,
  })

class Request {
  constructor(params) {
    this.withBaseURL = params.withBaseURL
    this.baseURL = params.baseURL
  }

  get(url, data) {
    return this.request('GET', url, data)
  }

  post(url, data) {
    return this.request('POST', url, data)
  }

  patch(url, data) {
    return this.request('PATCH', url, data)
  }

  delete(url) {
    return this.request('DELETE', url)
  }
  request(
    method,  // 请求方法
    url,    // 请求地址
    data     // 请求数据
  ) {
      console.log('request began')
      const res = wx.cloud.callContainer({
        "config": {
          "env": "prod-7gqrt3ipc65119e3", // 环境id必填，不能为空
        },
        "data":{
            "fileid": data
          },
        "path": url,
        "method": method,
        "header": {
          'X-WX-SERVICE': "django-xo4u", // 填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          'Cookie': wx.getStorageSync('cookies') || '',
          "content-type": "application/json"
        },
        "timeout": 1500
      })
      return res 
    } 
  }
//   request(method, url, data) {
//     return new Promise((resolve, reject) => {
//       wx.request({
//         method,
//         data,
//         url: this.withBaseURL ? this.baseURL + url : url,
//         success: (res) => {
//           if (res.statusCode >= 400) {
//             console.log("http code error, code: " + res.statusCode + ", data: "+ res.data)
//             wx.showToast({
//               title: '[' + res.statusCode + '] 请求异常，请重试或检查网络！',
//               icon: 'none'
//             })
//             return
//           }
//           if (res.data.status != 2000) {
//             console.log("bussiness code error, data: "+ res.data)
//             wx.showToast({
//               title: '[' + res.data.status + '] ' + res.data.remark,
//               icon: 'none'
//             })
//             return
//           }
//           resolve(res.data.data)
//         },
//         fail: (err) => reject(err),
//       })
//     })
//   }
// }

export default new Request({
  withBaseURL: true,
  baseURL: settings.host.photo,
})


// request(method, url, data) {
//     return new Promise((resolve, reject) => {
//         wx.cloud.callContainer({
//             config: {
//                 env: 'prod-7gqrt3ipc65119e3', // 微信云托管的环境ID
//             },
//             method: method,
//             path: this.withBaseURL ? this.baseURL + url : ur,
//             data: data,
//             "header": {
//                 "X-WX-SERVICE": "django-xo4u"
//             },
//             success: (res) => {
//             if (res.statusCode >= 400) {
//                 console.log("http code error, code: " + res.statusCode + ", data: "+ res.data)
//                 wx.showToast({
//                 title: '[' + res.statusCode + '] 请求异常，请重试或检查网络！',
//                 icon: 'none'
//                 })
//                 return
//             }
//             if (res.data.status != 2000) {
//                 console.log("bussiness code error, data: "+ res.data)
//                 wx.showToast({
//                 title: '[' + res.data.status + '] ' + res.data.remark,
//                 icon: 'none'
//                 })
//                 return
//             }
//             resolve(res.data.data)
//             },
//             fail: (err) => reject(err),
//       })
//     })
//   }