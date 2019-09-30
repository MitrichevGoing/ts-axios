import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

// export default function xhr(config: AxiosRequestConfig) {
//   const {data = null, url, method = 'get', headers} = config
//
//   const request = new XMLHttpRequest()
//
//   request.open(method.toLocaleUpperCase(), url ,true)
//
//   /**
//    * 当传入的 data 为架空的时候，请求header 配置 Content-type 是没有意义的，需要将它删除
//    */
//
//   Object.keys(headers).forEach((name) => {
//     if(data === null &&name.toLowerCase() === 'content-type') {
//       delete headers[name]
//     } else {
//       request.setRequestHeader(name, headers[name])
//     }
//   })
//
//   request.send(data)
//
// }

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      const responseHeaders = request.getAllResponseHeaders()
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
