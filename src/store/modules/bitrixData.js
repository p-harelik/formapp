import Bitrix from '@/plugins/Bitrix'
import { getUsers } from '@/api/BitrixAPI'
import axios from 'axios'

export default {
  state: {
    AllAvailableProjects: {},
    deals: [],
    companies: [],
    bitrixUsers: []
  },
  getters: {
    getAllAvailableProjects(state) {
      return state.AllAvailableProjects
    },
    DEALS(state) {
      return state.deals
    },
    COMPANIES(state) {
      return state.companies
    },
    BITRIX_USERS(state) {
      return state.bitrixUsers
    }
  },
  mutations: {
    updateAllAvailableProjects(state, projects) {
      state.AllAvailableProjects = projects
    },
    SET_DEALS(state, deals) {
      state.deals = deals
    },
    SET_COMPANIES(state, companies) {
      state.companies = companies
    },
    SET_USERS(state, users) {
      state.bitrixUsers = users
    }
  },
  actions: {
    async getProjects({ commit }) {
      try {
        const request = {
          method: 'sonet_group.get',
          params: {
            ORDER: {
              NAME: 'ASC'
            },
            IS_ADMIN: 'Y'
          }
        }
        const projects = await Bitrix.getList(request)
        commit('updateAllAvailableProjects', projects)
      } catch (e) {
        console.log('Error: ', e)
      }
    },
    async GET_DEALS({ commit }) {
      try {
        const dealCategories = await Bitrix.callMethod('crm.dealcategory.list')

        const mapDealCategoriesName = new Map()

        dealCategories.forEach(el => {
          mapDealCategoriesName.set(el.ID, el.NAME)
        })
        const request = {
          method: 'crm.deal.list',
          params: {
            order: {
              NAME: 'ASC'
            },
            filter: {
              CLOSED: 'N'
            },
            select: [
              'ID',
              'TITLE',
              'CATEGORY_ID',
              'UF_CRM_1572425882839'
            ]
          }
        }
        let deals = await Bitrix.getList(request)

        deals = deals.map(deal => {
          return {
            id: deal.ID,
            title: deal.TITLE,
            categoryId: deal.CATEGORY_ID,
            buyerOrder: deal.UF_CRM_1572425882839,
            categoryName: mapDealCategoriesName.get(deal.CATEGORY_ID)
          }
        })
        commit('SET_DEALS', deals)
      } catch (e) {
      }
    },
    GET_COMPANIES({ commit }) {
      const MEMBER_ID = process.env.VUE_APP_MEMBER_ID
      const config = {
        params: {
          authData: {
            member_id: MEMBER_ID
          }
        }
      }
      axios.get('https://formapp.polyservice.ru/api/company', config)
        .then(res => {
          const companyItems = res.data.map((company) => {
            return {
              id: company.ID,
              title: company.TITLE,
              address: company.ADDRESS,
              logoURL: company.LOGO_URL ? `https://polyservice.bitrix24.ru${company.LOGO_URL}` : ''
            }
          })
          commit('SET_COMPANIES', companyItems)
        })
        .catch(err => console.log(err, 'companyItems'))
    },
    async GET_BITRIX_USERS({ commit }) {
      console.log('GET_Bitr')
      try {
        let users = await getUsers()
        users = users.map(user => {
          return {
            id: user.ID,
            fullName: `${user.LAST_NAME || ''} ${user.NAME || ''} ${user.SECOND_NAME || ''}`.trim(),
            phones: [user.PERSONAL_MOBILE]
          }
        })
        commit('SET_USERS', users)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
