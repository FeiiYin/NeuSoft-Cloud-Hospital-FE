// import request from '@/utils/request'

const registrationList = [
  {
    registrationName: '处置1',
    registrationId: '1',
    category: 'DIV'
  },
  {
    registrationName: '处置2',
    registrationId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/registration/registrationListSearch',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: registrationList
      }
    }
  }
]

