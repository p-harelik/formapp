import Bitrix from '@/plugins/Bitrix'
import axios from 'axios'

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

export async function getContacts(id) {
  const memberId = process.env.VUE_APP_MEMBER_ID
  const contacts = await axios.get(`https://formapp.polyservice.ru/api/contact?company_id=${id}&member_id=${memberId}`)
  return contacts.data.result
}

export async function getUsers() {
  const users = await Bitrix.getList({
    method: 'user.get',
    params: {
      FILTER: {
        ACTIVE: true
      }
    }
  })
  return users
}
