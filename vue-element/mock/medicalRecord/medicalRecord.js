// import request from '@/utils/request'

const medicalRecordList = [
  {
    medicalRecordName: '病历1',
    medicalRecordId: '1',
    category: 'DIV'
  },
  {
    medicalRecordName: '病历2',
    medicalRecordId: '2',
    category: 'DIVA'
  }
]

const chargeEntryList = [
  {
    chargeEntryName: '病历1',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '病历2',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '病历3',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  }
]

export default [
  // user login
  {
    url: '/medicalRecord/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: medicalRecordList
      }
    }
  },

  // get user info
  {
    url: '/medicalRecord/update',
    type: 'get',
    response: config => {
      if (config.medicalRecord_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < medicalRecordList.length; ++i) {
        if (medicalRecordList[i].medicalRecordId === config.medicalRecordId) {
          medicalRecordList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          medicalRecordList
        }
      }
    }
  },

  // add
  {
    url: '/medicalRecord/add',
    type: 'post',
    response: config => {
      if (config.medicalRecord_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      medicalRecordList.push(config)
      return {
        code: 20000,
        data: {
          'bool': true
        }
      }
    }
  },

  // delete
  {
    url: '/medicalRecord/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < medicalRecordList.length; ++i) {
        if (medicalRecordList[i].medicalRecordId !== config.medicalRecordId) {
          tempList.push(medicalRecordList[i])
        }
      }
      if (medicalRecordList.length === tempList.length) {
        return {
          code: 50008,
          data: {
            'bool': false
          }
        }
      } else {
        return {
          code: 20000,
          data: {
            'bool': true
          }
        }
      }
    }
  },

  // delete
  {
    url: '/medicalRecord/template',
    type: 'post',
    response: config => {
      medicalRecordList.push(config)
      for (var i = 0; i < config.chargeEntryList.length; ++i) {
        chargeEntryList.push(config.chargeEntryList[i])
      }
      return {
        code: 20000,
        data: {
          'bool': true
        }
      }
    }
  },
  // delete
  {
    url: '/medicalRecord/selectTemplate',
    type: 'post',
    response: config => {
      medicalRecordList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].medicalRecordId === config.medicalRecordId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var medicalRecordForm = {}
      for (i = 0; i < medicalRecordList.length; ++i) {
        if (medicalRecordList[i].medicalRecordId === config.medicalRecordId) {
          medicalRecordForm = medicalRecordList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'medicalRecordForm': medicalRecordForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

