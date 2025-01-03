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
    path: '/projects',
    name: 'ProjectsFormList',
    component: () => import('../views/Projects/ProjectsFormList')
  },
  {
    path: '/projects/:formid',
    name: 'ProjectsFormItem',
    meta: {
      breadcrumb: [{ text: 'Реализация проектов', to: '/projects' }]
    },
    component: () => import('../views/Projects/ProjectsFormItem')
  },
  {
    path: '/planning-to-schedule',
    name: 'PlanningToSchedule',
    meta: {
      breadcrumb: [{ text: 'Реализация проектов', to: '/projects' }]
    },
    component: () => import('../views/Planning-to-schedule/PlanningToScheduleForm.vue')
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
