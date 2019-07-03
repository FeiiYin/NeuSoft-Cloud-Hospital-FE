// import request from '@/utils/request'

const MedicalTechList = [
  {
    MedicalTechName: '处方1',
    MedicalTechId: '1',
    category: 'DIV'
  },
  {
    MedicalTechName: '处方2',
    MedicalTechId: '2',
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
    url: '/MedicalTech/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: MedicalTechList
      }
    }
  },

  // get user info
  {
    url: '/MedicalTech/update',
    type: 'get',
    response: config => {
      if (config.MedicalTech_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < MedicalTechList.length; ++i) {
        if (MedicalTechList[i].MedicalTechId === config.MedicalTechId) {
          MedicalTechList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          MedicalTechList
        }
      }
    }
  },

  // add
  {
    url: '/MedicalTech/add',
    type: 'post',
    response: config => {
      if (config.MedicalTech_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      MedicalTechList.push(config)
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
    url: '/MedicalTech/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < MedicalTechList.length; ++i) {
        if (MedicalTechList[i].MedicalTechId !== config.MedicalTechId) {
          tempList.push(MedicalTechList[i])
        }
      }
      if (MedicalTechList.length === tempList.length) {
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
    url: '/MedicalTech/template',
    type: 'post',
    response: config => {
      MedicalTechList.push(config)
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
    url: '/MedicalTech/selectTemplate',
    type: 'post',
    response: config => {
      MedicalTechList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].MedicalTechId === config.MedicalTechId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var MedicalTechForm = {}
      for (i = 0; i < MedicalTechList.length; ++i) {
        if (MedicalTechList[i].MedicalTechId === config.MedicalTechId) {
          MedicalTechForm = MedicalTechList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'MedicalTechForm': MedicalTechForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

