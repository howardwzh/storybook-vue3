type WebSocketConfig = {
  cid: string //
  token: string //
  userId: string //
  roomId: string //
  manageSiteId: string //
  clientType?: string //
  businessType?: string //
  protocols?: string[] // 可选协议
  heartbeatInterval?: number // 心跳间隔 (ms)，默认 3000
  inactivityTimeout?: number // 不活动超时时间 (ms)，默认 60000
  reconnectionFetchTimeout?: number // 断开后重新获取消息的间隔 (ms)，默认 60000
}

type MessageCallback = (data: string) => void

const MAX_TRY_RECONNECT_TIME = 10
const createWebSocketClient = (config: WebSocketConfig) => {
  const {
    cid,
    token,
    userId,
    roomId,
    clientType = 'C_H5',
    businessType = 'XTK',
    manageSiteId,
    protocols = [],
    heartbeatInterval = 3000,
    inactivityTimeout = 60000,
    reconnectionFetchTimeout = 60000,
  } = config
  const url = wss://vchat.pwtk.cc/ws/${cid}/${token}/${clientType}/${businessType}/${manageSiteId}
  let ws: WebSocket | null = null
  let isConnected = false
  let lastActivityTime = Date.now() // 上次用户操作或收到消息的时间
  let lastMessageTime = Date.now() // 上次收到消息的时间
  let mainTimer: NodeJS.Timeout | null = null // 主定时器
  let onMessages: MessageCallback[] = []
  let tryReconnectTime: number = 0
  let resetTimer: NodeJS.Timeout | null = null // 重置tryReconnectTime 定时器
  let isLoginFromDiffLocation: boolean = false

  // WebSocket 连接逻辑
  const connect = () => {
    ws = new WebSocket(url, protocols)

    ws.onopen = () => {
      isConnected = true
      lastActivityTime = Date.now()
      sendHeartbeat()
      resetTimer = setTimeout(() => {
        tryReconnectTime = 0
      }, 1000)
    }

    ws.onmessage = event => {
      if (!event.data) return
      const dataParse = JSON.parse(event.data)
      if (dataParse.code === 3010) {
        isLoginFromDiffLocation = true
        ws?.close()
        return
      }
      if (dataParse.body) {
        dataParse.body = JSON.parse(dataParse.body.replace(/\"userId\":([0-9]+)/, '"userId":"$1"'))
      }
      lastActivityTime = Date.now() // 更新活动时间
      lastMessageTime = Date.now() // 更新收到消息的时间
      onMessages.forEach(cb => {
        cb(dataParse)
      })
    }

    ws.onclose = () => {
      isConnected = false
      scheduleReconnect()
    }

    ws.onerror = error => {
      console.error('WebSocket error:', error)
      ws?.close()
      isConnected = false
    }
  }

  // WebSocket 发送消息
  const sendText = (msg: string) => {
    if (isConnected && ws) {
      ws.send(
        JSON.stringify({
          code: 1002,
          roomId,
          userId,
          msg,
        })
      )
    } else {
      console.warn('WebSocket is not connected. Message not sent:', msg)
    }
  }

  // WebSocket 发送消息
  const sendImage = (imgUrl: string) => {
    if (isConnected && ws) {
      ws.send(
        JSON.stringify({
          code: 1003,
          roomId,
          userId,
          imgUrl,
        })
      )
    } else {
      console.warn('WebSocket is not connected. Message not sent:', imgUrl)
    }
  }

  // 发送心跳
  const sendHeartbeat = () => {
    if (!isLoginFromDiffLocation && isConnected && ws) {
      ws.send(JSON.stringify({ code: 1000 }))
    }
  }

  // 手动关闭连接
  const close = () => {
    stopMainTimer()
    ws?.send(JSON.stringify({ code: 1001 }))
    ws?.close()
    isConnected = false
  }

  // 统一的主定时器逻辑
  const startMainTimer = () => {
    if (mainTimer) return // 防止重复启动

    mainTimer = setInterval(() => {
      const now = Date.now()

      // 检查是否需要发送心跳
      if (isConnected && now - lastActivityTime >= heartbeatInterval) {
        sendHeartbeat()
      }

      // 检查是否需要断开连接
      if (isConnected && now - lastActivityTime >= inactivityTimeout) {
        close()
      }

      // 检查是否需要重新获取消息
      if (!isConnected && now - lastActivityTime >= reconnectionFetchTimeout) {
        connect()
      }
    }, 10000) // 每秒检查一次
  }

  const stopMainTimer = () => {
    if (mainTimer) {
      clearInterval(mainTimer)
      mainTimer = null
    }
  }

  // 自动重连逻辑
  const scheduleReconnect = () => {
    resetTimer && clearTimeout(resetTimer)
    if (!isLoginFromDiffLocation && !isConnected && tryReconnectTime < MAX_TRY_RECONNECT_TIME) {
      console.log('Reconnecting...')
      connect()
      tryReconnectTime++
    }
  }

  // 事件驱动的用户操作监听
  const setupActivityListeners = () => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    const resetActivityTimer = () => {
      lastActivityTime = Date.now()
      if (!isConnected) {
        connect() // 如果断开，立即尝试重连
      }
    }

    events.forEach(event => {
      window.addEventListener(event, resetActivityTimer)
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetActivityTimer)
      })
    }
  }

  const getSocket = (): WebSocket => {
    if (!ws) {
      throw new Error('Socket not initialized or not open!')
    }
    return ws
  }

  // 初始化
  connect()
  startMainTimer()
  const removeActivityListeners = setupActivityListeners()

  // 返回 WebSocket 客户端控制接口
  return {
    sendText,
    sendImage,
    close,
    setOnMessage: (callback: MessageCallback) => {
      onMessages.push(callback)
    },
    destroy: () => {
      close()
      removeActivityListeners()
    },
    getSocket,
  }
}
export default createWebSocketClient