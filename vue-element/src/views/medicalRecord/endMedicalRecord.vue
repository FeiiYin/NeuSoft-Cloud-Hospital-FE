<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>发药患者列表查询</span>
        </aside>
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="2" style="padding:10px;">
                病历号
              </el-col>
              <el-col :span="22">
                <el-input
                  v-model="registrationId"
                  placeholder="请输入"
                  suffix-icon="el-icon-search"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2.2" style="padding:10px;">
                统计时间从
              </el-col>
              <el-col :span="9" style="padding:5px;">
                <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width: 100%;" />
              </el-col>
              <!-- <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;" ></el-time-picker>
            </el-col> -->
              <el-col :span="0.8" style="padding:10px;">
                <span>到</span>
              </el-col>
              <el-col :span="9" style="padding:5px;">
                <el-date-picker v-model="endDate" type="date" placeholder="选择日期" style="width: 100%;" />
              </el-col>
              <!-- <el-col :span="4.5" style="padding:5px;">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTime" style="width: 100%;"></el-time-picker>
            </el-col> -->
              <el-col :span="3" style="padding-left:30px;padding-top:5px;">
                <el-button type="primary" style="float:right;" @click="searchPatientWithInfo">
                  <svg-icon icon-class="component" />
                  确认
                </el-button>
              </el-col>
            </el-row>
          </el-header>

          <el-main style="margin-top:60px;">
            <el-table
              :data="patientList"
              border
              fit
              highlight-current-row
              style="width: 100%"
              :default-sort="{prop: 'registrationDate', order: 'descending'}"
              @row-dblclick="routerToDispensing"
            >
              <el-table-column
                v-loading="patientListLoading"
                sortable
                align="center"
                label="挂号ID"
                width="65"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.registrationId }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="挂号日期" sortable prop="registrationDate">
                <template slot-scope="scope">
                  <span>{{ scope.row.registrationDate }}</span>
                </template>
              </el-table-column>

              <el-table-column width="180px" align="center" label="姓名">
                <template slot-scope="scope">
                  <span>{{ scope.row.patientName }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="300px" label="身份证号">
                <template slot-scope="scope">
                  <span>{{ scope.row.identityCardNo }}</span>
                </template>
              </el-table-column>

              <el-table-column width="110px" align="center" label="性别">
                <template slot-scope="scope">
                  <span>{{ scope.row.gender }}</span>
                </template>
              </el-table-column>

              <el-table-column width="120px" label="挂号科室">
                <template slot-scope="scope">
                  <span>{{ scope.row.reserve1 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="挂号医生" width="95">
                <template slot-scope="scope">
                  <span>{{ scope.row.reserve2 }}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="诊断完毕" width="95">
                <template slot-scope="{ row }">
                  <!-- 这里后台 用的字符串 :( -->
                  <el-tag :type="row.registrationStatus === '0' ? 'success' : (row.registrationStatus === '2' ? 'danger' : 'primary')">
                    {{ row.registrationStatus === '0' ? '诊毕' : (row.registrationStatus === '2' ? '退号' : (row.registrationStatus === '1' ? '待诊' : '其他')) }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column class-name="status-col" label="状态" width="110">
                <template slot-scope="{ row }">
                  <el-tag :type="row.registrationCategoryId === 1 ? 'primary' : (row.registrationCategoryId === 2 ? 'danger' : 'success')">
                    {{ row.registrationCategoryId === 1 ? '普通号' : (row.registrationCategoryId === 2 ? '急诊号' : (row.registrationCategoryId === 3 ? '专家号' : '其他')) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="background: #d3dce6;">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNumber"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
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
  waitingRegistrationList
} from '../../api/medicalRecord/medicalRecord'

import {

} from '../../api/pharmacy/medicineDistribute'

import {
  selectChargeForm
} from '../../api/registrationCharge/chargeEntry'

export default {
  data() {
    return {
      // 基础信息
      doctorId: 1,
      registrationId: '',
      chargeFormTableList: [],
      chargeFormTableLoading: false,
      departmentList: [],
      // 当前人员的起始日期与结束日期
      totalPatientList: [],
      patientList: [],
      patientListLoading: false,

      startDate: '',
      endDate: '',
      // 分页
      currentPage: 1,
      pageSize: 20,
      totalNumber: 0
    }
  },
  created() {
    // this.getDepartmentList()
    this.invokeWaitingRegistrationList()
  },
  methods: {
    // 双击跳转
    routerToDispensing(row, event) {
      // console.log(row)
      this.$router.push({
        path: '/medicalRecord/patientDetail', // 这个path是在router/index.js里边配置的路径
        query: {
          registrationId: row.registrationId
        }
      })
    },
    // 表格 及 分页
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
      this.patientListLoading = true
      var start = this.pageSize * (this.currentPage - 1)
      var end = this.pageSize * this.currentPage
      if (end > this.totalNumber) { end = this.totalNumber }
      this.patientList = []
      for (var i = start; i < end; ++i) {
        this.patientList.push(this.totalPatientList[i])
      }
      this.patientListLoading = false
    },
    invokeWaitingRegistrationList() {
      var query = {
        'registrationScope': 0, // 患者搜索范围：所有患者 0，本医生患者 1，本科室患者 2
        'doctorId': this.doctorId
      }
      waitingRegistrationList(query).then(response => {
        this.totalPatientList = response.data
        for (var i = 0; i < this.totalPatientList.length; ++i) {
          this.totalPatientList[i].registrationDate = this.totalPatientList[i].registrationDate.substring(0, 10)
          this.totalPatientList[i].realDate = new Date(this.totalPatientList[i].registrationDate.replace(/-/g, '/')) // "2010/08/01";
        }
        this.totalNumber = this.totalPatientList.length
        console.log(this.totalPatientList)
        this.handleTableDataPageChange()
      }).catch(error => {
        console.log('waitingRegistrationList error: ')
        console.log(error)
      })
    },

    // 根据 病历号 获取当前所有对应条目
    invokeFetchChargeItemListWithRegistrationId() {
      if (this.registrationId === '') {
        this.$message.error('未输入病历号，错误！')
        return
      }
      if (this.endDate < this.startDate) {
        this.$message.error('结束日期应当大于开始日期，错误！')
        return
      }
      this.chargeFormTableLoading = true
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
      var query
      if (this.startDate === '' || this.endDate === '') {
        query = {
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'registrationId': this.registrationId,
          'chargeFormCategory': 2
        }
      } else {
        query = {
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'registrationId': this.registrationId,
          'startDate': this.startDate.Format('yyyy-MM-dd'),
          'endDate': this.endDate.Format('yyyy-MM-dd'),
          'chargeFormCategory': 2 // 全部支付
        }
      }
      selectChargeForm(query).then(response => {
        this.chargeFormTableList = response.data.list
        for (var i = 0; i < this.chargeFormTableList.length; ++i) {
          this.chargeFormTableList[i].totalMoney = this.chargeFormTableList[i].itemCount * this.chargeFormTableList[i].reserve2
          this.chargeFormTableList[i].chargeItemId = this.chargeFormTableList[i].reserve3
          if (this.chargeFormTableList[i].unchargedNums === 0) {
            this.chargeFormTableList[i].valid = '已缴费'
          } else {
            this.chargeFormTableList[i].valid = '未缴费'
          }
          for (var j = 0; j < this.departmentList.length; ++j) {
            if (this.departmentList[j].departmentId === this.chargeFormTableList[i].departmentId) { this.chargeFormTableList[i].departmentName = this.departmentList[j].departmentName }
          }
        }
        this.totalNumber = response.data.total
        this.chargeFormTableLoading = false
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    filterTag(value, row) {
      return row.valid === value
    },
    // 检索
    searchPatientWithInfo() {
      if ((this.registrationId === '' || this.registrationId == null) &&
          (this.startDate === '' || this.startDate == null) &&
          (this.endDate === '' || this.endDate == null)) {
        this.handleTableDataPageChange()
        return
      }
      var tempList = []
      var path = ''
      if (this.registrationId !== '') {
        path += 'a'
        tempList = this.totalPatientList.filter(item => {
          return item.registrationId.toString()
            .indexOf(this.registrationId.toString()) > -1
        })
      }
      if (path === '') {
        if (this.startDate !== '') {
          path += 'b'
          tempList = this.totalPatientList.filter(item => {
            return item.realDate >= this.startDate
          })
        }
      } else {
        if (this.startDate !== '') {
          path += 'b'
          tempList = tempList.filter(item => {
            return item.realDate >= this.startDate
          })
        }
      }
      if (path === '') {
        if (this.endDate !== '') {
          path += 'c'
          tempList = this.totalPatientList.filter(item => {
            return item.realDate <= this.endDate
          })
        }
      } else {
        if (this.endDate !== '') {
          path += 'c'
          tempList = tempList.filter(item => {
            return item.realDate <= this.endDate
          })
        }
      }
      this.patientList = tempList
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
