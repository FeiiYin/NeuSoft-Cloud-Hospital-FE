import request from '@/utils/request'

export function fetchDiseaseList(query) {
  return request({
    url: '/diagnostic_catalog/list_disease',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/NeuSoft_Cloud_Hospital_war/'
  })
}

export function fetchDiseaseCategory(query) {
  return request({
    url: '/diagnostic_catalog/list_disease_category',
    method: 'get',
    params: query,
    baseURL: 'http://localhost:8081/NeuSoft_Cloud_Hospital_war/'
  })
}
