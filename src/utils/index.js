/**
 * Created by HaijunZhang on 2019/7/23.
 */
import Clipboard from 'clipboard'
import { getToken } from 'utils/auth'
import request from 'utils/request'

export function wrapperParams (data) {
  return { params: JSON.stringify(data) }
}
export const formatEqParams = params => {
  return { page: 1, rows: 1000, params: JSON.stringify([{ param: params, sign: 'EQ' }]) }
}
export const copyText = (text, event, successCallback, errorCallback) => {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    successCallback && successCallback()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    errorCallback && errorCallback()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
// export const downloadFile = (url, params = {}) => {
//   request
//     .get(url, {
//       // headers: { 'Content-Type': params.fileFormat },
//       responseType: 'blob',
//       // params: wrapperParams(params),
//       options: {
//         isBlob: true
//       }
//     })
//     .then(data => {
//       var ele = document.createElement('a') // 创建下载链接
//       ele.download = 'filename' // 设置下载的名称
//       ele.style.display = 'none' // 隐藏的可下载链接
//       // 字符内容转变成blob地址
//       const blob = new Blob([data])
//       ele.href = URL.createObjectURL(blob)
//       // 绑定点击时间
//       document.body.appendChild(ele)
//       ele.click()
//       // 然后移除
//       document.body.removeChild(ele)
//     })
// }
export const downloadFile = (url, params = {}) => {
  let str = ''
  Object.keys(params).forEach(item => {
    str += `&${item}=${params[item]}`
  })
  window.location.href = encodeURI(`/api${url}?token=${getToken()}${str}`)
}
export const getQuery = hash => {
  const queryArr = hash.split('?');
  if (queryArr.length === 1) {
    return {}
  }
  const query = {}
  queryArr[1].split('&').forEach(item => {
    const [key, value] = item.split('=');
    query[key] = value;
  })
  return query
}
// 查询参数封装优化
export function handleSearchParam (params) {
  // 设置参数
  const objParams = {};
  function setParams (sign, key, value) {
    if (objParams[sign]) {
      objParams[sign][key] = value;
    } else {
      objParams[sign] = {
        [key]: value
      };
    }
  }
  // 将参数处理为对象
  for (const a in params) {
    const value = params[a];
    // 对参数进行处理，去除空参数
    if (value === '' || value === undefined || value === null) continue;
    // 对key值进行处理
    const [key, sign = 'EQ'] = a.split(':');
    // 将sign全部转换为大写
    const signs = sign.toLocaleUpperCase();
    if (signs === 'RANGE') {
      const [first, second] = value;
      setParams('GET', key, first);
      setParams('LET', key, second);
      continue;
    }
    setParams(signs, key, value);
  }
  const result = [];
  for (const a in objParams) {
    result.push({ param: objParams[a], sign: a });
  }
  return JSON.stringify(result);
}
