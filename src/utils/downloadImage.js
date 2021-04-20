import domtoimage from './dom-to-image'
export function downloadImage(ele, style, scaleRatio, dpi) {
  return new Promise(resolve => {
    domtoimage
      .toJpeg(ele, {
        quality: 1.0,
        height: style.height * dpi,
        width: style.width * dpi,
        style: {
          transform: 'scale(' + scaleRatio * dpi + ')',
          transformOrigin: 'top left',
          width: ele.offsetWidth + 'px',
          height: ele.offsetHeight + 'px'
        }
      })
      .then(function(dataUrl) {
        resolve(dataUrl)
        // console.log(dataUrl)
        // const link = document.createElement('a')
        // link.download = `${1}.jpg`
        // link.href = dataUrl
        // link.click()
        // return converInitSize(dataUrl, style)
        // console.log(dataurl)
      })
    //   .then(res => {
    //     resolve(res)
    //   })
  })
}

// function converInitSize(dataUrl, style) {
//   return new Promise(resolve => {
//     const { width, height } = style
//     const image = new Image()
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')
//     canvas.width = width
//     canvas.height = height
//     image.onload = function() {
//       ctx.clearRect(0, 0, width, height)
//       ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
//       const fullQualityDataUrl = canvas.toDataURL('image/jpeg', 1.0)
//       resolve(fullQualityDataUrl)
//       //   resolve(fullQualityDataUrl)
//       // return fullQualityDataUrl
//     }
//     image.src = dataUrl
//   })
// }
