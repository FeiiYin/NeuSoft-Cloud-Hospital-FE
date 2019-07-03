// import request from '@/utils/request'

const patientList = [
  {
    patientName: '处置1',
    patientId: '1',
    category: 'DIV'
  },
  {
    patientName: '处置2',
    patientId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/patient/patientListSearch',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: patientList
      }
    }
  }
]

