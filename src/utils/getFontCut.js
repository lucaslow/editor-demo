import { getCutFontSrc } from 'api/fontCut/fontCut'
import { isArray } from 'utils/typeUtils'

/* getCutFontSrc 返回数据格式：
 **  code: 1
 **  message: "加载成功"
 **  msg: "压缩完毕"
 **  path: "/user0/syht_heavy1612339911.css"
 **  woffPath: "/user0/syht_heavy1612339911.woff"
 */
/* 参数
 ** fontName, text, userId = 0
 */
/* 获取字体包子集 */
export function loadFontFile(promiseArr) {
  if (!isArray(promiseArr)) return
  // 存储所有请求字体包的原尺寸字体包名称
  const fullsize_fontpack_subscribers = []
  const all_promise_subscribers = []
  const min_font_baseurl = 'https://font-tools.oss-cn-shenzhen.aliyuncs.com'
  const origin_font_baseurl =
    'https://font-tools.oss-cn-shenzhen.aliyuncs.com/defaultFonts/'
  promiseArr.forEach(promise => {
    /* 收集所有的请求 */
    const data = {
      user_id: promise.userId || 0,
      font_name: promise.fontName,
      text: promise.text
    }

    const promise_instance = new Promise(resolve => {
      getCutFontSrc(data).then(result => {
        if (result.code === 1) {
          const url = `${min_font_baseurl}${result.woffPath}`
          createStyleElementOffamily(promise.fontName, url)
          /* 收集原字体名称 */
          fullsize_fontpack_subscribers.push({
            fontName: promise.fontName,
            path: result.originFontFamily.replace('fontCut/font/', '')
          })
          resolve('success')
        }
      })
    })
    /* 收集需要压缩的字体请求 */
    all_promise_subscribers.push(promise_instance)
  })
  return Promise.all(all_promise_subscribers).then(res => {
    fullsize_fontpack_subscribers.forEach(sub => {
      setTimeout(() => {
        const url = `${origin_font_baseurl}${sub.path}`
        createStyleElementOffamily(sub.fontName, url)
      }, 0)
      return res
    })
  })
}

function createStyleElementOffamily(fontName, url) {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerText = `@font-face{font-family:"${fontName}";src:url("${url}")`
  document.getElementsByTagName('head')[0].appendChild(style)
}
