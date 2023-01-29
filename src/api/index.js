import request from '../utils/request'

export function login (params) {
  return request.post('/soc/v1/login', params)
}

export function logout () {
  return request.post('/soc/v1/logout')
}

export function getInfo () {
  return request.get('/soc/v1/users/info')
}
// 获取token
export function replaceToken (params) {
  return request.get('/soc/v1/token', { params })
}
// 刷新状态
export function refreshStatus () {
  return request.get('/soc/v1/accounts/status')
}
// 登录验证码
export function getCode () {
  return request.get('soc/v1/captcha')
}
