import { ref, computed } from 'vue'
import constants from '@/constants'
import service from '@/service'
import utils from '@/utils'
import { type MessageInterface } from '@/service/room'
import createWebSocketClient from '@/utils/webSocketManager'
import { showToast } from 'vant'

export function useRoom() {
  const myUserId = ref<string>(utils.getLSItem(constants.localStorageKeys.USER_ID) ?? '')
  const id = ref<string>('')
  const type = ref<string>('')
  const wsClient = ref<any>()
  const config = ref<any>()
  const info = ref<any>()
  const owner = ref<any>()
  const isOwner = ref(false)
  const userList = ref<any[]>([])
  const upUserList = ref<any[]>([])
  const onMicList = ref<any[]>([])
  const messageList = ref<any[]>([])
  const heat = ref<number>(0)
  const isJoin = ref<boolean>(false)
  const custom = ref<any>({})

  const isUpSpeaker = computed(() => checkIfUp(myUserId.value))
  const isOpenedMic = computed(() => checkIfOpened(myUserId.value))

  const params = {
    roomId: '',
    userId: myUserId.value,
  }

  const init = async (roomId: string, roomType: string) => {
    id.value = roomId
    type.value = roomType
    params.roomId = id.value

    await getConfig()
    await getRoomInfo()
    await getUserList()

    if (isJoin.value) {
      await joinRoom(id.value)
    } else {
      await startChat(id.value)
    }

    if (!wsClient.value) return

    wsClient.value.setOnMessage((message: MessageInterface) => {
      switch (message.code) {
        case 3000:
          userList.value = [...userList.value, { userId: message.body.userId }]
          messageList.value = [
            ...messageList.value,
            {
              ...message.body,
              code: message.code,
              systemMsg: '进入房间',
            },
          ]
          break
        case 3001:
        case 3002:
          upUserList.value = [
            ...upUserList.value,
            {
              userId: message.body.userId,
            },
          ]
          onMicList.value = [...onMicList.value, { userId: message.body.userId }]
          messageList.value = [
            ...messageList.value,
            {
              ...message.body,
              code: message.code,
              systemMsg: '已经上麦',
            },
          ]
          break
        case 3003:
        case 3004:
          upUserList.value = upUserList.value.filter(item => item.userId !== message.body.userId)
          onMicList.value = onMicList.value.filter(item => item.userId !== message.body.userId)
          messageList.value = [
            ...messageList.value,
            {
              ...message.body,
              code: message.code,
              systemMsg: '已经下麦',
            },
          ]
          break
        case 3005:
          onMicList.value = onMicList.value.filter(item => item.userId !== message.body.userId)
          break
        case 3006:
          onMicList.value = [...onMicList.value, { userId: message.body.userId }]
          break
        case 3007:
        case 3008:
          userList.value = userList.value.filter(item => item.userId !== message.body.userId)
          onMicList.value = onMicList.value.filter(item => item.userId !== message.body.userId)
          upUserList.value = upUserList.value.filter(item => item.userId !== message.body.userId)
          messageList.value = [
            ...messageList.value,
            {
              ...message.body,
              code: message.code,
              systemMsg: message.code === 3007 ? '被踢出房间' : '离开房间',
            },
          ]
          if (message.code === 3007 && checkIfSelf(message.body.userId.toString())) {
            handleKickedOut()
          }
          break
        case 3009:
          userList.value = []
          onMicList.value = []
          upUserList.value = []
          messageList.value = [
            ...messageList.value,
            {
              ...message.body,
              code: message.code,
              systemMsg: '关闭房间',
            },
          ]
          handleCloseRoom()
          break
        case 3013:
        case 3011:
          if (message.body) {
            messageList.value = [...messageList.value, message.body] // 更新响应式数据
          }
          break
        case 3012:
          heat.value = message.body.heat
          break
        case 3015:
          info.value = message.body
          break
      }
    })
  }

  async function startChat(roomId: string) {
    const cid = await utils.getCid()
    const token = utils.getLSItem(constants.localStorageKeys.ACCESS_TOKEN) ?? ''
    wsClient.value = createWebSocketClient({
      cid,
      token,
      userId: myUserId.value,
      roomId: roomId ?? '',
      manageSiteId: import.meta.env.PUBLIC_MANAGE_SITE_ID,
    })
  }

  const joinRoom = async (joinRoomId: string) => {
    const response = await service.room.joinChatRoom({
      roomId: joinRoomId,
      secret: config.value.apiSecret,
    })
    if (response.data?.errCode === '0') {
      await startChat(joinRoomId)
    }
  }

  // 获取房间配置
  const getConfig = async () => {
    const response = await service.room.getConfig()
    if (response.data.errCode === '0') {
      config.value = response.data.data
    }
  }

  // 查询房间信息
  const getRoomInfo = async () => {
    const response = await service.room.getVoiceRoomInfo({ roomId: id.value })
    if (response.data.errCode === '0') {
      info.value = response.data.data
      owner.value = { userId: info.value.userId }
      isOwner.value = info.value.userId === myUserId.value
      upUserList.value = info.value.upUserList ?? []
      onMicList.value = initOpenedMicList(upUserList.value)
      heat.value = info.value.heat
      isJoin.value = info.value.userId !== myUserId.value
    }
  }

  // 查询房间人数
  const getUserList = async (page: number = 1, size: number = 20) => {
    const response = await service.room.getVoiceUser({
      roomId: id.value,
      page,
      size,
    })
    if (response.data.errCode === '0') {
      userList.value = [...userList.value, ...(response.data.data.list ?? [])]
    }
  }

  const initOpenedMicList = (upUserList: any) => {
    const result: any[] = []
    upUserList.map((item: any) => {
      if (item.openSpeak === 2) {
        result.push(item)
      }
    })
    return result
  }

  const checkIfOwner = (userId: string) => {
    return userId === info.value.userId
  }

  const checkIfSelf = (userId: string) => {
    return userId === myUserId.value
  }

  const checkIfOpened = (userId: string) => {
    return !!onMicList.value.find((item: any) => item.userId === userId)
  }

  const checkIfUp = (userId: string) => {
    return isOwner.value || !!upUserList.value.find((item: any) => item.userId === userId)
  }

  const checkIfExists = (userId: string) => {
    return !!userList.value.find((item: any) => item.userId === userId)
  }

  // 离开房间
  const leaveRoom = async (callback?: Function) => {
    utils
      .chain()
      .ask('是否确认离开房间！')
      .fetch(service.room.leaveRoom, params, '离开房间成功')
      .next(() => callback && callback())
  }
  // 关闭房间
  const deleteRoom = async (callback?: Function) => {
    utils
      .chain()
      .ask(关闭房间后无法恢复，是否确认关闭！)
      .fetch(service.room.deleteRoom, params, '关闭房间成功')
      .next(() => callback && callback())
  }
  // 踢出语音房
  const kickOut = async (userId: string) => {
    const userNickName = utils.getNickName('', userId)
    utils
      .chain()
      .ask("${userNickName}" 被踢出后，无法再次加入房间，是否确认踢出！)
      .fetch(service.room.kickOut, { ...params, userId }, ${userNickName}已被踢出！)
  }
  // 加热房间
  const addHeat = async () => {
    utils.chain().fetch(service.room.addHeat, { ...params, count: 1 })
  }

  const install = (key: string, value: any) => {
    custom.value[key] = value
  }

  const uninstall = (key: string) => {
    delete custom.value[key]
  }

  const handleCloseRoom = () => {
    showToast('房间已经关闭，稍后为您跳转查看更多房间')
    setTimeout(
      () =>
        utils.jumpTo(
          /room/close?type=${type.value}&title=${info.value.title}&ownerId=${owner.value.userId}&reason=close
        ),
      1500
    )
  }
  const handleKickedOut = () => {
    showToast('您已被房主移出房间，请30分钟后再次加入')
    setTimeout(
      () =>
        utils.jumpTo(
          /room/close?type=${type.value}&title=${info.value.title}&ownerId=${owner.value.userId}&reason=kick
        ),
      1500
    )
  }

  return {
    init,
    getUserList,
    checkIfOwner,
    checkIfSelf,
    checkIfOpened,
    checkIfUp,
    checkIfExists,
    leaveRoom,
    deleteRoom,
    kickOut,
    addHeat,
    install,
    uninstall,
    myUserId,
    id,
    type,
    wsClient,
    config,
    info,
    owner,
    isOwner,
    userList,
    upUserList,
    onMicList,
    messageList,
    heat,
    isUpSpeaker,
    isOpenedMic,
    custom,
  }
}