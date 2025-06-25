/**
 * 判断是否为外部路径
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = path => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 是否是空
 * @param {*} v
 */
export const isEmpty = v => {
  return v === undefined || v === '' || v === null
}

export const isVoid = isEmpty

/** 空字符串 */
export const emptyStringRE = /\S/

/** 正整数 */
export const intergerRE = /^\d*$/

/** 小数、包含正整数、开头只能为一个零 */
export const decimalRE = /^(0|[1-9]\d*)(\.\d*)?$/

/** 手机号码 */
export const mobileRE = /^1[3456789]\d{9}$/

/** 中文 */
export const chineseRE = /[\u4e00-\u9fa5]/

/** 座机 */
export const landlineRE = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/

/** 邮编 */
export const postcodeRE = /^[1-9]\d{5}$/

/** 传真 */
export const faxRE = /^(\d{3,4}-)?\d{7,8}$/

/** 电子邮箱 */
export const emailRE = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

/** 价格 */
export const priceRE = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/

/* ipv4 */
export const ipvFourRE = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

/* ipv6 */
export const ipvSixRE =
  /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/

/**
 * 空字符串
 */
export function isEmptyStringRE(val) {
  return emptyStringRE.test(val)
}

/**
 * 正整数
 * @param {*} val
 */
export function isInterger(val) {
  return intergerRE.test(val)
}

/**
 * 小数、包含正数、开头只能为一个零
 * @param {*} val
 */
export function isDecimal(val) {
  return decimalRE.test(val)
}

/**
 * 手机号码
 * @param {*} val
 */
export function isMoblie(val) {
  return mobileRE.test(val)
}

/**
 * 座机号码
 * @param {*} val
 */
export function isLandline(val) {
  return landlineRE.test(val)
}

/**
 * 邮编
 * @param {*} val
 */
export function isPostcode(val) {
  return postcodeRE.test(val)
}

/**
 * 判断是否为传真
 * @param {string} val
 * @returns {boolean}
 */
export const isFax = val => {
  return faxRE.test(val)
}

/**
 * 电子邮箱
 * @param {*} val
 */
export const isEmail = val => {
  return emailRE.test(val)
}
