/**
 * Created by HaijunZhang on 2019/7/23.
 */
import request from 'utils/request'
import { wrapperParams } from 'utils'

const baseUrl = '/cos/v1/logs'

export function getLog (params) {
  return request.get(baseUrl, {
    params
  })
}
