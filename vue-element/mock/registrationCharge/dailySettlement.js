// import request from '@/utils/request'

const dailySettlementList = [
  {
    dailySettlementName: '处方1',
    dailySettlementId: '1',
    category: 'DIV'
  },
  {
    dailySettlementName: '处方2',
    dailySettlementId: '2',
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
    url: '/dailySettlement/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: dailySettlementList
      }
    }
  },

  // get user info
  {
    url: '/dailySettlement/update',
    type: 'get',
    response: config => {
      if (config.dailySettlement_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < dailySettlementList.length; ++i) {
        if (dailySettlementList[i].dailySettlementId === config.dailySettlementId) {
          dailySettlementList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          dailySettlementList
        }
      }
    }
  },

  // add
  {
    url: '/dailySettlement/add',
    type: 'post',
    response: config => {
      if (config.dailySettlement_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      dailySettlementList.push(config)
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
    url: '/dailySettlement/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < dailySettlementList.length; ++i) {
        if (dailySettlementList[i].dailySettlementId !== config.dailySettlementId) {
          tempList.push(dailySettlementList[i])
        }
      }
      if (dailySettlementList.length === tempList.length) {
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
    url: '/dailySettlement/template',
    type: 'post',
    response: config => {
      dailySettlementList.push(config)
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
    url: '/dailySettlement/selectTemplate',
    type: 'post',
    response: config => {
      dailySettlementList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].dailySettlementId === config.dailySettlementId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var dailySettlementForm = {}
      for (i = 0; i < dailySettlementList.length; ++i) {
        if (dailySettlementList[i].dailySettlementId === config.dailySettlementId) {
          dailySettlementForm = dailySettlementList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'dailySettlementForm': dailySettlementForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

