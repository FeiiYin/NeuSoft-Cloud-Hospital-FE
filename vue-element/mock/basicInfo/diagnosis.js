// import request from '@/utils/request'

const diagnosisList = [
  {
    diagnosisName: '科室1',
    diagnosisId: '1',
    category: 'DIV'
  },
  {
    diagnosisName: '科室2',
    diagnosisId: '2',
    category: 'DIVA'
  }
]

export default [
  // user login
  {
    url: '/diagnosis/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: diagnosisList
      }
    }
  },

  // get user info
  {
    url: '/diagnosis/update',
    type: 'get',
    response: config => {
      if (config.diagnosis_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      for (var i = 0; i < diagnosisList.length; ++i) {
        if (diagnosisList[i].diagnosisId === config.diagnosisId) {
          diagnosisList[i] = config
        }
      }
      return {
        code: 20000,
        data: {
          diagnosisList
        }
      }
    }
  },

  // add
  {
    url: '/diagnosis/add',
    type: 'post',
    response: config => {
      if (config.diagnosis_id === 1) {
        return {
          code: 50008,
          message: 'failed, unable to get user details.'
        }
      }
      diagnosisList.push(config)
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
    url: '/diagnosis/delete',
    type: 'post',
    response: config => {
      var tempList = []
      for (var i = 0; i < diagnosisList.length; ++i) {
        if (diagnosisList[i].diagnosisId !== config.diagnosisId) {
          tempList.push(diagnosisList[i])
        }
      }
      if (diagnosisList.length === tempList.length) {
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
  }
]

