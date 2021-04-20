function getLineCount(dom) {
  const fontSize = dom.style.fontSize.replace('px', '')
  const lineHeight = dom.style.lineHeight
  // const minCount = 2
  if (lineHeight > 2.5) {
    return Math.floor(
      (dom.offsetHeight + fontSize * lineHeight) / (fontSize * lineHeight)
    )
  }
  return Math.round(dom.offsetHeight / (fontSize * lineHeight))
}

export default function getTextHeight(dom, zoom) {
  // zoom 文字的缩放值
  const fontSize = dom.style.fontSize.replace('px', '')
  const lineHeight = dom.style.lineHeight
  const lines = getLineCount(dom)
  return fontSize * lines * lineHeight * zoom
}
