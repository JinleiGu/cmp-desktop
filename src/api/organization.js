import request from '../utils/request'
import { wrapperParams } from 'utils'

export function pageOr (params) {
  return request.get('soc/v1/organization/page', {
    params
  })
}

export function getTenant (params) {
  return request.get('soc/v1/tenants', {
    params
  })
}
export function getTenantDetail (id) {
  return request.get(`soc/v1/tenants/${id}`)
}

export function treeOr (params) {
  return request.get('soc/v1/organization/tree', {
    params
  })
}
// 获取组织用户列表
export function getOrUser (id, params) {
  return request(`soc/v1/organization/${id}/users`, {
    params
  })
}
// 获取组织管理员
export function getOrAdmin (id) {
  return request.get(`soc/v1/organization/${id}/managers`)
}

export function setOrAdmin (id, params) {
  return request.post(`soc/v1/organization/${id}/managers`, wrapperParams(params))
}
// 全量
export function syncOr () {
  return request.post('/soc/v1/organization/sync')
}
export function getUser (params) {
  return request.get('/soc/v1/users', {
    params
  })
}
// 获得topOrgnization下的子数据
export function getChildren (id) {
  return request.get(`soc/v1/organization/${id}/children/tree`)
}
