// export default function getAngle(APoint, BPoint, CPoint) {
//
//   const AB = {}
//   const AC = {}
//   AB.x = BPoint.x - APoint.x
//   AB.y = BPoint.y - APoint.y
//   AC.x = CPoint.x - APoint.x
//   AC.y = CPoint.y - APoint.y
//   // AB与AC叉乘求出逆时针还是顺时针旋转
//   const direct = AB.X * AC.Y - AB.Y * AC.X
//   const lenAB = Math.sqrt(
//     Math.pow(APoint.y - BPoint.y, 2) + Math.pow(APoint.y - BPoint.y, 2)
//   )
//   const lenAC = Math.sqrt(
//     Math.pow(APoint.y - CPoint.y, 2) + Math.pow(APoint.y - CPoint.y, 2)
//   )
//   const lenBC = Math.sqrt(
//     Math.pow(BPoint.y - CPoint.y, 2) + Math.pow(BPoint.y - CPoint.y, 2)
//   )
//   const cosA =
//     (Math.pow(lenAB, 2) + Math.pow(lenAC, 2) - Math.pow(lenBC, 2)) /
//     (2 * lenAB * lenAC)
//   console.log(Math.acos(cosA))
//   const angle = (Math.acos(cosA) * 180) / Math.PI
//   return direct > 0 ? angle : -angle
// }

/* 使用余弦定理计算不是很ok */
// export default function getAngle(pointA, pointB, pointC) {
//   // pointA 中心点
//   // pointB 起始点
//   // pointC 终点
//   // 使用余弦定理 计算角度
//   const AB = {}
//   const AC = {}
//   AB.X = pointB.x - pointA.x
//   AB.Y = pointB.y - pointA.y
//   AC.X = pointC.x - pointA.x
//   AC.Y = pointC.y - pointA.y // 分别求出AB,AC的向量坐标表示
//   const direct = AB.X * AC.Y - AB.Y * AC.X // AB与AC叉乘求出逆时针还是顺时针旋转 当direct<0时，为逆时针旋转，当direct>0时为顺时针旋转。
//   const lengthAB = Math.sqrt(
//       Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
//     ),
//     lengthAC = Math.sqrt(
//       Math.pow(pointA.x - pointC.x, 2) + Math.pow(pointA.y - pointC.y, 2)
//     ),
//     lengthBC = Math.sqrt(
//       Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2)
//     )
//   const cosA =
//     (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) /
//     (2 * lengthAB * lengthAC) //   余弦定理求出旋转角
//   const angleA = Math.floor((Math.acos(cosA) * 180) / Math.PI)
//   return direct > 0 ? (angleA === 0 ? 0 : angleA) : angleA === 0 ? 0 : -angleA
// }

/* 使用atan2 计算非常ok */
/* 
    逆时针为正
    startRotate： 初始角度
    centerPoint：中心点坐标
    startPoint：起始点击点坐标
    curPoint：当前点击点坐标
*/
export default function calculateComponentRotate(
  startRotate,
  centerPoint,
  startPoint,
  curPoint
) {
  let angle = 0
  // 获取当前旋转角
  let rotateDegreeBefore = Math.round(
    Math.atan2(startPoint[1] - centerPoint[1], startPoint[0] - centerPoint[0]) /
      (Math.PI / 180)
  )
  // 旋转后的角度
  let rotateDegreeAfter = Math.round(
    Math.atan2(curPoint[1] - centerPoint[1], curPoint[0] - centerPoint[0]) /
      (Math.PI / 180)
  )

  rotateDegreeBefore =
    rotateDegreeBefore <= -90 ? 360 + rotateDegreeBefore : rotateDegreeBefore
  rotateDegreeAfter =
    rotateDegreeAfter <= -90 ? 360 + rotateDegreeAfter : rotateDegreeAfter
  // 获取旋转的角度值
  angle = rotateDegreeAfter - rotateDegreeBefore + startRotate
  return angle
}
