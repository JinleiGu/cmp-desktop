import request from '../utils/request'
const baseUrl = '/cos/v1/icons'

export function pageIcon (params) {
  return request.get(baseUrl, {
    params
  })
}

export function deleteIcon (id) {
  return request.delete(`${baseUrl}/${id}`)
}
