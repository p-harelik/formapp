import Bitrix from '@/plugins/Bitrix'

export function getAllAvailableProjects () {
  const request = {
    method: 'sonet_group.get',
    params: {
      ORDER: {
        NAME: 'ASC'
      },
      IS_ADMIN: 'Y'
    }
  }
  Bitrix.getList(request).then()
}
