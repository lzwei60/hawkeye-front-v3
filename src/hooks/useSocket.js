import { useAuth } from '@/hooks'

let socket = null
const messages = ref([])
export function useSocket() {
	const { $userId } = useAuth()

	/**
	 * 连接
	 */
	const socketConnect = () => {
		if (socket || !$userId.value) return // 避免重复连接或未登录

		socket = new WebSocket('ws://localhost:2346')

		socket.onopen = () => {
			console.log('WebSocket 连接成功')

			socket?.send(
				JSON.stringify({
					type: 'online',
					userId: $userId.value,
				})
			)
		}

		socket.onmessage = (event) => {
			console.log('收到消息:', event.data)
			messages.value.push(event.data)
		}

		socket.onerror = (err) => {
			console.error('WebSocket 错误:', err)
		}

		socket.onclose = () => {
			console.log('WebSocket 连接关闭')
			socket = null
		}
	}

	/**
	 * 发送信息
	 */
	const socketSend = (data) => {
		if (socket?.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(data))
		} else {
			console.warn('WebSocket 未连接，无法发送')
		}
	}

	onBeforeUnmount(() => {
		socket?.close()
		socket = null
	})

	return {
		messages,

		socketConnect,
		socketSend,
	}
}
