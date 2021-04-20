import {
  calculateRotatedPointCoordinate,
  getCenterPoint,
  pointInRect
} from './translate'

const funcs = {
  lt: calculateLeftTop,
  t: calculateTop,
  rt: calculateRightTop,
  r: calculateRight,
  rb: calculateRightBottom,
  b: calculateBottom,
  lb: calculateLeftBottom,
  l: calculateLeft
}

const MINIMUM_SIZE = 4

function calculateLeftTop(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint } = pointInfo
  const { proportion, fontSize, letterSpacing } = originStyle
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopLeftPoint = calculateRotatedPointCoordinate(
    curPositon,
    newCenterPoint,
    -style.rotate
  )
  let newBottomRightPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (newWidth / newHeight > proportion) {
    newTopLeftPoint.x =
      newTopLeftPoint.x + Math.abs(newWidth - newHeight * proportion)
    newWidth = newHeight * proportion
  } else {
    newTopLeftPoint.y =
      newTopLeftPoint.y + Math.abs(newHeight - newWidth / proportion)
    newHeight = newWidth / proportion
  }

  const rotatedTopLeftPoint = calculateRotatedPointCoordinate(
    newTopLeftPoint,
    newCenterPoint,
    style.rotate
  )
  newCenterPoint = getCenterPoint(rotatedTopLeftPoint, symmetricPoint)
  newTopLeftPoint = calculateRotatedPointCoordinate(
    rotatedTopLeftPoint,
    newCenterPoint,
    -style.rotate
  )
  newBottomRightPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (newWidth > MINIMUM_SIZE && newHeight > MINIMUM_SIZE) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)

    // 如果是文字 则处理文字缩放
    if (fontSize !== undefined) {
      const activeLength = Math.sqrt(
        Math.pow(newWidth, 2) + Math.pow(newHeight, 2)
      )
      const originLength = Math.sqrt(
        Math.pow(originStyle.width, 2) + Math.pow(originStyle.height, 2)
      )
      const scale =
        activeLength / originLength < 0.1 ? 0.1 : activeLength / originLength
      style.fontSize = Math.floor(fontSize * scale)
      style.letterSpacing = Math.floor(letterSpacing * scale)
    }
  }
  // newWidth = null
  // newHeight = null
  // newTopLeftPoint = null
  // newBottomRightPoint = null
  // newCenterPoint = null
}

function calculateTop(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint, startPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(
    curPositon,
    startPoint,
    -style.rotate
  )
  const rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: startPoint.x,
      y: rotatedcurPositon.y
    },
    startPoint,
    style.rotate
  )

  // 勾股定理
  const newHeight = Math.sqrt(
    Math.pow(rotatedTopMiddlePoint.x - symmetricPoint.x, 2) +
      Math.pow(rotatedTopMiddlePoint.y - symmetricPoint.y, 2)
  )

  if (newHeight > MINIMUM_SIZE) {
    const newCenter = {
      x:
        rotatedTopMiddlePoint.x -
        (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
      y:
        rotatedTopMiddlePoint.y +
        (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2
    }

    // 解决新的 中心点反方向的问题
    if (!pointInRect(newCenter, startPoint, symmetricPoint)) {
      return
    }

    style.height = Math.round(newHeight)
    style.top = Math.round(newCenter.y - newHeight / 2)
    style.left = Math.round(newCenter.x - style.width / 2)
  }
}

function calculateRight(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint, startPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(
    curPositon,
    startPoint,
    -style.rotate
  )
  const rotatedRightMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: startPoint.y
    },
    startPoint,
    style.rotate
  )
  const newWidth = Math.sqrt(
    (rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 +
      (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2
  )
  if (newWidth > MINIMUM_SIZE) {
    const newCenter = {
      x:
        rotatedRightMiddlePoint.x -
        (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
      y:
        rotatedRightMiddlePoint.y +
        (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2
    }
    // 解决新的 中心点反方向的问题
    if (!pointInRect(newCenter, startPoint, symmetricPoint)) {
      return
    }

    // 解决文字缩小至最小宽度时出现移动
    if (
      originStyle.fontSize &&
      newWidth < (originStyle.fontSize + 2) * originStyle.scaleRatio
    ) {
      return
    }
    style.width = Math.round(newWidth)
    style.top = Math.round(newCenter.y - style.height / 2)
    style.left = Math.round(newCenter.x - newWidth / 2)
  }
}

function calculateBottom(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint, startPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(
    curPositon,
    startPoint,
    -style.rotate
  )
  const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: startPoint.x,
      y: rotatedcurPositon.y
    },
    startPoint,
    style.rotate
  )

  const newHeight = Math.sqrt(
    (rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 +
      (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2
  )
  if (newHeight > MINIMUM_SIZE) {
    const newCenter = {
      x:
        rotatedBottomMiddlePoint.x -
        (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
      y:
        rotatedBottomMiddlePoint.y +
        (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2
    }

    // 解决新的 中心点反方向的问题
    if (!pointInRect(newCenter, startPoint, symmetricPoint)) {
      return
    }

    style.height = Math.round(newHeight)
    style.top = Math.round(newCenter.y - newHeight / 2)
    style.left = Math.round(newCenter.x - style.width / 2)
  }
}

function calculateLeft(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint, startPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(
    curPositon,
    startPoint,
    -style.rotate
  )
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: startPoint.y
    },
    startPoint,
    style.rotate
  )

  const newWidth = Math.sqrt(
    (rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 +
      (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2
  )
  if (newWidth > MINIMUM_SIZE) {
    const newCenter = {
      x:
        rotatedLeftMiddlePoint.x -
        (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
      y:
        rotatedLeftMiddlePoint.y +
        (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2
    }

    // 解决新的 中心点反方向的问题
    if (!pointInRect(newCenter, startPoint, symmetricPoint)) {
      return
    }
    // 解决文字缩小至最小宽度时出现移动
    if (
      originStyle.fontSize &&
      newWidth < (originStyle.fontSize + 2) * originStyle.scaleRatio
    ) {
      return
    }

    style.width = Math.round(newWidth)
    style.top = Math.round(newCenter.y - style.height / 2)
    style.left = Math.round(newCenter.x - newWidth / 2)
  }
}

function calculateRightTop(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint } = pointInfo
  const { proportion, fontSize, letterSpacing } = originStyle
  // 拖拉角点的时候其对角点坐标不变，从而计算出实时的中心坐标点
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(
    curPositon,
    newCenterPoint,
    -style.rotate
  )
  let newBottomLeftPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (newWidth / newHeight > proportion) {
    newTopRightPoint.x =
      newTopRightPoint.x - Math.abs(newWidth - newHeight * proportion)
    newWidth = newHeight * proportion
  } else {
    newTopRightPoint.y =
      newTopRightPoint.y + Math.abs(newHeight - newWidth / proportion)
    newHeight = newWidth / proportion
  }
  // 计算旋转之后的右上角点的位置
  const rotatedTopRightPoint = calculateRotatedPointCoordinate(
    newTopRightPoint,
    newCenterPoint,
    style.rotate
  )
  newCenterPoint = getCenterPoint(rotatedTopRightPoint, symmetricPoint)
  newTopRightPoint = calculateRotatedPointCoordinate(
    rotatedTopRightPoint,
    newCenterPoint,
    -style.rotate
  )
  newBottomLeftPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (newWidth > MINIMUM_SIZE && newHeight > MINIMUM_SIZE) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)

    // 如果是文字 则处理文字缩放
    if (fontSize !== undefined) {
      const activeLength = Math.sqrt(
        Math.pow(newWidth, 2) + Math.pow(newHeight, 2)
      )
      const originLength = Math.sqrt(
        Math.pow(originStyle.width, 2) + Math.pow(originStyle.height, 2)
      )
      const scale =
        activeLength / originLength < 0.1 ? 0.1 : activeLength / originLength
      style.fontSize = Math.floor(fontSize * scale)
      style.letterSpacing = Math.floor(letterSpacing * scale)
    }
  }
  // newWidth = null
  // newHeight = null
  // newBottomLeftPoint = null
  // newTopRightPoint = null
  // newCenterPoint = null
}

function calculateRightBottom(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint } = pointInfo
  const { proportion, fontSize, letterSpacing } = originStyle
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newBottomRightPoint = calculateRotatedPointCoordinate(
    curPositon,
    newCenterPoint,
    -style.rotate
  )
  let newTopLeftPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (newWidth / newHeight > proportion) {
    newBottomRightPoint.x =
      newBottomRightPoint.x - Math.abs(newWidth - newHeight * proportion)
    newWidth = newHeight * proportion
  } else {
    newBottomRightPoint.y =
      newBottomRightPoint.y - Math.abs(newHeight - newWidth / proportion)
    newHeight = newWidth / proportion
  }
  // 计算旋转之后的右上角点的位置
  const rotatedBottomRightPoint = calculateRotatedPointCoordinate(
    newBottomRightPoint,
    newCenterPoint,
    style.rotate
  )
  newCenterPoint = getCenterPoint(rotatedBottomRightPoint, symmetricPoint)
  newBottomRightPoint = calculateRotatedPointCoordinate(
    rotatedBottomRightPoint,
    newCenterPoint,
    -style.rotate
  )
  newTopLeftPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (newWidth > MINIMUM_SIZE && newHeight > MINIMUM_SIZE) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)

    // 如果是文字 则处理文字缩放
    if (fontSize !== undefined) {
      const activeLength = Math.sqrt(
        Math.pow(newWidth, 2) + Math.pow(newHeight, 2)
      )
      const originLength = Math.sqrt(
        Math.pow(originStyle.width, 2) + Math.pow(originStyle.height, 2)
      )
      const scale =
        activeLength / originLength < 0.1 ? 0.1 : activeLength / originLength
      style.fontSize = Math.floor(fontSize * scale)
      style.letterSpacing = Math.floor(letterSpacing * scale)
    }
  }
}

function calculateLeftBottom(style, originStyle, curPositon, pointInfo) {
  const { symmetricPoint } = pointInfo
  const { proportion, fontSize, letterSpacing } = originStyle
  let newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )
  let newBottomLeftPoint = calculateRotatedPointCoordinate(
    curPositon,
    newCenterPoint,
    -style.rotate
  )

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (newWidth / newHeight > proportion) {
    newBottomLeftPoint.x =
      newBottomLeftPoint.x + Math.abs(newWidth - newHeight * proportion)
    newWidth = newHeight * proportion
  } else {
    newBottomLeftPoint.y =
      newBottomLeftPoint.y - Math.abs(newHeight - newWidth / proportion)
    newHeight = newWidth / proportion
  }

  const rotatedBottomLeftPoint = calculateRotatedPointCoordinate(
    newBottomLeftPoint,
    newCenterPoint,
    style.rotate
  )
  newCenterPoint = getCenterPoint(rotatedBottomLeftPoint, symmetricPoint)
  newBottomLeftPoint = calculateRotatedPointCoordinate(
    rotatedBottomLeftPoint,
    newCenterPoint,
    -style.rotate
  )
  newTopRightPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -style.rotate
  )

  newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (newWidth > MINIMUM_SIZE && newHeight > MINIMUM_SIZE) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)

    // 如果是文字 则处理文字缩放
    if (fontSize !== undefined) {
      const activeLength = Math.sqrt(
        Math.pow(newWidth, 2) + Math.pow(newHeight, 2)
      )
      const originLength = Math.sqrt(
        Math.pow(originStyle.width, 2) + Math.pow(originStyle.height, 2)
      )
      const scale =
        activeLength / originLength < 0.1 ? 0.1 : activeLength / originLength
      style.fontSize = Math.floor(fontSize * scale)
      style.letterSpacing = Math.floor(letterSpacing * scale)
    }
  }
  // newWidth = null
  // newHeight = null
  // newBottomLeftPoint = null
  // newTopRightPoint = null
  // newCenterPoint = null
}

export default function calculateComponentPositonAndSize(
  name,
  style,
  originStyle,
  curPositon,
  pointInfo
) {
  funcs[name](style, originStyle, curPositon, pointInfo)
}
