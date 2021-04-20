import { isArray, isObject } from './typeUtils'
import { accMul } from './utils'

/* 缩放组件数据 */
export function zoomComponentData(cData, zoom) {
  const props = ['width', 'height', 'top', 'left']
  if (isArray(cData)) {
    cData.forEach(component => {
      props.forEach(key => {
        if (component.style[key] != undefined) {
          component.style[key] = accMul(component.style[key], zoom)
        }
      })
    })
    // return cData
  } else {
    throw 'typeError, 传入的第一个参数不为数组'
  }
}

/* 获取输入的组件数组 所在的最小矩阵 */
export function caclMinRange(cData) {
  const minRange = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    rotate: 0
  }
  const leftArr = [],
    rightArr = [],
    topArr = [],
    bottomArr = []
  if (isArray(cData)) {
    cData.forEach(component => {
      component.style.left !== undefined &&
        component.style.width !== undefined &&
        leftArr.push(component.style.left) &&
        rightArr.push(component.style.left + component.style.width)
      component.style.top !== undefined &&
        component.style.height !== undefined &&
        topArr.push(component.style.top) &&
        bottomArr.push(component.style.top + component.style.height)
    })
  }
  minRange.left = Math.min(...leftArr)
  minRange.top = Math.min(...topArr)
  minRange.width = Math.max(...rightArr) - minRange.left
  minRange.height = Math.max(...bottomArr) - minRange.top
  return minRange
}

/* 计算获取所有囊括传入坐标点的组件 */
export function getIncludeComponent(cData, points) {
  const result = []
  if (isArray(cData) && isObject(points)) {
    cData.forEach((component, zIndex) => {
      let count = 0
      points.x >= component.style.left &&
        points.x <= component.style.left + component.style.width &&
        count++
      points.y >= component.style.top &&
        points.y <= component.style.top + component.style.height &&
        count++

      count === 2 && result.push({ component, zIndex })
    })
  }
  return result.reverse()
}

/* 根据CTRL 的外框 位置信息 设置CTRL内的所有组件位置信息 */
// export function caclGroupComponentPosStyle(styleDiff, groupComponents) {
//   const startComponentStyle = []
//   groupComponents.forEach(component => {
//     startComponentStyle.push({
//       left:
//     })
//   })
// }

/* 全局设置当前组件的文职方法 */
export function moveCurComponentPos(
  globalSize,
  scaleRatio,
  curComponentSize,
  type
) {
  const { width, height } = globalSize
  const comp_width = curComponentSize.width
  const comp_height = curComponentSize.height
  const current_width = width * scaleRatio
  const current_height = height * scaleRatio
  const style = { left: curComponentSize.left, top: curComponentSize.top }
  switch (type) {
    case 'left':
      style.left = 0
      break
    case 'hCenter':
      /* 水平居中 */
      style.left = current_width / 2 - comp_width / 2
      break
    case 'right':
      style.left = current_width - comp_width
      break
    case 'top':
      style.top = 0
      break
    case 'vCenter':
      style.top = current_height / 2 - comp_height / 2
      break
    case 'bottom':
      style.top = current_height - comp_height
      break
    default:
      return
  }
  return style
}

/* 文字大小变化同步更新文字特效的值大小 */
/*
 ** 文字大小的改变会导致以下属性的宽度发生改变
 ** stroke(描边)
 */
export function syncUpdateTextComponentEffects(
  curComponent,
  newFontSize,
  oldFontSize
) {
  if (curComponent.style.textEffects.length === 0) return
  const textEffects = curComponent.style.textEffects
  textEffects.forEach(effect => {
    if (effect.stroke) {
      /* 描边处理 */
      effect['stroke'].width =
        (effect['stroke'].width / oldFontSize) * newFontSize
    }
  })
}
