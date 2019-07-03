// import request from '@/utils/request'

const chargeList = [
  {
    chargeName: '处方1',
    chargeId: '1',
    category: 'DIV'
  },
  {
    chargeName: '处方2',
    chargeId: '2',
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
    url: '/charge/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: chargeList
      }
    }
  },

  // get user info
  {
    url: '/charge/update',
    type: 'get',
    response: config => {
      if (config.charge_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < chargeList.length; ++i) {
        if (chargeList[i].chargeId === config.chargeId) {
          chargeList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          chargeList
        }
      }
    }
  },

  // add
  {
    url: '/charge/add',
    type: 'post',
    response: config => {
      if (config.charge_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      chargeList.push(config)
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
    url: '/charge/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < chargeList.length; ++i) {
        if (chargeList[i].chargeId !== config.chargeId) {
          tempList.push(chargeList[i])
        }
      }
      if (chargeList.length === tempList.length) {
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
    url: '/charge/template',
    type: 'post',
    response: config => {
      chargeList.push(config)
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
    url: '/charge/selectTemplate',
    type: 'post',
    response: config => {
      chargeList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].chargeId === config.chargeId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var chargeForm = {}
      for (i = 0; i < chargeList.length; ++i) {
        if (chargeList[i].chargeId === config.chargeId) {
          chargeForm = chargeList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'chargeForm': chargeForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

