/* 组件初始化数据 */
const list = {
  VText: {
    id: 'text_0',
    component: 'VText', // 组件名称，需要提前注册到 Vue
    type: 'text', // 左侧组件列表中显示的名字
    propValue: '双击输入文字', // 组件所使用的值
    icon: 'el-icon-edit', // 左侧组件列表中显示的名字
    style: {
      top: 0,
      left: 0,
      width: 450,
      height: 80,
      rotate: 0,
      scale: {
        scaleX: 1,
        scaleY: 1
      },
      fontSize: 71,
      fontWeight: 'bold',
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'center',
      color: 'rgb(255, 255, 255, 1)',
      fontStyle: 'normal',
      textDecoration: 'none',
      fontFamily: 'syht_bold',
      opacity: 1,
      textEffects: []
    }
  },
  VImage: {
    id: 0,
    component: 'VImage',
    type: 'image',
    propValue:
      'https://st-gdx.dancf.com/gaodingx/0/uxms/design/20201231-172648-cb49.png',
    style: {
      top: 17,
      left: 500,
      width: 339,
      height: 347.5,
      rotate: 0,
      opacity: 1,
      scale: {
        scaleX: 1,
        scaleY: 1
      }
    }
  }
}

export default list
