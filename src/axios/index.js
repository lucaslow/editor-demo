import axios from 'axios'
import { message } from 'ant-design-vue'

/* Axios 默认配置 */
axios.defaults.timeout = 12000 // 请求超时时间
axios.defaults.baseURL = process.env.VUE_APP_BASE_API // 设置请求头
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;' // post请求头的设置

/* Axios 请求拦截器 */
axios.interceptors.request.use(
  config => {
    /* 一般配置登录的token */
    // let token = store.getters['login/token'];
    // token && (config.headers.token = token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)

/* Axios 响应拦截器 */
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误 结合自身业务和后台返回的接口状态约定写respone拦截器
    if (response.status === 200 && response.data.code === 200) {
      return Promise.resolve(response)
    } else {
      /* 错误码不为200处理 */
      switch (response.data.code) {
        case 1:
          response.data.message = '加载成功'
          break
        case 400:
          response.data.message = '请求错误'
          break // 400：请求错误
        case 401:
          response.data.message = '未授权，请登录'
          break // 401：未登录
        default:
          break
        /* 其他处理 */
      }
      response.data.code !== 1 && message.warning(response.data.message, 1)
      return response
    }
  },
  error => {
    const responseCode = error.response.status
    switch (responseCode) {
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break // 404请求不存在
      case 408:
        error.message = '请求超时'
        break // 请求超时
      case 500:
        error.message = '服务器内部错误'
        break // 服务器内部错误
      default:
      /* 其他处理 */
    }
    message.error(error.message, 1)
    return Promise.reject(error.response)
  }
)

/**
 * 封装get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/* 加上了cancelToken  的 post */
function postWithCancel(url, params, cancelToken) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        cancelToken
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export { get, post, postWithCancel }

/* 
http 响应码

switch (responseCode) {
      case 400:
        error.message = '请求错误'
        break // 400：请求错误
      case 401:
        error.message = '未授权，请登录'
        break // 401：未登录
      case 403:
        error.message = '拒绝访问'
        break // 403：拒绝访问
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break // 404请求不存在
      case 408:
        error.message = '请求超时'
        break // 请求超时
      case 500:
        error.message = '服务器内部错误'
        break // 服务器内部错误
      default:
       // 其他处理
    }
*/
