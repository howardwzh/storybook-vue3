type VoiceEffect = 'normal' | 'highPitch' | 'lowPitch' | 'robot' | 'echo'

export default function createVoiceChanger(stream: MediaStream) {
  const audioContext = new AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  const destination = audioContext.createMediaStreamDestination()
  let effectNode: AudioNode | null = null

  // 初始化默认效果
  applyEffect('normal')

  // 应用不同的变声效果
  function applyEffect(effect: VoiceEffect): void {
    if (effectNode) {
      source.disconnect(effectNode)
      effectNode.disconnect(destination)
    }

    switch (effect) {
      case 'highPitch':
        effectNode = createHighPitchEffect()
        break
      case 'lowPitch':
        effectNode = createLowPitchEffect()
        break
      case 'robot':
        effectNode = createRobotEffect()
        break
      case 'echo':
        effectNode = createEchoEffect()
        break
      default: // "normal"
        effectNode = audioContext.createGain() // 默认不处理
        break
    }

    source.connect(effectNode)
    effectNode.connect(destination)
    console.log(Effect applied: ${effect})
  }

  // 获取处理后的音频流
  function getProcessedStream(): MediaStream {
    return destination.stream
  }

  // 各种效果的实现
  function createHighPitchEffect(): BiquadFilterNode {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = 2000 // 提高高频
    filter.gain.value = 10
    return filter
  }

  function createLowPitchEffect(): BiquadFilterNode {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'lowshelf'
    filter.frequency.value = 200 // 降低低频
    filter.gain.value = 15
    return filter
  }

  function createRobotEffect(): WaveShaperNode {
    const waveShaper = audioContext.createWaveShaper()
    waveShaper.curve = new Float32Array([0, 1, -1, 0, 1, -1]) // 简单失真曲线
    waveShaper.oversample = '4x'
    return waveShaper
  }

  function createEchoEffect(): DelayNode {
    const delay = audioContext.createDelay()
    delay.delayTime.value = 0.5 // 设置 500ms 延迟
    return delay
  }

  return {
    applyEffect,
    getProcessedStream,
  }
}