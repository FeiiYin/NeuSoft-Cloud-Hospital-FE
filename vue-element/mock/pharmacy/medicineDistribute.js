// import request from '@/utils/request'

const medicineDistributeList = [
  {
    medicineDistributeName: '处方1',
    medicineDistributeId: '1',
    category: 'DIV'
  },
  {
    medicineDistributeName: '处方2',
    medicineDistributeId: '2',
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
    url: '/medicineDistribute/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: medicineDistributeList
      }
    }
  },

  // get user info
  {
    url: '/medicineDistribute/update',
    type: 'get',
    response: config => {
      if (config.medicineDistribute_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < medicineDistributeList.length; ++i) {
        if (medicineDistributeList[i].medicineDistributeId === config.medicineDistributeId) {
          medicineDistributeList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          medicineDistributeList
        }
      }
    }
  },

  // add
  {
    url: '/medicineDistribute/add',
    type: 'post',
    response: config => {
      if (config.medicineDistribute_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      medicineDistributeList.push(config)
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
    url: '/medicineDistribute/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < medicineDistributeList.length; ++i) {
        if (medicineDistributeList[i].medicineDistributeId !== config.medicineDistributeId) {
          tempList.push(medicineDistributeList[i])
        }
      }
      if (medicineDistributeList.length === tempList.length) {
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
    url: '/medicineDistribute/template',
    type: 'post',
    response: config => {
      medicineDistributeList.push(config)
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
    url: '/medicineDistribute/selectTemplate',
    type: 'post',
    response: config => {
      medicineDistributeList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].medicineDistributeId === config.medicineDistributeId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var medicineDistributeForm = {}
      for (i = 0; i < medicineDistributeList.length; ++i) {
        if (medicineDistributeList[i].medicineDistributeId === config.medicineDistributeId) {
          medicineDistributeForm = medicineDistributeList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'medicineDistributeForm': medicineDistributeForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

