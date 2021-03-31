import Bitrix from '@/plugins/Bitrix'

export default {
  state: {
    AllAvailableProjects: {}
  },
  getters: {
    getAllAvailableProjects (state) {
      return state.AllAvailableProjects
    }
  },
  mutations: {
    updateAllAvailableProjects (state, projects) {
      state.AllAvailableProjects = projects
    }
  },
  actions: {
    async getProjects ({ commit }) {
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
    }
  }
}
