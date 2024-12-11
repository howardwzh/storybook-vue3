<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface Props {
    color: string
  }

  const props = withDefaults(defineProps<Props>(), {
    color: '#333333',
  })

  const content = defineModel<string>({ default: '' })
  const colorfullTextareaRef = ref<HTMLElement | null>(null)
  const tempStop = ref<Boolean>(false)
  const blankString = '\u200B'

  function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '')
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(char => char + char)
        .join('')
    }
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return `rgb(${r}, ${g}, ${b})`
  }

  function onInput(event: Event) {
    if (tempStop.value) return
    var selection = window.getSelection()
    if (!selection || !selection?.rangeCount) return
    removeExtraBlankString()

    var range = selection.getRangeAt(0).cloneRange()

    if (range.collapsed) {
      var node = range.startContainer
      var offset = range.startOffset

      if (
        ((node?.parentElement as HTMLElement).tagName.toLowerCase() !== 'span' ||
          (node?.parentElement as HTMLElement).style.color !== hexToRgb(props.color)) &&
        node.nodeType === Node.TEXT_NODE &&
        (event as InputEvent).data !== null
      ) {
        const eventText = (event as InputEvent).data ?? ''
        var newRange = document.createRange()
        newRange.setStart(node, offset - eventText.length)
        newRange.setEnd(node, offset)

        var span = document.createElement('span')
        span.style.color = props.color
        newRange.surroundContents(span)

        selection.removeAllRanges()
        range.setStartAfter(span)
        selection.addRange(range)
      }
    }

    colorfullTextareaRef.value?.childNodes.forEach(child => {
      if (
        (child.nodeType === Node.TEXT_NODE && child.textContent === '') ||
        (colorfullTextareaRef.value?.childNodes.length === 1 &&
          child.nodeType === Node.ELEMENT_NODE &&
          child.textContent === '')
      ) {
        colorfullTextareaRef.value?.removeChild(child)
      }
    })

    content.value = flattenStyledHtmlToHtmlString(colorfullTextareaRef.value?.innerHTML || '')
  }

  function removeExtraBlankString() {
    const selection = window.getSelection()
    if (!selection || !selection?.rangeCount) return
    const range = selection.getRangeAt(0)
    const startContainer = range.startContainer

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textBeforeCursor = startContainer.textContent
      if (textBeforeCursor && textBeforeCursor.startsWith(blankString)) {
        const newText = textBeforeCursor.slice(1)
        startContainer.textContent = newText
        range.setStart(startContainer, newText.length)
        range.setEnd(startContainer, newText.length)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  function onCompositionStart() {
    tempStop.value = true
  }
  function onCompositionEnd(event: Event) {
    tempStop.value = false
    onInput(event)
  }

  function flattenStyledHtmlToHtmlString(html: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    function mergeStyles(parentStyle: Record<string, string>, childStyle: CSSStyleDeclaration): Record<string, string> {
      const style: Record<string, string> = {}
      const properties = ['color']
      properties.forEach(prop => {
        const styleValue = childStyle[prop as any] || parentStyle[prop as any]
        if (styleValue) style[prop] = styleValue
      })

      return style
    }

    function styleToString(style: Record<string, string>): string {
      return Object.entries(style)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
    }
    function parseHTMLString(htmlString: string): HTMLElement[] {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')
      return Array.from(doc.body.children) as HTMLElement[]
    }

    function mergeStyledStrings(str1: string, str2: string): string {
      const nodes1 = parseHTMLString(str1)
      const nodes2 = parseHTMLString(str2)
      const lastSpan1 = nodes1[nodes1.length - 1] as HTMLElement
      const firstSpan2 = nodes2[0] as HTMLElement
      const lastStyle1 = lastSpan1?.getAttribute('style') || ''
      const firstStyle2 = firstSpan2?.getAttribute('style') || ''

      let result = ''

      if (lastStyle1 && lastStyle1 === firstStyle2) {
        lastSpan1.innerHTML += firstSpan2.innerHTML
        nodes2.shift()
      }

      nodes1.concat(nodes2).forEach(node => {
        result += node.outerHTML
      })

      return result
    }

    function traverse(node: Node, parentStyle: Record<string, string>): string {
      let result = ''

      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent?.trim()
        if (textContent && textContent !== blankString) {
          result += `<span style="${styleToString(parentStyle)}">${textContent}</span>`
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        if (/div|br/.test(element.tagName.toLowerCase())) {
          result += '<br>'
        }
        const mergedStyle = mergeStyles(parentStyle, element.style)
        for (let i = 0; i < node.childNodes.length; i++) {
          const currentHtml = traverse(node.childNodes[i], mergedStyle)
          result = mergeStyledStrings(result, currentHtml)
        }
      }

      return result
    }

    return traverse(doc.body, {})
      .replace(/(<br>)+$/, '')
      .replace(blankString, '')
  }

  function setSelectedTextStyle(color: string): void {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const cloneContents = range.cloneContents()
      const selectedContent = getStyledRangeContent(cloneContents)
      const span = document.createElement('span')
      span.style.color = color
      span.innerHTML = selectedContent ?? ''

      range.deleteContents()
      range.insertNode(span)

      content.value = flattenStyledHtmlToHtmlString(colorfullTextareaRef.value?.innerHTML || '')
    }
  }

  function getStyledRangeContent(extractContents: any): string {
    const tempContainer = document.createElement('div')
    tempContainer.appendChild(extractContents)
    let html = tempContainer.innerHTML
    html = html
      .replace(/<\/div>$/g, '')
      .replace(/<\/?div>/g, '<br>')
      .replace(/<\/?span[^>]*>/g, '')
    return html
  }

  function handleEnter(event: KeyboardEvent) {
    event.preventDefault()

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      const br = document.createElement('br')
      const blank = document.createTextNode(blankString)

      range.insertNode(blank)
      range.insertNode(br)
      range.setStartAfter(blank)
      range.setEndAfter(blank)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    content.value = flattenStyledHtmlToHtmlString(colorfullTextareaRef.value?.innerHTML || '')
  }
  function handleBackspace(event: KeyboardEvent) {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer
      const offset = range.startOffset
      if (startContainer.nodeType === Node.ELEMENT_NODE && offset > 0) {
        const element = startContainer as Element
        const prevNode = element.childNodes[offset - 1]
        const prevprevNode = prevNode.previousSibling
        if (prevNode.nodeType === Node.TEXT_NODE && prevNode.textContent === blankString) {
          removeExtraBlankString()
          if (prevprevNode) range.setStartAfter(prevprevNode)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } else if (startContainer.nodeType === Node.TEXT_NODE && startContainer.textContent === blankString) {
        removeExtraBlankString()
      }
    }
  }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleEnter(event)
    } else if (event.key === 'Backspace') {
      handleBackspace(event)
    }
  }

  watch(()=> props.color, (newColor) => {
    setSelectedTextStyle(newColor)
  })
</script>

<template>
  <div
    class="colorful-textarea"
    contenteditable="true"
    @input="onInput"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @keydown="handleKeydown"
    ref="colorfullTextareaRef"
  />
</template>

<style scoped>
  .colorful-textarea {
    min-height: 200px;
    color: black;
    padding: 1px;
  }

  [contenteditable='true']:focus {
    outline: none;
  }
</style>