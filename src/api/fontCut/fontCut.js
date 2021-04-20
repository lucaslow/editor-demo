import { post } from '@/axios'

/**
 * @brief: 获取传入字体包名称的子集化（字体包压缩）
 * @param [Object] data
 * @param [Number] data.user_id 用户id
 * @param [String] data.font_name 字体包名称
 * @param [String] data.text 文本信息
 * @return {*}
 * @note: 注意点
 */

export function getCutFontSrc(data) {
  return post(
    'http://font-tools.idealead-test.cluster.gdinsight.com/cutFont',
    data
  )
}
