<template>
  <div ref="barchart" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../dashboard/admin/components/mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      childList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  // watch: {
  //   list(val) { // message即为父组件的值，val参数为值
  //     this.childList = val // 将父组件的值赋给childrenMessage 子组件的值
  //   }
  // },
  methods: {
    // getData(list) {
    //   this.childList = list
    //   this.totalNumber = this.childList.length
    //   this.initChartWithPage()
    // },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`)
    //   this.pageSize = val
    //   this.initChartWithPage()
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`)
    //   this.currentPage = val
    //   this.initChartWithPage()
    // },
    initChart(list) {
      console.log('initChart: ')
      console.log(list)
      // this.$refs.barchart.clear()
      this.$refs.barchart.removeAttribute('_echarts_instance_')
      this.chart = echarts.init(this.$el, 'macarons')
      // var start = this.pageSize * (this.currentPage - 1)
      // var end = this.pageSize * this.currentPage
      // if (end > this.totalNumber) { end = this.totalNumber }

      var x_data = []
      var departmentExaminationFee = []
      var departmentDisposalFee = []
      var departmentPrescriptionFee = []
      // for (var i = 0; i < 10; ++i) {
      // for (var i = start; i < end; ++i) {
      for (var i = 0; i < list.length; ++i) {
        x_data.push(list[i].doctorName)
        // doctorName，visitNums，doctorExaminationFee，doctorDisposalFee，doctorPrescriptionFee，
        departmentExaminationFee.push(list[i].doctorExaminationFee)
        departmentDisposalFee.push(list[i].doctorDisposalFee)
        departmentPrescriptionFee.push(list[i].doctorPrescriptionFee)
        // doctorName，visitNums，doctorExaminationFee，doctorDisposalFee，doctorPrescriptionFee，
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // dataZoom: [{
        //   type: 'slider',
        //   show: true,
        //   xAxisIndex: [0],
        //   left: '9%',
        //   bottom: -5,
        //   start: 10,
        //   end: 90 // 初始化滚动条
        // }],
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: x_data,
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '检查费用',
          type: 'bar',
          stack: 'vistors',
          // barWidth: '20%',
          // barWidth: '60%',
          data: departmentExaminationFee,
          // data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '处置费用',
          type: 'bar',
          stack: 'vistors',
          // barWidth: '20%',
          // barWidth: '60%',
          // data: [80, 52, 200, 334, 390, 330, 220],
          data: departmentDisposalFee,
          animationDuration
        }, {
          name: '处方费用',
          type: 'bar',
          stack: 'vistors',
          // barWidth: '20%',
          // barWidth: '60%',
          // data: [30, 52, 200, 334, 390, 330, 220],
          data: departmentPrescriptionFee,
          animationDuration
        }]
      })
    }
  }
}
</script>
