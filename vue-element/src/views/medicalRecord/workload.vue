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
          <el-button type="primary" style="float:right;" @click="searchPatientWithInfo">
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

export default {
  components: {
    PieChart,
    BarChart
  },
  data() {
    return {
      startDate: null,
      endDate: null,
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
  methods: {
  }
}
</script>
