<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {
  doctorWorkloadFinancialStatistics
} from '../../../api/personal/workload'

export default {
  data() {
    return {
      doctorId: 1,
      timeline: [
        {
          timestamp: '2019/4/20',
          title: '诊断病人',
          content: '门诊医生工作站 2019/4/20 20:46'
        },
        {
          timestamp: '2019/4/21',
          title: '诊断病人',
          content: '门诊医生工作站 2019/4/21 20:46'
        },
        {
          timestamp: '2019/4/22',
          title: '诊断病人',
          content: '门诊医生工作站 2019/4/22 20:46'
        },
        {
          timestamp: '2019/4/23',
          title: '诊断病人',
          content: '门诊医生工作站 2019/4/23 20:46'
        }
      ]
    }
  },
  methods: {
    invokeDoctorWorkloadFinancialStatistics() {
      var query = {
        'startDatetime': '2019-06-01 00:00:00',
        'endDatetime': '2019-07-20 00:00:00',
        'doctorId': this.doctorId
      }
      doctorWorkloadFinancialStatistics(query).then(response => {
        console.log('doctorWorkloadFinancialStatistics response')
        console.log(response)
        // var data = JSON.parse(response.data)
        // this.patientNums = data.patientNums
        // this.patientChargeInfo = data.patientChargeInfo
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
