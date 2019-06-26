<template>
  <div class="app-container">
    <el-container>
      <transition name="el-zoom-in-left">
<!-- 左侧列表 -->
        <el-aside v-show="modelPanelShow" width="400px" style="padding:0">
          <aside>
            日结信息列表
          </aside>
          <!-- 单选表格 -->
          <el-table
            ref="historyDailyCheckTable"
            :data="historyDailyCheckTable"
            highlight-current-row
            style="width: 100%"
            @current-change="historyDailyCheckTableSelectChange"
            :default-sort = "{prop: 'date', order: 'descending'}"
          >
            <el-table-column type="index" />
            <el-table-column property="dailySettlementDate" label="日结日期" sortable />
            <el-table-column property="collectorRealName" label="收款员" />
          </el-table>
          <div class="block">
            <el-pagination
              :current-page="historyDailyCheckTableCurrentPage"
              :page-sizes="[20, 50, 100, 200]"
              :page-size="historyDailyCheckTablePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="historyDailyCheckTableTotalNumber"
              @size-change="historyHandleSizeChange"
              @current-change="historyHandleCurrentChange"
            />
          </div>
          <div style="margin-top:20px;margin-bottom:20px;float:right;padding:1%;">
            <el-button @click="true">
              <svg-icon icon-class="eye-open" />
              刷新
            </el-button>
          </div>
        </el-aside>
      </transition>

      <el-main>
        <aside>
          <el-button id="show_button" type="primary" @click="openModelPanel()">
            <i v-show="modelPanelShow" class="el-icon-caret-left" />
            <i v-show="!modelPanelShow" class="el-icon-caret-right" />
          </el-button>
          <span style="margin-left:30px;">门诊病历消息</span>
        </aside>

        <el-container>
          <el-header>
            <el-row :gutter="10">
              <el-col :sm="5" :md="3" :lg="3" :xl="1"><div style="padding:10px">
                <span>统计时间从</span>
              </div></el-col>
              <el-col :sm="5" :md="7" :lg="8" :xl="11"><div class="grid-content bg-purple-light">
                <el-date-picker
                  v-model="startDatetime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width:100%"
                  :disabled="true"
                />
              </div></el-col>
              <el-col :sm="5" :md="3" :lg="2" :xl="1"><div style="padding:10px;">
                <span>到</span>
              </div></el-col>
              <el-col :sm="5" :md="7" :lg="8" :xl="10"><div class="grid-content bg-purple">
                <el-date-picker
                  v-model="endDatetime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width:100%"
                  :picker-options="datePickerOptions"
                />
              </div></el-col>
              <el-col :sm="3" :md="4" :lg="3" :xl="1"><div>
                <el-button type="primary" style="float:right;" @click="invokeGenerateDailySettlement">
                  <svg-icon icon-class="component" />
                  日结
                </el-button>
              </div></el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table
              ref="exampleDailyCheckTable"
              v-loading="exampleDailyCheckTableLoading"
              :data="exampleDailyCheckTable"
              border
            >
              <el-table-column prop="date" label="单据号" />
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="name" label="病历号" />
              <el-table-column prop="name" label="结算类别" />
            </el-table>
            <div class="block">
              <el-pagination
                :current-page="exampleDailyCheckTableCurrentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="exampleDailyCheckTablePageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="exampleDailyCheckTableTotalNumber"
                @size-change="exampleHandleSizeChange"
                @current-change="exampleHandleCurrentChange"
              />
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  selectAllDailySettlementList,
  generateDailySettlement,
  selectDailySettlementDetail,
  dailySettlementDocument
} from '../../api/registrationCharge/dailySettlement'

export default {
  data() {
    return {
      // 前置
      collectorId: 1001,
      // 左侧面板显示标识
      modelPanelShow: false,
      // 左边表格内容，名称再改下吧
      historyDailyCheckTable: [{
        date: '2016-05-02',
        name: '王小虎'
      }, {
        date: '2016-05-04',
        name: '王小虎'
      }],
      historyDailyCheckTableCurrentPage: 1,
      historyDailyCheckTableTotalNumber: 0,
      historyDailyCheckTablePageSize: 50,
      currentRow: null,
      // 当前人员的起始日期与结束日期
      startDatetime: '',
      endDatetime: '',
      // 实例表
      exampleDailyCheckTable: [],
      exampleDailyCheckTableLoading: false,
      // 实例表分页
      exampleDailyCheckTableCurrentPage: 1,
      exampleDailyCheckTableTotalNumber: 0,
      exampleDailyCheckTablePageSize: 50,

      // 日期选择建议
      datePickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.invokeSelectHistory()
  },
  methods: {
    // 历史分页
    historyHandleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.historyDailyCheckTablePageSize = val
      this.invokeSelectHistory()
    },
    historyHandleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.historyDailyCheckTableCurrentPage = val
      this.invokeSelectHistory()
    },
    // selectAllDailySettlementList
    invokeSelectHistory() {
      // eslint-disable-next-line no-extend-native
      Date.prototype.Format = function(fmt) {
        const o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
        return fmt
      }
      var query = {
        'currentPage': this.historyDailyCheckTableCurrentPage,
        'pageSize': this.historyDailyCheckTablePageSize
      }
      selectAllDailySettlementList(query).then(response => {
        console.log('selectAllDailySettlementList response: ')
        console.log(response)
        this.historyDailyCheckTable = response.data.list
        this.historyDailyCheckTableTotalNumber = response.data.total
        for (var i = 0; i < this.historyDailyCheckTable.length; ++i) {
          this.historyDailyCheckTable[i].dailySettlementDate = new Date(this.historyDailyCheckTable[i].dailySettlementDate).Format('yyyy-MM-dd hh:mm:ss')
        }
      })
    },
    // 实例分页
    exampleHandleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.exampleDailyCheckTablePageSize = val
      this.invokeSelectDailySettlementDetail()
    },
    exampleHandleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.exampleDailyCheckTableCurrentPage = val
      this.invokeSelectDailySettlementDetail()
    },
    invokeSelectDailySettlementDetail(id) {
      this.exampleDailyCheckTableLoading = true
      var query = {
        'dailySettlementId': id,
        'currentPage': this.exampleDailyCheckTableCurrentPage,
        'pageSize': this.exampleDailyCheckTablePageSize
      }
      selectDailySettlementDetail(query).then(response => {
        console.log('selectDailySettlementDetail response: ')
        console.log(response)
        if (response.data == null) {
          this.exampleDailyCheckTable = []
          this.exampleDailyCheckTableLoading = false
          this.exampleDailyCheckTableTotalNumber = 0
        } else {
          this.exampleDailyCheckTable = response.data.list
          this.exampleDailyCheckTableLoading = false
          this.exampleDailyCheckTableTotalNumber = response.data.total
        }
      })
      dailySettlementDocument({ 'dailySettlementId': id }).then(response => {
        console.log('dailySettlementDocument response: ')
        console.log(response)
      })
    },
    // 新建日结记录
    invokeGenerateDailySettlement() {
      if (this.endDatetime === '' || this.endDatetime == null) {
        this.$message.error('未选择日结时间，错误！')
        return
      }
      // yyyy-MM-dd HH:mm:ss
      // eslint-disable-next-line no-extend-native
      Date.prototype.Format = function(fmt) {
        const o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
        return fmt
      }
      var query = {
        'collectorId': this.collectorId,
        'endDatetime': this.endDatetime.Format('yyyy-MM-dd hh:mm:ss')
      }
      console.log('generateDailySettlement query: ')
      console.log(query)
      generateDailySettlement(query).then(response => {
        console.log('generateDailySettlement response: ')
        console.log(response)
        this.$message({
          message: '生成日结记录完成!',
          type: 'success'
        })
        this.invokeSelectHistory()
      })
    },
    // 前置
    openModelPanel() {
      this.modelPanelShow = !this.modelPanelShow
    },
    historyDailyCheckTableSelectChange(val) {
      this.currentRow = val
      this.invokeSelectDailySettlementDetail(val.dailySettlementId)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
