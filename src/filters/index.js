// 转义字符替换
export function safeStr (str) {
  if (!str) return str
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function roleFilter (value) {
  const obj = {
    true: '供应商用户',
    false: '局办用户'
  }
  return obj[value]
}
export function sexFilter (value) {
  const obj = {
    true: '男',
    false: '女'
  }
  return obj[value]
}
export function originFilter (value) {
  const obj = {
    System: '系统用户',
    Unite: '统一用户'
  }
  return obj[value]
}
export function generalStatusFilter (value, type) {
  const cnUserData = {
    NORMAL: '正常',
    ABNORMAL: '已冻结',
    LOGOUT: '注销'
  }
  const colorMap = {
    ABNORMAL: 'danger',
    NORMAL: 'normal',
    LOGOUT: 'disabled'
  }
  return type == 'color' ? colorMap[value] : cnUserData[value]
}
export function generaltypeFilter (value) {
  const obj = {
    category: '单位类型',
    topOrganization: '单位',
    department: '部门'
  }
  return obj[value]
}
export function generalStateFilter (value) {
  const obj = {
    working: '在职',
    retire: '退休'
  }
  return obj[value]
}
