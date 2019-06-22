<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>患者费用查询</span>
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
              <el-button type="primary" style="float:right;" @click="invokeFetchChargeItemListWithRegistrationId">
                <svg-icon icon-class="component" />
                确认
              </el-button>
            </el-row>
          </el-header>
          <el-main style="margin-top:60px;">
            <el-table v-loading="chargeFormTableLoading" :data="chargeFormTableList" style="width: 100%">
              <el-table-column prop="nameZh" label="消费名称" />
              <el-table-column prop="specification" label="规格" />
              <el-table-column prop="price" label="单价" />
              <el-table-column prop="nums" label="数量" />
              <el-table-column prop="totalPrice" label="金额" sortable />
              <el-table-column
                prop="departmentName"
                label="执行科室"
                :filters="[{ text: '药房', value: '药房' }, { text: '项目', value: '项目' }]"
                :filter-method="filterDepartment"
                filter-placement="bottom-end"
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.departmentName === '药房' ? 'danger' : 'success'" close-transition>
                    {{ scope.row.departmentName }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="payState"
                label="支付状态"
                :filters="[{ text: '未付款', value: 0 }, { text: '已付款', value: 1 }, { text: '已退款', value: 2 }]"
                :filter-method="filterPayState"
                filter-placement="bottom-end"
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.payState === 0 ? 'primary' : (scope.row.payState === 0 ? 'success' : 'danger')" close-transition>
                    {{ scope.row.payState === 0 ? '未付款' : (scope.row.payState === 1 ? '已付款' : '已退款') }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="notGivenNums" label="未执行次数" />
              <el-table-column prop="refund" label="退费">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="refund(scope.$index, scope.row)"
                  >
                    退费
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <el-dialog
      title="退费"
      :visible.sync="refundDialogVisible"
      width="30%"
    >
      <el-form ref="refundForm" :model="refundForm" label-width="100px">
        <el-form-item label="退号名称">
          <el-input v-model="refundForm.refundEntryName" :disabled="true" style="width:60%" />
        </el-form-item>
        <el-form-item label="退号数量">
          <el-input-number v-model="refundForm.refundNumber" width="100%" :min="1" :max="refundForm.notGivenNums" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeRefund">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectChargeForm
} from '../../api/registrationCharge/chargeEntry'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  selectHistoryDisposal
} from '../../api/medicalRecord/disposal'

import {
  selectHistoryExam
} from '../../api/medicalRecord/examination'

import {
  selectHistoryPrescription
} from '../../api/medicalRecord/prescription'

import {
  refund
} from '../../api/registrationCharge/charge'

export default {
  data() {
    return {
      registrationId: '',
      chargeFormTableList: [],
      chargeFormTableListPage: [],
      chargeFormTableLoading: false,
      departmentList: [],
      // 当前人员的起始日期与结束日期
      startDate: '',
      endDate: '',
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
      // 退费
      refundDialogVisible: false,
      refundForm: {
        refundNumber: 1,
        refundEntryId: 0,
        refundEntryName: '',
        prescriptionBool: 0,
        notGivenNums: 0
      }
    }
  },
  created() {
    this.invokeFetchDepartmentList()
  },
  methods: {
    // 退费
    refund(index, row) {
      if (row.payState === 0) {
        this.$message.error('未付款，不能退费，错误！')
        return
      }
      if (row.notGivenNums === 0) {
        this.$message.error('无可退费数量，错误！')
        return
      }
      this.refundDialogVisible = true
      this.refundForm = {
        'refundNumber': row.notGivenNums,
        'refundEntryId': row.entryId,
        'refundEntryName': row.nameZh,
        'prescriptionBool': row.departmentName === '药房' ? 1 : 0,
        'notGivenNums': row.notGivenNums
      }
      // console.log('>>>>>>')
      // console.log(row)
      // console.log(index)
    },
    invokeRefund() {
      this.refundDialogVisible = false
      var query = {
        'refundJson': JSON.stringify([{
          'entryType': this.refundForm.prescriptionBool,
          'entryId': this.refundForm.refundEntryId,
          'refundNums': this.refundForm.refundNumber
        }])
      }
      refund(query).then(response => {
        this.$message({
          message: this.refundForm.refundEntryName + '退费成功!',
          type: 'success'
        })
      })
    },
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    invokeSelectHistoryDisposal() {
      selectHistoryDisposal({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryDisposal response')
        var tempList = JSON.parse(response.data)
        this.disposalMoney = 0
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].chargeEntryList.length; ++j) {
              this.chargeFormTableList.push({
                'nameZh': tempList[i].chargeEntryList[j].chargeItem.nameZh,
                'specification': tempList[i].chargeEntryList[j].chargeItem.specification,
                'price': tempList[i].chargeEntryList[j].chargeItem.price,
                'nums': tempList[i].chargeEntryList[j].nums,
                'totalPrice': tempList[i].chargeEntryList[j].chargeItem.price * tempList[i].chargeEntryList[j].nums,
                'departmentName': this.departmentList[tempList[i].chargeEntryList[j].chargeItem.departmentId - 1].departmentName,
                'payState': tempList[i].chargeEntryList[j].payState,
                'notGivenNums': tempList[i].chargeEntryList[j].notGivenNums,
                'entryId': tempList[i].chargeEntryList[j].chargeEntryId
              })
              this.disposalMoney += tempList[i].chargeEntryList[j].chargeItem.price * tempList[i].chargeEntryList[j].nums
            }
          }
        }
      }).catch(error => {
        console.log('selectHistoryDisposal error: ')
        console.log(error)
      })
    },
    invokeSelectHistoryExam() {
      selectHistoryExam({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryExam response')
        var tempList = JSON.parse(response.data)
        this.examineMoney = 0
        var i
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].chargeEntryList.length; ++j) {
              this.chargeFormTableList.push({
                'nameZh': tempList[i].chargeEntryList[j].chargeItem.nameZh,
                'specification': tempList[i].chargeEntryList[j].chargeItem.specification,
                'price': tempList[i].chargeEntryList[j].chargeItem.price,
                'nums': tempList[i].chargeEntryList[j].nums,
                'totalPrice': tempList[i].chargeEntryList[j].chargeItem.price * tempList[i].chargeEntryList[j].nums,
                'departmentName': this.departmentList[tempList[i].chargeEntryList[j].chargeItem.departmentId - 1].departmentName,
                'payState': tempList[i].chargeEntryList[j].payState,
                'notGivenNums': tempList[i].chargeEntryList[j].notGivenNums,
                'entryId': tempList[i].chargeEntryList[j].chargeEntryId
              })
              this.examineMoney += tempList[i].chargeEntryList[j].chargeItem.price * tempList[i].chargeEntryList[j].nums
            }
          }
        }
      }).catch(error => {
        console.log('selectHistoryExam error: ')
        console.log(error)
      })
    },
    invokeSelectHistoryPrescription() {
      selectHistoryPrescription({ 'registrationId': this.registrationId }).then(response => {
        var tempList = JSON.parse(response.data)
        // console.log('selectHistoryPrescription response: ')
        // console.log(tempList)
        var i
        this.prescriptionMoney = 0
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            for (var j = 0; j < tempList[i].prescriptionEntryList.length; ++j) {
              this.chargeFormTableList.push({
                'nameZh': tempList[i].prescriptionEntryList[j].medicine.nameZh,
                'specification': tempList[i].prescriptionEntryList[j].medicine.medicineSpecification,
                'price': tempList[i].prescriptionEntryList[j].medicine.medicinePrice,
                'nums': tempList[i].prescriptionEntryList[j].nums,
                'totalPrice': tempList[i].prescriptionEntryList[j].medicine.medicinePrice * tempList[i].prescriptionEntryList[j].nums,
                'departmentName': '药房',
                'payState': tempList[i].prescriptionEntryList[j].payState,
                'notGivenNums': tempList[i].prescriptionEntryList[j].notGivenNums,
                'entryId': tempList[i].prescriptionEntryList[j].prescriptionEntryId
              })
              this.prescriptionMoney += tempList[i].prescriptionEntryList[j].medicine.medicinePrice * tempList[i].prescriptionEntryList[j].nums
            }
          }
        }
      }).catch(error => {
        console.log('selectHistoryPrescription error: ')
        console.log(error)
      })
    },
    invokeFetchChargeItemListWithRegistrationId() {
      if (this.registrationId === '') {
        this.$message.error('未输入病历号，错误！')
        return
      }
      if (this.endDate < this.startDate) {
        this.$message.error('结束日期应当大于开始日期，错误！')
        return
      }
      this.chargeFormTableList = []
      this.invokeSelectHistoryDisposal()
      this.invokeSelectHistoryExam()
      this.invokeSelectHistoryPrescription()
    },
    // 根据 病历号 获取当前所有对应条目
    invokeFetchChargeItemListWithRegistrationId_canNotUse() {
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
        for (const k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
        return fmt
      }
      var query
      if (this.startDate === '' || this.endDate === '' ||
          this.startDate == null ||
          this.endDate == null) {
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
            if (this.departmentList[j].departmentId === this.chargeFormTableList[i].departmentId) {
              this.chargeFormTableList[i].departmentName = this.departmentList[j].departmentName
            }
          }
        }
        this.totalNumber = response.data.total
        this.chargeFormTableLoading = false
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.invokeFetchChargeItemListWithRegistrationId()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.invokeFetchChargeItemListWithRegistrationId()
    },
    filterTag(value, row) {
      return row.valid === value
    },
    filterPayState(value, row) {
      return row.payState === value
    },
    filterDepartment(value, row) {
      if (value === '药房') {
        return row.departmentName === '药房'
      } else {
        return row.departmentName !== '药房'
      }
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
