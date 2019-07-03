// import request from '@/utils/request'

const examineList = [
  {
    examineName: '检查1',
    examineId: '1',
    category: 'DIV'
  },
  {
    examineName: '检查2',
    examineId: '2',
    category: 'DIVA'
  }
]

const chargeEntryList = [
  {
    chargeEntryName: '检查1',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '检查2',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '检查3',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  }
]

export default [
  // user login
  {
    url: '/examine/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: examineList
      }
    }
  },

  // get user info
  {
    url: '/examine/update',
    type: 'get',
    response: config => {
      if (config.examine_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < examineList.length; ++i) {
        if (examineList[i].examineId === config.examineId) {
          examineList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          examineList
        }
      }
    }
  },

  // add
  {
    url: '/examine/add',
    type: 'post',
    response: config => {
      if (config.examine_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      examineList.push(config)
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
    url: '/examine/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < examineList.length; ++i) {
        if (examineList[i].examineId !== config.examineId) {
          tempList.push(examineList[i])
        }
      }
      if (examineList.length === tempList.length) {
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
    url: '/examine/template',
    type: 'post',
    response: config => {
      examineList.push(config)
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
    url: '/examine/selectTemplate',
    type: 'post',
    response: config => {
      examineList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].examineId === config.examineId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var examineForm = {}
      for (i = 0; i < examineList.length; ++i) {
        if (examineList[i].examineId === config.examineId) {
          examineForm = examineList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'examineForm': examineForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

