import request from '../utils/request'
import { wrapperParams } from 'utils'

const baseUrl = '/soc/v1/apps'
export function getUserApp () {
  return request.get('soc/v1/accounts/apps')
}

export function sortApp (params) {
  return request.post(`${baseUrl}/order`, wrapperParams(params))
}

export function pageApp (params) {
  return request.get(baseUrl, {
    params
  })
}

export function addApp (params) {
  return request.post(baseUrl, wrapperParams(params))
}

export function editApp (params) {
  return request.put(`${baseUrl}/${params.id}`, wrapperParams(params))
}

export function deleteApp (id) {
  return request.delete(`${baseUrl}/${id}`)
}

export function getAppDetail (id) {
  return request.get(`${baseUrl}/${id}`)
}

export function authApp (id, params) {
  return request.post(`${baseUrl}/${id}/users`, wrapperParams(params))
}

export function showAuth (id) {
  return request.get(`${baseUrl}/${id}/users`)
}

export function handleApp (id) {
  return request.put(`${baseUrl}/${id}/roles`)
}
