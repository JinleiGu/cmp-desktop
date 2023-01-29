import request from '../utils/request'
import { wrapperParams } from 'utils'
export function fetchUser (query) {
  return request({
    url: 'soc/v1/accounts',
    method: 'get',
    params: query
  })
}

export function pageUser (query) {
  return request({
    url: 'soc/v1/accounts/page',
    method: 'get',
    params: query
  })
}

export function addUser (data) {
  return request({
    url: 'soc/v1/accounts',
    method: 'post',
    data
  })
}

export function editUser (id, data) {
  return request({
    url: `soc/v1/accounts/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser (id) {
  return request({
    url: `soc/v1/accounts/${id}`,
    method: 'delete'
  })
}

export function showUser (id) {
  return request({
    url: `soc/v1/accounts/${id}`,
    method: 'get'
  })
}

export function authUser (id, data) {
  return request({
    url: `soc/v1/accounts/${id}/apps`,
    method: 'post',
    data
  })
}
export function syncUser () {
  return request({
    url: '/soc/v1/accounts/sync',
    method: 'post'
  })
}
export function showAuth (id) {
  return request({
    url: `soc/v1/accounts/${id}/apps`,
    method: 'get'
  })
}
// 修改密码
export function editPwd (id, data) {
  return request({
    url: `soc/v1/accounts/${id}/psd`,
    method: 'put',
    data
  })
}
// 忘记密码中的重置密码
export function resetPwd (params) {
  return request.put('/soc/v1/accounts/retrieve/psd', params)
}
// 用户管理中的重置密码
export function resetPwd2 (id, params) {
  return request.put(`soc/v1/accounts/${id}/reset`, params)
}
export function editStatus (id, data) {
  return request({
    url: `soc/v1/accounts/${id}`,
    method: 'patch',
    data
  })
}

export function getTheme (query) {
  return request({
    url: 'soc/v1/accounts/theme',
    method: 'get',
    params: query
  })
}

export function setTheme (data) {
  return request({
    url: 'soc/v1/accounts/theme',
    method: 'post',
    data
  })
}
// 忘记密码的请求验证码
export function getidentifyCode (params) {
  return request.put('/soc/v1/accounts/retrieve', params)
}
// 忘记密码的校验
export function checkidentifyCode (params) {
  return request.post('/soc/v1/accounts/retrieve', params)
}
export function getTrack (params) {
  return request.get('soc/v1/accounts/track', {
    params: params
  })
}
