// import request from '@/utils/request'

const prescriptionList = [
  {
    prescriptionName: '处方1',
    prescriptionId: '1',
    category: 'DIV'
  },
  {
    prescriptionName: '处方2',
    prescriptionId: '2',
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
    url: '/prescription/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: prescriptionList
      }
    }
  },

  // get user info
  {
    url: '/prescription/update',
    type: 'get',
    response: config => {
      if (config.prescription_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < prescriptionList.length; ++i) {
        if (prescriptionList[i].prescriptionId === config.prescriptionId) {
          prescriptionList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          prescriptionList
        }
      }
    }
  },

  // add
  {
    url: '/prescription/add',
    type: 'post',
    response: config => {
      if (config.prescription_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      prescriptionList.push(config)
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
    url: '/prescription/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < prescriptionList.length; ++i) {
        if (prescriptionList[i].prescriptionId !== config.prescriptionId) {
          tempList.push(prescriptionList[i])
        }
      }
      if (prescriptionList.length === tempList.length) {
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
    url: '/prescription/template',
    type: 'post',
    response: config => {
      prescriptionList.push(config)
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
    url: '/prescription/selectTemplate',
    type: 'post',
    response: config => {
      prescriptionList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].prescriptionId === config.prescriptionId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var prescriptionForm = {}
      for (i = 0; i < prescriptionList.length; ++i) {
        if (prescriptionList[i].prescriptionId === config.prescriptionId) {
          prescriptionForm = prescriptionList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'prescriptionForm': prescriptionForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

