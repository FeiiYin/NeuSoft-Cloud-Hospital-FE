// import request from '@/utils/request'

const chargeEntryList = [
  {
    chargeEntryName: '处方1',
    chargeEntryId: '1',
    category: 'DIV'
  },
  {
    chargeEntryName: '处方2',
    chargeEntryId: '2',
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
    url: '/chargeEntry/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: chargeEntryList
      }
    }
  },

  // get user info
  {
    url: '/chargeEntry/update',
    type: 'get',
    response: config => {
      if (config.chargeEntry_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].chargeEntryId === config.chargeEntryId) {
          chargeEntryList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          chargeEntryList
        }
      }
    }
  },

  // add
  {
    url: '/chargeEntry/add',
    type: 'post',
    response: config => {
      if (config.chargeEntry_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      chargeEntryList.push(config)
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
    url: '/chargeEntry/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].chargeEntryId !== config.chargeEntryId) {
          tempList.push(chargeEntryList[i])
        }
      }
      if (chargeEntryList.length === tempList.length) {
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
    url: '/chargeEntry/template',
    type: 'post',
    response: config => {
      chargeEntryList.push(config)
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
    url: '/chargeEntry/selectTemplate',
    type: 'post',
    response: config => {
      chargeEntryList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].chargeEntryId === config.chargeEntryId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var chargeEntryForm = {}
      for (i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].chargeEntryId === config.chargeEntryId) {
          chargeEntryForm = chargeEntryList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'chargeEntryForm': chargeEntryForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

