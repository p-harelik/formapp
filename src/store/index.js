import Vue from 'vue'
import Vuex from 'vuex'
import placement from './modules/placement'
import purchases from './modules/purchases/purchase'
import registration from './modules/purchases/registration'
import sendDocs from './modules/logistics/sendDocs'
import deliveryEquipment from './modules/logistics/deliveryEquipment'
import workers from './modules/logistics/workers'
import bookkeeping from './modules/bookkeeping/bookkeeping'
import projects from './modules/projects/projects'
import planningInSchedule from './modules/planningInSchedule.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    placement,
    purchases,
    registration,
    sendDocs,
    deliveryEquipment,
    workers,
    bookkeeping,
    planningInSchedule,
    projects
  }
})
