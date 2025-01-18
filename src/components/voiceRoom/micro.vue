<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  import constants from '@/constants'
  import utils from '@/utils'
  import Janus from '@/utils/janus/janus.js'
  import service from '@/service'
  import mic from '@/assets/icons/mic.svg'
  import micBan from '@/assets/icons/mic_ban.svg'

  import loadAdapter from '@/utils/janus/loadAdapter'
  import { Button, showToast, Icon as VanIcon, showDialog } from 'vant'
  import createVoiceChanger from '@/utils/janus/createVoiceChanger'

  const myUserId = ref<string>(utils.getLSItem(constants.localStorageKeys.USER_ID) ?? '')
  const props = withDefaults(
    defineProps<{
      room: any
      onlyListen?: boolean
    }>(),
    {
      room: null,
      onlyListen: true,
    }
  )

  const openedMic = ref(false)
  const header1 = ref(null)
  const localStream = ref<MediaStream>()
  const streamForPlay = ref<MediaStream>()
  const mutedVoice = ref(true)
  const voiceChanger = ref<any>(null)
  const showAllType = ref<boolean>(false)
  const currentType = ref<string>('normal')
  const params = {
    roomId: props.room?.id.value,
    userId: myUserId.value,
  }

  let mypvtid: any = null

  const toggleMic = async (type?: boolean) => {
    openedMic.value = typeof type === 'boolean' ? type : !openedMic.value
    if (openedMic.value) {
      openMic()
    } else {
      closeMic()
    }
  }
  const toggleVoice = (type?: boolean) => {
    mutedVoice.value = typeof type === 'boolean' ? !type : !mutedVoice.value
    if (mutedVoice.value) {
      Janus.attachMediaStream(header1.value, null)
    } else {
      Janus.attachMediaStream(header1.value, streamForPlay.value)
    }
  }
  const toggleMicStream = async (open: boolean) => {
    if (!open) {
      unpublishAudio()
    } else {
      publishAudio(true)
    }
    openedMic.value = open
  }

  props.room.install('toggleMicStream', toggleMicStream)

  const getQueryStringValue = (name: string) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      result = regex.exec(window.location.search)
    return result === null ? '' : decodeURIComponent(result[1].replace(/\+/g, ' '))
  }

  // 语音内容
  const vcodec = getQueryStringValue('vcodec') !== '' ? getQueryStringValue('vcodec') : null
  const acodec = getQueryStringValue('acodec') !== '' ? getQueryStringValue('acodec') : null
  const doDtx = getQueryStringValue('dtx') === 'yes' || getQueryStringValue('dtx') === 'true'
  const use_msid = getQueryStringValue('msid') === 'yes' || getQueryStringValue('msid') === 'true'
  let doSvc: any = getQueryStringValue('svc')
  if (doSvc === '') {
    doSvc = null
  }
  let janus: any = null
  let sfutest: any = null
  var feeds: any[] = []
  let feedStreams: any = {}
  let opaqueId: string | null = null
  // 语音内容end

  const createRoom = async () => {
    opaqueId = 'audiobridgetest-' + Janus.randomString(12)
    Janus.init({ debug: 'all' })
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support navigator.mediaDevices. Please use a modern browser.')
    }
    if (props.room.id.value) {
      //是否有房间名称
      if (!Janus.isWebrtcSupported()) {
        alert('No WebRTC support... ')
        return
      }
      janus = new Janus({
        'server': props.room.config.value.serverUrl,
        'iceServers': null,
        'apisecret': props.room.config.value.apiSecret,
        'subscriber-mode': props.onlyListen,
        // iceServers: null,
        'success': function () {
          janus.attach({
            plugin: 'janus.plugin.videoroom',
            opaqueId: opaqueId,
            success: function (pluginHandle: any) {
              sfutest = pluginHandle
              registerUsername()
            },
            webrtcState: function (on: any, reason: any) {
              console.log(on, reason, 'webrtcState状态')
            },
            onmessage: function (msg: any, jsep: any) {
              let event = msg.videoroom
              if (event) {
                if (event === 'joined') {
                  mypvtid = msg['private_id']
                  if (msg['publishers']) {
                    let list = msg['publishers']
                    for (let f in list) {
                      if (list[f]['dummy']) continue
                      let id = list[f]['id']
                      let streams = list[f]['streams']
                      let display = list[f]['display']
                      for (let i in streams) {
                        let stream = streams[i]
                        stream['id'] = id
                        stream['display'] = display
                      }
                      feedStreams[id] = streams
                      newRemoteFeed(id, streams)
                    }
                  }
                } else if (event === 'event') {
                  if (msg['publishers']) {
                    let list = msg['publishers']
                    for (let f in list) {
                      if (list[f]['dummy']) continue
                      let id = list[f]['id']
                      let display = list[f]['display']
                      let streams: any = list[f]['streams']
                      for (let i in streams) {
                        let stream = streams[i]
                        stream['id'] = id
                        stream['display'] = display
                      }
                      feedStreams[id] = streams
                      Janus.debug('  >> [' + id + '] ' + display + ':', streams)
                      newRemoteFeed(id, streams)
                    }
                  }
                }
              }

              const audiobridge = msg.audiobridge
              if (audiobridge === 'event' && msg.participants) {
                msg.participants.forEach((participant: any) => {
                  if (participant.audio_level) {
                    console.log(User ${participant.display} is speaking with audio level ${participant.audio_level})
                  }
                })
              }

              if (msg.videoroom === 'event' && msg.talkers) {
                // 假设 msg.talkers 包含用户正在说话的列表
                const speakingUsers = new Set<string>()
                speakingUsers.clear()
                msg.talkers.forEach((talker: any) => {
                  speakingUsers.add(talker.id)
                })
                console.log('Currently speaking users:', [...speakingUsers])
              }

              if (jsep) {
                sfutest.handleRemoteJsep({ jsep: jsep })
              }
            },
            onremotetrack: function (track: any, mid: any, on: any, metadata: any) {
              console.log(track, mid, on, metadata, 'onremotetrack')
            },
          })
        },
      })
    }
  }
  const newRemoteFeed = (id: any, streams: any) => {
    let remoteFeed: any = null
    if (!streams) {
      streams = feedStreams[id]
    }
    janus.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: opaqueId,
      success: function (pluginHandle: any) {
        remoteFeed = pluginHandle
        remoteFeed.remoteTracks = {}
        remoteFeed.remoteVideos = 0
        remoteFeed.simulcastStarted = false
        remoteFeed.svcStarted = false
        let subscription = []
        for (let i in streams) {
          let stream: any = streams[i]
          if (
            stream.type === 'video' &&
            Janus.webRTCAdapter.browserDetails.browser === 'safari' &&
            ((stream.codec === 'vp9' && !Janus.safariVp9) || (stream.codec === 'vp8' && !Janus.safariVp8))
          ) {
            continue
          }
          subscription.push({
            feed: stream.id,
            mid: stream.mid,
          })
          remoteFeed.rfid = stream.id
          remoteFeed.rfdisplay = escapeXmlTags(stream.display)
        }
        let subscribe = {
          request: 'join',
          room: props.room.id.value,
          ptype: 'subscriber',
          streams: subscription,
          id: myUserId.value,
          use_msid: use_msid,
          private_id: mypvtid,
        }
        remoteFeed.send({ message: subscribe })
      },
      onmessage: function (msg: any, jsep: any) {
        console.log(msg, '订阅onmessage')
        let event = msg['videoroom']
        if (event) {
          if (event === 'attached') {
            for (let i = 1; i < 6; i++) {
              if (!feeds[i]) {
                feeds[i] = remoteFeed
                remoteFeed.rfindex = i
                break
              }
            }
          }
        }
        if (jsep) {
          Janus.debug('Handling SDP as well...', jsep)
          let stereo = jsep.sdp.indexOf('stereo=1') !== -1
          // Answer and attach
          remoteFeed.createAnswer({
            jsep: jsep,
            // We only specify data channels here, as this way in
            // case they were offered we'll enable them. Since we
            // don't mention audio or video tracks, we autoaccept them
            // as recvonly (since we won't capture anything ourselves)
            tracks: [{ type: 'data' }],
            customizeSdp: function (jsep: any) {
              if (stereo && jsep.sdp.indexOf('stereo=1') == -1) {
                // Make sure that our offer contains stereo too
                jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1')
              }
            },
            success: function (jsep: any) {
              Janus.debug('Got SDP!', jsep)
              let body = { request: 'start', room: props.room.id.value }
              remoteFeed.send({ message: body, jsep: jsep })
            },
            error: function (error: any) {
              Janus.error('WebRTC error:', error)
              // bootbox.alert("WebRTC error... " + error.message);
            },
          })
        }
      },
      onremotetrack: async function (track: any, mid: any) {
        if (track.kind === 'audio') {
          streamForPlay.value = new MediaStream([track])
          remoteFeed.remoteTracks[mid] = streamForPlay.value
        }
      },
    })
  }
  const escapeXmlTags = (value: any) => {
    if (value) {
      let escapedValue = value.replace(new RegExp('<', 'g'), '&lt')
      escapedValue = escapedValue.replace(new RegExp('>', 'g'), '&gt')
      return escapedValue
    }
  }
  const publishAudio = async (useAudio: boolean) => {
    if (useAudio && !localStream.value) {
      localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
      voiceChanger.value = createVoiceChanger(localStream.value)
    }
    let tracks = []
    if (useAudio) {
      tracks.push({ type: 'audio', capture: true, recv: false })
    }
    sfutest.createOffer({
      tracks: tracks,
      customizeSdp: function (jsep: any) {
        // If DTX is enabled, munge the SDP
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1')
        }
      },
      success: (jsep: any) => {
        let publish: any = { request: 'configure', audio: useAudio, video: false }
        if (acodec) {
          publish['audiocodec'] = acodec
        }
        if (vcodec) {
          publish['videocodec'] = vcodec
        }
        sfutest.send({ message: publish, jsep: jsep })
      },
    })
  }
  const unpublishAudio = () => {
    if (!sfutest) return

    const unpublish = { request: 'unpublish' }
    sfutest.send({ message: unpublish })

    if (localStream.value) {
      localStream.value.getAudioTracks().forEach(track => track.stop())
    }
  }
  const registerUsername = () => {
    let register = {
      request: 'join',
      room: props.room.id.value,
      id: myUserId.value,
      ptype: 'publisher',
      display: 用户${myUserId.value.slice(-1)},
    }
    sfutest.send({ message: register })
  }
  // 开麦
  const openMic = async () => {
    utils
      .chain()
      .fetch(service.room.openSpeak, params, '开麦成功')
      .next(() => toggleMicStream(true))
  }
  // 闭麦
  const closeMic = async () => {
    utils
      .chain()
      .fetch(service.room.closeSpeak, params, '闭麦成功')
      .next(() => toggleMicStream(false))
  }

  const changeVoice = (effect: string) => {
    if (!props.room.isOpenedMic.value || !voiceChanger.value) {
      showToast('变声需要先打开麦克风')
      return
    }
    if (!showAllType.value) {
      showAllType.value = true
    } else {
      showAllType.value = false
      currentType.value = effect
      voiceChanger.value.applyEffect(effect)
      const processedStream = voiceChanger.value.getProcessedStream()
      const audioTrack = processedStream.getAudioTracks()[0]
      const sender = sfutest.webrtcStuff.pc.getSenders().find((s: RTCRtpSender) => s.track?.kind === 'audio')

      if (sender) {
        sender.replaceTrack(audioTrack)
        console.log('Audio track replaced with processed stream.')
      } else {
        console.error('Audio sender not found.')
      }
    }
  }

  const joinCheck = () => {
    let result = true
    if (!props.room.info.value) {
      handleNoRoom()
      result = false
    } else if (props.room.isOwner.value) {
      initOwner()
    } else if (props.room.isUpSpeaker.value) {
      initUpSpeaker()
    } else {
      initNormalUser()
    }
    return result
  }

  const handleNoRoom = () => {
    showDialog({
      title: '提示',
      message: '语音直播已经结束，下次早点来哦',
      confirmButtonText: '首页',
      confirmButtonColor: '#07c160',
      showCancelButton: true,
      cancelButtonText: '返回',
    })
      .then(() => {
        utils.jumpTo('/')
      })
      .catch(() => {
        history.go(-1)
      })
  }

  const initOwner = () => {
    showDialog({
      title: '提示',
      message: '房主进入语音房请打开麦克风和声音',
      confirmButtonText: '确定',
      confirmButtonColor: '#07c160',
    }).then(() => {
      toggleMic(true)
      toggleVoice(true)
    })
  }

  const initUpSpeaker = () => {
    const message = props.room.isOpenedMic.value ? '麦克风异常关闭，请重新打开' : '已经连麦，是否马上开麦'
    showDialog({
      title: '提示',
      message,
      confirmButtonText: '确认',
      confirmButtonColor: '#07c160',
      showCancelButton: true,
      cancelButtonText: '取消',
    })
      .then(() => {
        if (props.room.isOpenedMic.value) {
          toggleMicStream(true)
        } else {
          toggleMic(true)
        }
        toggleVoice(true)
      })
      .catch(() => {
        if (props.room.isOpenedMic.value) {
          toggleMic(false)
        }
        toggleVoice(true)
      })
  }

  const initNormalUser = () => {
    showDialog({
      title: '提示',
      message: 欢迎加入语音房 “${props.room.info.value.title}”,
      confirmButtonText: '确定',
      confirmButtonColor: '#07c160',
    }).then(() => {
      toggleVoice(true)
    })
  }

  onMounted(async () => {
    if (joinCheck()) {
      await loadAdapter()
      createRoom()
    }
  })
  onBeforeUnmount(() => {
    props.room.uninstall('toggleMicStream')
    if (janus) {
      janus.destroy()
      closeMic()
    }
  })
</script>

<template>
  <div class="mic-wrapper">
    <audio autoplay ref="header1" playsinline></audio>
    <Button class="mic-button" size="small" @click="toggleMic" v-if="room.isUpSpeaker.value">
      <van-icon v-if="openedMic" :name="mic.src" size="28px" />
      <van-icon v-else :name="micBan.src" size="28px" />
    </Button>
    <van-icon
      class="mute-button"
      name="volume-o"
      size="24px"
      color="#fff"
      :class="{ muted: mutedVoice }"
      @click="toggleVoice"
    />
    <div class="change-voice-buttons" v-if="room.isUpSpeaker.value">
      <van-icon
        name="flower-o"
        size="20px"
        v-if="showAllType || currentType === 'normal'"
        :color="currentType === 'normal' ? '#FF8F28' : '#ccc'"
        @click="changeVoice('normal')"
      />
      <van-icon
        name="warning-o"
        size="20px"
        v-if="showAllType || currentType === 'highPitch'"
        :color="currentType === 'highPitch' ? '#FF8F28' : '#ccc'"
        @click="changeVoice('highPitch')"
      />
      <van-icon
        name="aim"
        size="20px"
        v-if="showAllType || currentType === 'lowPitch'"
        :color="currentType === 'lowPitch' ? '#FF8F28' : '#ccc'"
        @click="changeVoice('lowPitch')"
      />
      <van-icon
        name="hot-o"
        size="20px"
        v-if="showAllType || currentType === 'robot'"
        :color="currentType === 'robot' ? '#FF8F28' : '#ccc'"
        @click="changeVoice('robot')"
      />
      <van-icon
        name="music-o"
        size="20px"
        v-if="showAllType || currentType === 'echo'"
        :color="currentType === 'echo' ? '#FF8F28' : '#ccc'"
        @click="changeVoice('echo')"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
  .mic-wrapper {
    display: flex;
    gap: 8px;
    button {
      height: 24px;
      background-color: transparent;
    }
    .mute-button {
      opacity: 1;
      &.muted {
        opacity: 0.5;
      }
    }
    .mic-button {
      cursor: pointer;
      border: none;
      padding: 0;
    }
    .change-voice-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      right: 10px;
      bottom: 60px;
      gap: 8px;
    }
  }
</style>