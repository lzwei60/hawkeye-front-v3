/*
 * @Description: 设置缓存数据。
 * @Author: zhubc
 * @Time: 2019-11-27 14:49:25
 * @LastAuthor: zhubc
 * @LastTime: 2019-11-28 09:14:41
 */
import Cookies from 'js-cookie'

/**
 * @description: 将数据保存到cookies中
 * @param key String
 * @param value 当值为对象或者数组时，会通过 JSON.stringify 将对象转化为字符串保存
 * @param opts expires 定义有效期。如果传入Number，那么单位为天，你也可以传入一个Date对象，表示有效期至Date指定时间。
 *                      默认情况下cookie有效期截止至用户退出浏览器。
 *             path string，表示此cookie对哪个地址可见。默认为”/”。
 *             domain string，表示此cookie对哪个域名可见。设置后cookie会对所有子域名可见。
 *                            默认为对创建此cookie的域名和子域名可见。
 *             secure true或false，表示cookie传输是否仅支持https。默认为不要求协议必须为https。
 * @return:
 */
export function setCookies(key, value, opts) {
	Cookies.set(key, value, opts)
}

/**
 * @description: 获取保存到cookies中的数据
 * @param key String
 * @return: String
 */
export function getCookies(key) {
	return Cookies.get(key)
}

/**
 * @description: 移除cookies中保存的对象
 * @param key String
 * @param opts 如果值设置了路径，那么不能用简单的delete方法删除值，需要在delete时指定路径
 * @return:
 */
export function removeCookies(key, opts) {
	Cookies.remove(key, opts)
}

/**
 * @description: 设置本地缓存 始终存在
 * @param key String
 * @param value
 * @param jsonFlag 是否需要转化为json字符串
 * @return:
 */
export function setLocalStorage(key, value, jsonFlag?: boolean) {
	localStorage.setItem(key, jsonFlag ? JSON.stringify(value) : value)
}

/**
 * @description: 获取本地缓存数据
 * @param key String
 * @param jsonFlag 是否需要通过json转化为对象
 * @return:
 */
export function getLocalStorage(key, jsonFlag?: boolean) {
	return jsonFlag
		? JSON.parse(localStorage.getItem(key) as string)
		: localStorage.getItem(key)
}

/**
 * @description: 删除本地缓存数据
 * @param key String
 * @return:
 */
export function removeLocalStorage(key) {
	localStorage.removeItem(key)
}

/**
 * @description: 清空本地缓存
 * @return:
 */
export function clearLocalStorage() {
	localStorage.clear()
}

/**
 * @description: 设置会话缓存 始终存在
 * @param key String
 * @param value
 * @param jsonFlag 是否需要转化为json字符串
 * @return:
 */
export function setSessionStorage(key, value, jsonFlag) {
	sessionStorage.setItem(key, jsonFlag ? JSON.stringify(value) : value)
}

/**
 * @description: 获取会话缓存数据
 * @param key String
 * @param jsonFlag 是否需要通过json转化为对象
 * @return: {}
 */
export function getSessionStorage(key, jsonFlag) {
	return jsonFlag
		? JSON.parse(sessionStorage.getItem(key) as string)
		: sessionStorage.getItem(key)
}

/**
 * @description: 删除会话缓存数据
 * @param key String
 * @return:
 */
export function removeSessionStorage(key) {
	sessionStorage.removeItem(key)
}

/**
 * @description: 清空会话缓存
 * @return:
 */
export function clearSessionStorage() {
	sessionStorage.clear()
}

const shouldRemove = (key, storageKeyPrefix) => {
	if (Array.isArray(storageKeyPrefix)) {
		storageKeyPrefix = storageKeyPrefix.concat('storageKeyPrefix')
		return storageKeyPrefix.some((prefix) => key.startsWith(prefix))
	}
	if (storageKeyPrefix) {
		return key.startsWith(storageKeyPrefix)
	}
	return false
}

export function clearLocalStorageSafe(storageKeyPrefix) {
	let keys = Object.keys(localStorage)
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i]
		if (shouldRemove(key, storageKeyPrefix)) {
			localStorage.removeItem(key)
		}
	}
}

export function clearSessionStorageSafe(storageKeyPrefix) {
	const keys = Object.keys(sessionStorage)
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i]
		if (shouldRemove(key, storageKeyPrefix)) {
			sessionStorage.removeItem(key)
		}
	}
}

export function clearStorageSafe(storageKeyPrefix) {
	clearLocalStorageSafe(storageKeyPrefix)
	clearSessionStorageSafe(storageKeyPrefix)
}

/*
 *@functionName: createMap
 *@params1: arr
 *@params2: key
 *@params3: value
 *@description: 创建一个字典
 *@date: 2021-06-09 16:19:34
 */
export const createMap = (arr = <any>[], key = 'key', value) => {
	const map = new Map()
	arr.forEach((e) => {
		map.set(e[key], value === undefined ? e : e[value])
	})
	return map
}
