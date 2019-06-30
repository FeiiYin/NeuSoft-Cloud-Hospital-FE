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
      <el-table ref="patientChargeInfo" v-loading="tableLoading" :summary-method="getSummaries" :data="patientChargeInfo" show-summary>
        <el-table-column type="index" />
        <el-table-column label="医生名称" prop="doctorName" />
        <el-table-column label="访问人次" prop="visitNums" />
        <el-table-column label="检查费用" prop="doctorExaminationFee" />
        <el-table-column label="处置费用" prop="doctorDisposalFee" />
        <el-table-column label="处方费用" prop="doctorPrescriptionFee" />
        <el-table-column label="发票数量" prop="doctorInvoiceNums" />
      </el-table>
      <div style="background: #d3dce6;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div>
        <div style="margin:40px">
          <barchart ref="barchart" :list="totalList" />
        </div>
        <div style="margin:40px">
          <piechart ref="piechart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  doctorWorkloadFinancialStatistics_menzhen
} from '../../api/personal/workload'

import moment from 'moment'
import barchart from './components/workloadBarchart2'
import piechart from './components/workloadPiechart2'

export default {
  components: {
    barchart,
    piechart
  },
  data() {
    return {
      startDate: null,
      doctorId: 1,
      workloadTable: [],

      totalList: [],
      sums: [],
      patientChargeInfo: [],
      tableLoading: false,
      // 分页
      currentPage: 1,
      pageSize: 5,
      totalNumber: 0,

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
  created() {
    // var i = this.$store.getters.accountId
    // alert('id ' + i)
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
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
        'endDatetime': moment(this.startDate[1]).format('YYYY-MM-DD HH:MM:SS')
      }
      this.tableLoading = true
      console.log(query)
      doctorWorkloadFinancialStatistics_menzhen(query).then(response => {
        console.log('doctorWorkloadFinancialStatistics_menzhen response')
        console.log(response)
        var data = JSON.parse(response.data)
        this.totalList = data
        this.totalNumber = this.totalList.length
        this.handleTableDataPageChange()
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleTableDataPageChange()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.handleTableDataPageChange()
    },
    handleTableDataPageChange() {
      this.tableLoading = true
      var start = this.pageSize * (this.currentPage - 1)
      var end = this.pageSize * this.currentPage
      if (end > this.totalNumber) { end = this.totalNumber }
      this.patientChargeInfo = []
      this.sums = []
      for (var i = 0; i < 5; ++i) {
        this.sums.push(0)
      }
      for (i = start; i < end; ++i) {
        this.patientChargeInfo.push(this.totalList[i])
        this.sums[2] += this.totalList[i].doctorExaminationFee
        this.sums[3] += this.totalList[i].doctorDisposalFee
        this.sums[4] += this.totalList[i].doctorPrescriptionFee
      }
      // doctorName，visitNums，doctorExaminationFee，doctorDisposalFee，doctorPrescriptionFee，
      this.tableLoading = false

      this.$refs.piechart.initChart(this.sums)
      this.$refs.barchart.initChart(this.patientChargeInfo)
    }
  }
}
// 【应用场景】：用于财务工作人员统计指定时间段的医生工作量，如图所示。
// 【操作描述】：操作员输入统计起始和终止时间，点击查询按钮，查询看诊人次、发票数量、各分项收入及总收入情况。通过点击导出按钮，对统计结果进行导出。
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
