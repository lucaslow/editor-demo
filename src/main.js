import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import {
  Button,
  Icon,
  message,
  Divider,
  Modal,
  Radio,
  Slider,
  Upload,
  InputNumber,
  Popconfirm,
  Select,
  Drawer,
  List
} from 'ant-design-vue'
import 'components/custom-component' // 注册自定义组件
// import './mock'

Vue.use(Button)
  .use(Icon)
  .use(Divider)
  .use(Modal)
  .use(Radio)
  .use(Slider)
  .use(Upload)
  .use(InputNumber)
  .use(Popconfirm)
  .use(Select)
  .use(Drawer)
  .use(List)

Vue.prototype.$message = message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
