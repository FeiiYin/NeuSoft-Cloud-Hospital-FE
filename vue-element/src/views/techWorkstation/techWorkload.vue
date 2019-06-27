<template>
  <div class="app-container">
    <aside>
      工作量统计
    </aside>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="2.2" style="padding:10px;">
          统计时间从
        </el-col>
        <el-col :span="9" style="padding:5px;">
          <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="0.8" style="padding:10px;">
          <span>到</span>
        </el-col>
        <el-col :span="9" style="padding:5px;">
          <el-date-picker v-model="endDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="3" style="padding-left:30px;padding-top:5px;">
          <el-button type="primary" style="float:right;" @click="invokeDoctorWorkloadFinancialStatistics">
            <svg-icon icon-class="component" />
            确认
          </el-button>
        </el-col>
      </el-row>
      <el-table ref="workloadTable" :data="workloadTable">
        <el-table-column label="科室" />
        <el-table-column label="看诊人次" />
        <el-table-column label="发票数量" />
      </el-table>
    </div>
    <div>
      <count-to
        ref="nums"
        :start-val="_startVal"
        :end-val="_endVal"
        :duration="_duration"
        :decimals="_decimals"
        :separator="_separator"
        :prefix="_prefix"
        :suffix="_suffix"
        :autoplay="false"
        class="nums"
      />
    </div>
    <div style="text-align:center;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import PieChart from './components/workloadPiechart'
import BarChart from './components/workloadBarchart'

import {
  techDoctorWorkloadStatistics
} from '../../api/personal/workload'

import countTo from 'vue-count-to'

export default {
  components: {
    PieChart,
    BarChart,
    countTo
  },
  data() {
    return {
      // 计数器
      setStartVal: 0,
      setEndVal: 2017,
      setDuration: 4000,
      setDecimals: 0,
      setSeparator: ',',
      setSuffix: ' rmb',
      setPrefix: '¥ ',

      startDate: null,
      endDate: null,
      doctorId: 1,
      workloadTable: [],

      piechartSeriesData: [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ],
      piechartLegendData: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
    }
  },
  created() {
    var i = this.$store.getters.accountId
    alert('id ' + i)
  },
  computed: {
    _startVal() {
      if (this.setStartVal) {
        return this.setStartVal
      } else {
        return 0
      }
    },
    _endVal() {
      if (this.setEndVal) {
        return this.setEndVal
      } else {
        return 0
      }
    },
    _duration() {
      if (this.setDuration) {
        return this.setDuration
      } else {
        return 100
      }
    },
    _decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert('digits argument must be between 0 and 20')
          return 0
        }
        return this.setDecimals
      } else {
        return 0
      }
    },
    _separator() {
      return this.setSeparator
    },
    _suffix() {
      return this.setSuffix
    },
    _prefix() {
      return this.setPrefix
    }
  },
  methods: {
    invoketTechDoctorWorkloadStatistics() {
      if (this.startDate == null || this.endDate == null) {
        this.$message.error('未选择时间，错误!')
        return
      }
      if (this.startDate > this.endDate) {
        this.$message.error('时间大小，错误!')
        return
      }
      var query = {
        'startDatetime': this.startDate,
        'endDatetime': this.endDate,
        'doctorId': this.doctorId
      }
      // 医生录入统计时间起始时间和截止时间，点击“统计”按钮，统计出该时间段内本人登记的患者数量、以及每个患者的对应执行科室为本科室的费用情况。注意，只能查询本人进行检查的项目收费情况，同一个患者其他医生执行的项目收费情况，是查询不到的。
      techDoctorWorkloadStatistics(query).then(reponse => {
        console.log('doctorWorkloadFinancialStatistics response')
        console.log(reponse)

        this.$refs.nums.start()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
  .nums {
    font-size: 20px;
    color: #F6416C;
    display: block;
    margin: 10px 0;
    text-align: center;
    font-size: 80px;
    font-weight: 500;
  }
</style>
