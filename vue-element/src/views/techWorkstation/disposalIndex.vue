<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <aside>
          <span>患者处置结果登记</span>
        </aside>
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="2" style="padding:10px;">
                病历号
              </el-col>
              <el-col :span="18">
                <el-input
                  v-model="registrationId"
                  placeholder="请输入"
                  suffix-icon="el-icon-search"
                />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" style="float:right;" @click="invokeSelectHistoryDisposal">
                  <svg-icon icon-class="component" />
                  确认
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main style="margin-top:60px;">
            <el-table
              ref="historyDisposalTable"
              :data="historyDisposalTable"
              border
              @row-click="showHistoryDisposalItemExample"
            >
              <el-table-column type="index" />
              <el-table-column prop="chargeFormName" label="处置名称" />
            </el-table>
            <div style="margin-top:40px">
              <el-form ref="disposalForm" :model="disposalForm" label-width="100px">
                <el-form-item label="处置申请名称" prop="disposalName">
                  <el-input v-model="disposalForm.disposalName" prefix-icon="el-icon-document" :disabled="true" />
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-button @click="chooseBool === true ? chargeItemFormVisible = true : $message.error('未选中检验，错误！')">新增</el-button>
              <el-button @click="chooseBool === true ? commonDisposalDialogVisible = true : $message.error('未选中检验，错误！')">常用项目</el-button>
            </div>
            <el-table v-loading="chargeFormTableLoading" :data="historyDisposalItemExample" style="width: 100%">
              <el-table-column prop="chargeItem.nameZh" label="消费名称" />
              <el-table-column prop="chargeItem.specification" label="规格" />
              <el-table-column prop="chargeItem.price" label="单价" />
              <el-table-column prop="nums" label="数量" />
              <el-table-column prop="totalPrice" label="金额" sortable />
              <el-table-column
                prop="chargeItem.departmentName"
                label="执行科室"
                :filters="[{ text: '药房', value: '药房' }, { text: '项目', value: '项目' }]"
                :filter-method="filterDepartment"
                filter-placement="bottom-end"
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.chargeItem.departmentName === '药房' ? 'danger' : 'success'" close-transition>
                    {{ scope.row.chargeItem.departmentName }}
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
                  <el-tag :type="scope.row.payState === 0 ? 'primary' : (scope.row.payState === 1 ? 'success' : 'danger')" close-transition>
                    {{ scope.row.payState === 0 ? '未付款' : (scope.row.payState === 1 ? '已付款' : '已退款') }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="notGivenNums" label="未执行次数" />
              <el-table-column prop="excute" label="登记">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="excute(scope.$index, scope.row)"
                  >
                    登记
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
      title="登记"
      :visible.sync="excuteDialogVisible"
      width="30%"
    >
      <el-form ref="excuteForm" :model="excuteForm" label-width="100px">
        <el-form-item label="登记名称">
          <el-input v-model="excuteForm.excuteEntryName" :disabled="true" style="width:60%" />
        </el-form-item>
        <el-form-item label="登记数量">
          <el-input-number v-model="excuteForm.excuteNumber" width="100%" :min="0" :max="excuteForm.notGivenNums" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="excuteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeExcute">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增条目的对话框-->
    <el-dialog title="新增处置项目" :visible.sync="chargeItemFormVisible" width="30%">
      <el-form ref="chargeItemForm" :model="chargeItemForm" label-width="120px">
        <el-form-item label="科室名称" prop="departmentId">
          <el-select
            v-model="chargeItemForm.departmentId"
            filterable
            placeholder="请选择"
            width="100%"
            @change="forceChange"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处置项目名称" prop="chargeItemId">
          <el-select
            v-model="chargeItemForm.chargeItemId"
            filterable
            placeholder="请选择"
            :disabled="chargeItemFormDisable"
          >
            <el-option
              v-for="item in chargeItemList"
              :key="item.chargeItemId"
              :label="item.nameZh"
              :value="item.chargeItemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input-number v-model="chargeItemForm.nums" :min="1" label="数量" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeItemFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertChargeItemTable">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 常用项目 dialog -->
    <el-dialog title="常用处置项目" :visible.sync="commonDisposalDialogVisible">
      <div style="margin-left:13%">
        <!-- 选中 穿梭框 -->
        <el-transfer
          v-model="commonDisposalListValue"
          filterable
          :filter-method="transferFilterMethod"
          filter-placeholder="请输入"
          :data="commonDisposalListData"
          :titles="['常用项目列表', '选中列表']"
          style=""
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commonDisposalDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertCommonDisposal()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  chargeEntryListApply
} from '../../api/techWorkStation/medicalTech'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  selectDisposalItemListInChargeItemByDepartmentId,
  selectHistoryDisposal
} from '../../api/medicalRecord/disposal'

import {
  addChargeItemToForm
} from '../../api/registrationCharge/chargeEntry'

export default {
  data() {
    return {
      registrationId: '',
      // 歷史
      historyDisposalTable: [],
      disposalForm: {},
      historyDisposalItemExample: [],

      chargeFormTableList: [],
      chargeFormTableLoading: false,
      departmentList: [],
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
      // 退费
      excuteDialogVisible: false,
      excuteForm: {
        excuteNumber: 1,
        excuteEntryId: 0,
        excuteEntryName: '',
        prescriptionBool: 0,
        notGivenNums: 0
      },
      // 临时新增
      chooseBool: false,
      chooseDisposalId: 0,
      chargeItemList: [],
      chargeItemFormVisible: false,
      chargeItemFormDisable: true,
      chargeItemForm: {
        chargeItemId: '',
        departmentId: '',
        nums: 1
      },
      // 常用药对话框
      commonDisposalDialogVisible: false,
      commonDisposalListData: [],
      commonDisposalListValue: [],
      transferFilterMethod(query, item) {
        return item.nameZh.indexOf(query) > -1
      }
    }
  },
  created() {
    this.invokeFetchDepartmentList()
    this.invokeCommonDisposal()
  },
  methods: {
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    invokeSelectHistoryDisposal() {
      if (this.registrationId === '') {
        this.$message.error('未输入病历号，错误！')
        return
      }
      selectHistoryDisposal({ 'registrationId': this.registrationId }).then(response => {
        console.log('selectHistoryDisposal response')
        var tempList = JSON.parse(response.data)
        var i
        this.historyDisposalTable = []
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1) {
            this.historyDisposalTable.push(tempList[i])
          }
        }
        console.log(this.historyDisposalTable)
      }).catch(error => {
        console.log('selectHistoryDisposal error: ')
        console.log(error)
      })
    },
    showHistoryDisposalItemExample(row, event) {
      this.chooseBool = true
      this.chooseDisposalId = row.chargeFormId
      console.log(row)
      this.disposalForm = row
      this.disposalForm.disposalName = row.chargeFormName
      this.historyDisposalItemExample = row.chargeEntryList
      // console.log(this.historyDisposalItemExample)
      for (var i = 0; i < this.historyDisposalItemExample.length; ++i) {
        this.historyDisposalItemExample[i].chargeItem.departmentName = this.departmentList[this.historyDisposalItemExample[i].chargeItem.departmentId - 1].departmentName
      }
    },
    excute(index, row) {
      if (row.payState === 0) {
        this.$message.error('未付款，错误！')
        return
      }
      if (row.payState === 2) {
        this.$message.error('已退款，错误！')
        return
      }
      if (row.notGivenNums === 0) {
        this.$message.error('无可登记数量，错误！')
        return
      }
      console.log(row)
      this.excuteDialogVisible = true
      this.excuteForm = {
        'excuteNumber': row.notGivenNums,
        'excuteEntryId': row.chargeEntryId,
        'excuteEntryName': row.chargeItem.nameZh,
        'prescriptionBool': 0,
        'notGivenNums': row.notGivenNums
      }
    },
    invokeExcute() {
      if (this.excuteForm.excuteNumber === 0) {
        this.$message.error('登记数量为0，错误！')
        return
      }
      this.excuteDialogVisible = false
      var query = {
        'chargeEntryListJson': JSON.stringify([{
          'chargeEntryId': this.excuteForm.excuteEntryId,
          'executionNums': this.excuteForm.excuteNumber
        }])
      }
      chargeEntryListApply(query).then(response => {
        for (var i = 0; i < this.historyDisposalItemExample.length; ++i) {
          if (this.historyDisposalItemExample[i].chargeEntryId === this.excuteForm.excuteEntryId) {
            this.historyDisposalItemExample[i].notGivenNums -= this.excuteForm.excuteNumber
            break
          }
        }
        this.$message({
          message: '登记成功！',
          type: 'success'
        })
      })
    },
    // 临时增加 与 常用药
    forceChange() {
      this.chargeItemFormDisable = false
      this.invokeSelectDisposalItemListInChargeItemByDepartmentId()
    },
    invokeSelectDisposalItemListInChargeItemByDepartmentId() {
      var query = { 'departmentId': this.chargeItemForm.departmentId }
      selectDisposalItemListInChargeItemByDepartmentId(query).then(response => {
        console.log('selectDisposalItemListInChargeItemByDepartmentId response: ')
        console.log(response)
        // this.chargeItemList = []
        this.chargeItemList = response.data
      })
    },
    insertChargeItemTable() {
      if (this.chargeItemForm.chargeItemId === '' || this.chargeItemForm.departmentId === '') {
        this.$message.error('未输入全部信息，错误！')
        return
      }
      var id = this.chargeItemForm.chargeItemId
      for (var i = 0; i < this.chargeItemList.length; ++i) {
        if (this.chargeItemList[i].chargeItemId === id) {
          this.historyDisposalItemExample.push({
            'chargeEntryId': '????',
            'nums': this.chargeItemForm.nums,
            'totalPrice': this.chargeItemForm.nums * this.chargeItemList[i].price,
            'payState': 0,
            'notGivenNums': this.chargeItemForm.nums,
            'chargeItem': {
              'nameZh': this.chargeItemList[i].nameZh,
              'specification': this.chargeItemList[i].specification,
              'price': this.chargeItemList[i].price,
              'departmentName': this.departmentList[this.chargeItemForm.departmentId - 1].departmentName,
              'departmentId': this.chargeItemForm.departmentId
            }
          })
          break
        }
      }
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.chargeItemFormVisible = false
      this.chargeItemFormDisable = true
      var query = {
        'chargeItemId': this.chargeItemForm.chargeItemId,
        'registrationId': this.registrationId,
        'itemCount': this.chargeItemForm.nums,
        'collectorId': '-1',
        'doctorAdvice': '医嘱',
        'chargeFormId': this.chooseDisposalId
      }
      addChargeItemToForm(query).then(response => {
        this.chargeItemForm = {}
        this.$message({
          message: '插入数据成功！',
          type: 'success'
        })
      }).catch(error => {
        console.log('addChargeItemToForm error')
        console.log(error)
      })
    },
    // 常用处置
    invokeCommonDisposal() {
      this.commonDisposalListData.push({
        label: '大抢救',
        key: 1,
        chargeItemId: 1,
        nameZh: '大抢救',
        departmentId: 133,
        departmentName: '护理科',
        price: 200,
        specification: '日',
        nums: 1,
        doctorAdvice: '医嘱'
      })
      this.commonDisposalListData.push({
        label: '中抢救',
        key: 2,
        chargeItemId: 2,
        nameZh: '中抢救',
        departmentId: 133,
        departmentName: '护理科',
        price: 150,
        specification: '日',
        nums: 1,
        doctorAdvice: '医嘱'
      })
      // commonMedicine({'medicineNumber': 7}).then(response => {
    },
    insertCommonDisposal() {
      if (this.commonDisposalListValue.length === 0) {
        this.$message('未插入常用药')
        this.commonDisposalDialogVisible = false
        return
      }
      for (var i = 0; i < this.commonDisposalListValue.length; ++i) {
        var id = this.commonDisposalListValue[i]
        for (var j = 0; j < this.commonDisposalListData.length; ++j) {
          if (id === this.commonDisposalListData[j].chargeItemId) {
            this.historyDisposalItemExample.push({
              'chargeEntryId': '????',
              'nums': 1,
              'totalPrice': this.commonDisposalListData[j].price,
              'payState': 0,
              'notGivenNums': 1,
              'chargeItem': {
                'nameZh': this.commonDisposalListData[j].nameZh,
                'specification': this.commonDisposalListData[j].specification,
                'price': this.commonDisposalListData[j].price,
                'departmentName': this.departmentList[this.commonDisposalListData[j].departmentId - 1].departmentName,
                'departmentId': this.commonDisposalListData[j].departmentId
              }
            })
            var query = {
              'chargeItemId': this.commonDisposalListData[j].chargeItemId,
              'registrationId': this.registrationId,
              'itemCount': 1,
              'collectorId': '-1',
              'doctorAdvice': '医嘱',
              'chargeFormId': this.chooseDisposalId
            }
            addChargeItemToForm(query).then(response => {
              this.chargeItemForm = {}
              this.$message({
                message: '插入数据成功！',
                type: 'success'
              })
            }).catch(error => {
              console.log('addChargeItemToForm error')
              console.log(error)
            })
            break
          }
        }
      }
      this.commonDisposalListValue = []
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.commonDisposalDialogVisible = false
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.invokeSelectHistoryDisposal()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.invokeSelectHistoryDisposal()
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
