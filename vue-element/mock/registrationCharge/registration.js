// import request from '@/utils/request'

const registrationList = [
  {
    registrationName: '处方1',
    registrationId: '1',
    category: 'DIV'
  },
  {
    registrationName: '处方2',
    registrationId: '2',
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
    url: '/registration/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: registrationList
      }
    }
  },

  // get user info
  {
    url: '/registration/update',
    type: 'get',
    response: config => {
      if (config.registration_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < registrationList.length; ++i) {
        if (registrationList[i].registrationId === config.registrationId) {
          registrationList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          registrationList
        }
      }
    }
  },

  // add
  {
    url: '/registration/add',
    type: 'post',
    response: config => {
      if (config.registration_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      registrationList.push(config)
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
    url: '/registration/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < registrationList.length; ++i) {
        if (registrationList[i].registrationId !== config.registrationId) {
          tempList.push(registrationList[i])
        }
      }
      if (registrationList.length === tempList.length) {
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
    url: '/registration/template',
    type: 'post',
    response: config => {
      registrationList.push(config)
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
    url: '/registration/selectTemplate',
    type: 'post',
    response: config => {
      registrationList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].registrationId === config.registrationId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var registrationForm = {}
      for (i = 0; i < registrationList.length; ++i) {
        if (registrationList[i].registrationId === config.registrationId) {
          registrationForm = registrationList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'registrationForm': registrationForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

