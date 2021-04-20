import Vue from 'vue'
import Vuex from 'vuex'
import canvasData from './canvas'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Canvas: canvasData
  }
})
