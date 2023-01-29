import request from 'utils/request'
import { wrapperParams } from 'utils'

const baseUrl = '/soc/v1/vendor/group'
// 分页查询用户资源组
export function getGroup (params) {
  return request.get(baseUrl, {
    params
  })
}
// 查询用户资源组详情
export function getGroupDetail (id) {
  return request.get(`${baseUrl}/${id}`)
}
// 添加用户资源组
export function createGroup (params) {
  return request.post(baseUrl, wrapperParams(params))
}
// 修改用户资源组
export function modifyGroup (params) {
  return request.put(`${baseUrl}/${params.id}`, wrapperParams(params))
}
// 删除用户资源组
export function removeGroup (id) {
  return request.delete(`${baseUrl}/${id}`)
}
// 添加用户至资源组
export function createUserGroup (id, params) {
  return request.post(`${baseUrl}/${id}/users`, wrapperParams(params))
}
// 查询用户资源组下用户
export function getUserGroup (id) {
  return request.get(`${baseUrl}/${id}/users`)
}
// 授权平台资源给资源组
export function authVendorsGroup (id, params) {
  return request.post(`${baseUrl}/${id}/vendors`, wrapperParams(params))
}
// 查询用户资源组下平台资源
export function getVendorsGroup (id) {
  return request.get(`${baseUrl}/${id}/vendors`)
}
// 获取平台资源
export function getVendors (params) {
  return request.get('ims/v1/vendors', {
    params
  })
}
