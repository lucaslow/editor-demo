import { v4 as uuidv4 } from 'uuid'

/* 替换数组项 */
export function swap(arr, i, j) {
  const temp = arr[i]
  switch (j) {
    case arr.length - 1:
    case 0:
      arr.splice(i, 1)
      j === 0 && arr.unshift(temp)
      j !== 0 && arr.push(temp)
      break
    default:
      arr.splice(i, 1, arr[j])
      arr.splice(j, 1, temp)
      return
  }
}

/* 全选文字 */
export function selectNodeText(containerId) {
  let dom = document.getElementsByClassName(containerId)[0].children[0]
  if (document.selection) {
    const range = document.body.createTextRange()
    range.moveToElementText(dom)
    range.select()
  } else if (window.getSelection) {
    const range = document.createRange()
    range.selectNodeContents(dom)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
  }
  dom = null
}

/* 获取偏移角度 */
export function getAngle(pointA, pointB, pointC) {
  // pointA 中心点
  // pointB 起始点
  // pointC 终点
  // 使用余弦定理 计算角度
  const AB = {}
  const AC = {}
  AB.X = pointB.x - pointA.x
  AB.Y = pointB.y - pointA.y
  AC.X = pointC.x - pointA.x
  AC.Y = pointC.y - pointA.y // 分别求出AB,AC的向量坐标表示
  const direct = AB.X * AC.Y - AB.Y * AC.X // AB与AC叉乘求出逆时针还是顺时针旋转 当direct<0时，为逆时针旋转，当direct>0时为顺时针旋转。
  const lengthAB = Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    ),
    lengthAC = Math.sqrt(
      Math.pow(pointA.x - pointC.x, 2) + Math.pow(pointA.y - pointC.y, 2)
    ),
    lengthBC = Math.sqrt(
      Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2)
    )
  const cosA =
    (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) /
    (2 * lengthAB * lengthAC) //   余弦定理求出旋转角
  const angleA = Math.floor((Math.acos(cosA) * 180) / Math.PI)
  return direct > 0 ? (angleA === 0 ? 0 : angleA) : angleA === 0 ? 0 : -angleA
}

// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export function generateID() {
  return uuidv4()
}

let id = 0
export function generateIDNormal() {
  return id++
}

// 乘法 处理小数点问题
export function accMul(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    m = 0
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    m += 0
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

// 加法
export function accAdd(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }

  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

// 减法
export function Subtr(arg1, arg2) {
  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = r1 >= r2 ? r1 : r2
  return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n))
}

export function getElementByAttr(classNamge, dataAttr, reg) {
  var aElements = document.getElementsByClassName(classNamge)
  var aEle = []
  for (var i = 0; i < aElements.length; i++) {
    var ele = aElements[i].getAttribute(dataAttr)
    if (reg === ele) {
      aEle.push(aElements[i])
    }
  }
  return aEle[0]
}
