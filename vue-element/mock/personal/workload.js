// import request from '@/utils/request'

const workloadList = [
  {
    workloadName: '处方1',
    workloadId: '1',
    category: 'DIV'
  },
  {
    workloadName: '处方2',
    workloadId: '2',
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
    url: '/workload/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: workloadList
      }
    }
  },

  // get user info
  {
    url: '/workload/update',
    type: 'get',
    response: config => {
      if (config.workload_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < workloadList.length; ++i) {
        if (workloadList[i].workloadId === config.workloadId) {
          workloadList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          workloadList
        }
      }
    }
  },

  // add
  {
    url: '/workload/add',
    type: 'post',
    response: config => {
      if (config.workload_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      workloadList.push(config)
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
    url: '/workload/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < workloadList.length; ++i) {
        if (workloadList[i].workloadId !== config.workloadId) {
          tempList.push(workloadList[i])
        }
      }
      if (workloadList.length === tempList.length) {
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
    url: '/workload/template',
    type: 'post',
    response: config => {
      workloadList.push(config)
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
    url: '/workload/selectTemplate',
    type: 'post',
    response: config => {
      workloadList.push(config)
      var tempList = []
      for (var i = 0; i < chargeEntryList.length; ++i) {
        if (chargeEntryList[i].workloadId === config.workloadId) {
          tempList.push(chargeEntryList[i])
        }
      }
      var workloadForm = {}
      for (i = 0; i < workloadList.length; ++i) {
        if (workloadList[i].workloadId === config.workloadId) {
          workloadForm = workloadList[i]
        }
      }
      return {
        code: 20000,
        data: {
          'workloadForm': workloadForm,
          'chargeEntryList': chargeEntryList
        }
      }
    }
  }
]

