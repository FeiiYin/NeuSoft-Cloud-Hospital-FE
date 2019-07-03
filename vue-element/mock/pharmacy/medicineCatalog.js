// import request from '@/utils/request'

const medicineCatlogList = [
  {
    medicineCatlogName: '处方1',
    medicineCatlogId: '1',
    category: 'DIV'
  },
  {
    medicineCatlogName: '处方2',
    medicineCatlogId: '2',
    category: 'DIVA'
  }
]

const chargeEntryList = [
  {
    chargeEntryName: '处方1',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '处方2',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '处方3',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  }
]

export default [
  // user login
  {
    url: '/medicineCatlog/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: medicineCatlogList
      }
    }
  },

  // get user info
  {
    url: '/medicineCatlog/update',
    type: 'get',
    response: config => {
      if (config.medicineCatlog_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < medicineCatlogList.length; ++i) {
        if (medicineCatlogList[i].medicineCatlogId === config.medicineCatlogId) {
          medicineCatlogList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          medicineCatlogList
        }
      }
    }
  },

  // add
  {
    url: '/medicineCatlog/add',
    type: 'post',
    response: config => {
      if (config.medicineCatlog_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      medicineCatlogList.push(config)
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
    url: '/medicineCatlog/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < medicineCatlogList.length; ++i) {
        if (medicineCatlogList[i].medicineCatlogId !== config.medicineCatlogId) {
          tempList.push(medicineCatlogList[i])
        }
      }
      if (medicineCatlogList.length === tempList.length) {
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
    url: '/medicineCatlog/template',
    type: 'post',
    response: config => {
      medicineCatlogList.push(config)
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
    url: '/medicineCatlog/selectTemplate',
    type: 'post',
    response: config => {
      medicineCatlogList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].medicineCatlogId === config.medicineCatlogId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var medicineCatlogForm = {}
      for (i = 0; i < medicineCatlogList.length; ++i) {
        if (medicineCatlogList[i].medicineCatlogId === config.medicineCatlogId) {
          medicineCatlogForm = medicineCatlogList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'medicineCatlogForm': medicineCatlogForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

