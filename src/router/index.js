import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      breadcrumb: 'Главная'
    },
    component: Home
  },
  {
    path: '/purchasing-department',
    name: 'PurchasesFormsList',
    component: () => import('../views/Purchases-dept/PurchasesDepFormsList.vue')
  },
  {
    path: '/purchasing-department/:formid',
    name: 'PurchasesFormItem',
    meta: {
      breadcrumb: [{ text: 'Отдел закупок', to: '/purchasing-department' }]
    },
    component: () => import('../views/Purchases-dept/PurchasesDepFormItem.vue')
  },
  {
    path: '/logistics',
    name: 'LogisticsFormList',
    component: () => import('../views/Logistics-dept/LogisticsDepFormList.vue')
  },
  {
    path: '/logistics/:formid',
    name: 'LogisticsFormItem',
    meta: {
      breadcrumb: [{ text: 'Отдел логистики', to: '/logistics' }]
    },
    component: () => import('../views/Logistics-dept/LogisticsDepFormItem.vue')
  },
  {
    path: '/bookkeeping',
    name: 'BookkeepingFormList',
    component: () => import('../views/Bookkeeping-dept/BookkeepingDepFormList')
  },
  {
    path: '/bookkeeping/:formid',
    name: 'BookkeepingFormItem',
    meta: {
      breadcrumb: [{ text: 'Бухгалтерия', to: '/bookkeeping' }]
    },
    component: () => import('../views/Bookkeeping-dept/BookkeepingDepFormItem')
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('../views/Resources.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
