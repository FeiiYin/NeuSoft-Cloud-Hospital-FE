// import request from '@/utils/request'

const disposalList = [
  {
    disposalName: '处置1',
    disposalId: '1',
    category: 'DIV'
  },
  {
    disposalName: '处置2',
    disposalId: '2',
    category: 'DIVA'
  }
]

const chargeEntryList = [
  {
    chargeEntryName: '处置1',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '处置2',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  },
  {
    chargeEntryName: '处置3',
    chargeEntryId: '1',
    chargeEntryPrice: 100,
    chargeEntryNums: 20
  }
]

export default [
  // user login
  {
    url: '/disposal/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: disposalList
      }
    }
  },

  // get user info
  {
    url: '/disposal/update',
    type: 'get',
    response: config => {
      if (config.disposal_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < disposalList.length; ++i) {
        if (disposalList[i].disposalId === config.disposalId) {
          disposalList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          disposalList
        }
      }
    }
  },

  // add
  {
    url: '/disposal/add',
    type: 'post',
    response: config => {
      if (config.disposal_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      disposalList.push(config)
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
    url: '/disposal/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < disposalList.length; ++i) {
        if (disposalList[i].disposalId !== config.disposalId) {
          tempList.push(disposalList[i])
        }
      }
      if (disposalList.length === tempList.length) {
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
    url: '/disposal/template',
    type: 'post',
    response: config => {
      disposalList.push(config)
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
    url: '/disposal/selectTemplate',
    type: 'post',
    response: config => {
      disposalList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].disposalId === config.disposalId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var disposalForm = {}
      for (i = 0; i < disposalList.length; ++i) {
        if (disposalList[i].disposalId === config.disposalId) {
          disposalForm = disposalList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'disposalForm': disposalForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

