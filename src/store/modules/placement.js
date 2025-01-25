import Bitrix from '../../plugins/Bitrix'

export default {
  state: {
    user: {},
    deal: {},
    task: {
      id: ''
    },
    company: {},
    group: {}
  },
  getters: {
    getDeal (state) {
      return state.deal
    },
    getUser (state) {
      return state.user
    },
    getTask (state) {
      return state.task
    },
    getGroup (state) {
      return state.group
    }
  },
  mutations: {
    ADD_DEAL (state, deal) {
      state.deal = deal
    },
    UPDATE_USER (state, user) {
      state.user = user
    },
    ADD_TASK (state, task) {
      state.task = task
    },
    ADD_GROUP (state, group) {
      state.group = group
    }
  },
  actions: {
    async placementInfo ({ commit }) {
      try {
        const placementInfo = window.BX24.placement.info()
        console.log(placementInfo, 'Информация по месту встройки')
        switch (placementInfo.placement) {
          case 'CRM_DEAL_DETAIL_TOOLBAR': {
            const dealInfo = await Bitrix.callMethod('crm.deal.get', { id: placementInfo.options.ID })
            console.warn('deal', dealInfo)
            commit('ADD_DEAL', {
              id: dealInfo.ID,
              title: dealInfo.TITLE,
              buyerOrder: dealInfo.UF_CRM_1572425882839,
              parentDealId: dealInfo.UF_CRM_1584540234, // id связанной родительской сделки
              contactInfo: /** @type {string[]} */(dealInfo.UF_CRM_1574062883453), // контакты заказчика
              objectAddresses: dealInfo.UF_CRM_1574079925624 // адреса объектов проведения работ
            })
            break
          }
          case 'TASK_VIEW_TOP_PANEL': {
            commit('ADD_TASK', {
              id: placementInfo.options.TASK_ID
            })
            break
          }
          case 'SONET_GROUP_DETAIL_TAB': {
            // const iframeSizes = window.BX24.getScrollSize()
            // console.log(iframeSizes)
            // window.BX24.resizeWindow(iframeSizes.scrollWidth + 35, iframeSizes.scrollHeight + 500, function () {
            // })
            window.BX24.fitWindow(() => {
            })
            const groupInfo = await Bitrix.callMethod('sonet_group.get', { FILTER: { ID: placementInfo.options.GROUP_ID } })
            console.log(groupInfo, 'Информация по проекту')
            commit('ADD_GROUP', {
              id: groupInfo[0].ID,
              title: groupInfo[0].NAME
            })
            window.BX24.openApplication({
                opend: true,
                project: {
                  id: groupInfo[0].ID,
                  title: groupInfo[0].NAME
                },
                bx24_leftBoundary: 40
              },
              function () {
                console.log('Application closed!')
              })
            break
          }
          default: {
            if (placementInfo.options.project) {
                const projectInfo = placementInfo.options.project
              console.log(placementInfo.options.project, 'opt')
              commit('ADD_GROUP', {
                id: projectInfo.id,
                title: projectInfo.title
              })
            }
          }
        }
        const user = await Bitrix.callMethod('user.current')
        const auth = window.BX24.getAuth()
        commit('UPDATE_USER', {
          id: user.ID,
          email: user.EMAIL,
          name: user.NAME,
          lastName: user.LAST_NAME,
          secondName: user.SECOND_NAME,
          photo: user.PERSONAL_PHOTO,
          auth
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
