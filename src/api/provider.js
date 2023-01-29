/**
 * Created by HaijunZhang on 2019/7/23.
 */
import request from 'utils/request'
import { wrapperParams } from 'utils'

const baseUrl = '/soc/v1/providers'
export function getProvider (params) {
  return request.get(baseUrl, {
    params
  })
}
