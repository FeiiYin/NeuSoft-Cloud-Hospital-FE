<template>
  <div class="app-container">
    <aside>
      工作量统计
    </aside>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="2.2" style="padding:10px;">
          统计时间
        </el-col>
        <el-col :span="16" style="padding:5px">
          <el-date-picker
            v-model="startDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:100%;"
          />
        </el-col>
        <el-col :span="4" style="padding-left:30px;padding-top:5px;">
          <el-button type="primary" style="float:right;" @click="invokeDoctorWorkloadFinancialStatistics">
            <svg-icon icon-class="component" />
            确认
          </el-button>
        </el-col>
      </el-row>
      <div style="margin:20px">
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
      <el-table ref="patientChargeInfo" :data="patientChargeInfo" show-summary>
        <el-table-column type="index" />
        <el-table-column label="患者姓名" prop="patientName" />
        <el-table-column label="检查费用" prop="patientExaminationFee" />
        <el-table-column label="处置费用" prop="patientDisposalFee" />
        <el-table-column label="处方费用" prop="patientPrescriptionFee" />
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  techDoctorWorkloadStatistics
} from '../../api/personal/workload'

import countTo from 'vue-count-to'

import moment from 'moment'

export default {
  components: {
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
      setSuffix: ' 位病人',
      setPrefix: '该段时间内，您一共诊断了 ',

      startDate: null,
      endDate: null,
      doctorId: 1,
      workloadTable: [],

      patientNums: 0,
      patientChargeInfo: [],

      piechartSeriesData: [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ],
      piechartLegendData: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
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
      if (this.patientNums) {
        return this.patientNums
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
  created() {
    // var i = this.$store.getters.accountId
    // alert('id ' + i)
  },
  methods: {
    // 日期选择
    // # 编写日期格式化方法
    dateFormat: function(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      // # 这里的格式根据需求修改
      return moment(date).format('YYYY-MM-DD')
    },
    invokeDoctorWorkloadFinancialStatistics() {
      if (this.startDate == null) {
        this.$message.error('未选择时间，错误!')
        return
      }
      // console.log(this.startDate)
      var query = {
        'startDatetime': moment(this.startDate[0]).format('YYYY-MM-DD HH:MM:SS'),
        'endDatetime': moment(this.startDate[1]).format('YYYY-MM-DD HH:MM:SS'),
        'doctorId': this.doctorId
      }
      console.log(query)
      techDoctorWorkloadStatistics(query).then(response => {
        console.log('doctorWorkloadFinancialStatistics response')
        console.log(response)
        var data = JSON.parse(response.data)
        this.patientNums = data.patientNums
        this.patientChargeInfo = data.patientChargeInfo
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
    color: rgba(71, 71, 71, 0.8);
    display: block;
    margin: 30px 0;
    text-align: center;
    font-weight: 500;
    font-family:"宋体"
  }
</style>
