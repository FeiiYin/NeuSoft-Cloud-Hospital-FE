<template>
  <div class="app-container">
    <aside>
      <span>当前挂号信息列表</span>
      <el-button type="info" style="float:right" @click="invokeFetchRegistrationRecord()">
        <i class="el-icon-refresh" />
        获取
      </el-button>
    </aside>

    <div style="padding:1% 1% 0 1%" class="bg-purple-light">
      <el-form ref="registrationForm" :model="registrationForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="病历号">
              <el-input v-model="registrationForm.registrationId" clearable />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="registrationForm.identityCardNo" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="姓名">
              <el-input v-model="registrationForm.patientName" :disabled="true" />
            </el-form-item>
            <el-form-item label="挂号类别">
              <el-input v-model="registrationForm.registrationCategory" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="性别">
              <el-input v-model="registrationForm.gender" :disabled="true" />
            </el-form-item>
            <el-form-item label="医疗科室">
              <el-input v-model="registrationForm.departmentId" :disabled="true" />
            </el-form-item>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-form-item label="年龄">
              <el-input v-model="registrationForm.age" :disabled="true" />
            </el-form-item>
            <el-form-item label="开单医生">
              <el-input v-model="registrationForm.doctorId" :disabled="true" />
            </el-form-item>
          </div></el-col>
        </el-row>
      </el-form>
    </div>
    <aside style="height:50px;" />
    <el-table
      ref="chargeFormTableList"
      v-loading="chargeFormTableLoading"
      :data="chargeFormTableList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="nameZh" label="名称" sortable />
      <el-table-column prop="specification" label="规格" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="nums" label="数量" />
      <el-table-column prop="totalPrice" label="总金额" />
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
      <el-table-column
        prop="notGivenNums"
        label="未发数量"
        :filters="[{ text: '可发放', value: 1 }, { text: '不可发放', value: 0 }]"
        :filter-method="filterNotGivenNums"
        filter-placement="bottom-end"
      />
      <el-table-column prop="excute" label="退药">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="openRefundDialog(scope.$index, scope.row)"
          >
            退药
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <aside style="height:60px;">
      <el-button type="info" style="float:right;margin-right:20px" @click="invokeDispensing">
        全退
      </el-button>
    </aside>
    <!--  退费对话框  -->
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
        <el-button type="primary" @click="invokeSingleRefund">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectRegistrationByPrimaryKey
} from '../../api/registrationCharge/registration'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  selectHistoryPrescription
} from '../../api/medicalRecord/prescription'

import {
  selectChargeItemByDepartmentId
} from '../../api/registrationCharge/chargeEntry'

import {
  prescriptionEntryDelivery
} from '../../api/pharmacy/medicineDistribute'

export default {
  data() {
    return {
      registrationId: 1,
      // 提交病历号，查询其他字段
      registrationForm: {
        registrationId: '',
        patientName: '',
        patientId: '',
        gender: '',
        age: '',
        birthday: '',
        registrationCategory: '',
        medicalCategory: '',
        identityCardNo: '',
        registrationStatus: '',
        visitDate: '',
        registrationDate: '',
        departmentId: '',
        doctorId: '',
        registrationSource: '',
        settleAccountsCategory: '',
        isVisited: '',
        valid: '',
        familyAddress: '',
        collectorId: 1001,
        totalCharge: ''
      },
      // 病历号查询消费项目列表
      chargeForm: {
        chargeFormId: '',
        registrationId: '',
        chargeItemId: '',
        itemCount: '',
        unchargedNums: '',
        madeTime: '',
        valid: '',
        departmentId: '',
        doctorId: '',
        collectorId: '',
        notGivenNums: ''
      },
      chargeFormTableList: [],
      multipleSelectionChargeFormTable: [],
      chargeFormTableLoading: false,
      // 总共金额
      // 充值金额
      charge_form: {
        should_charge: 0,
        actual_charge: 0,
        actual_exchange: 0
      },
      // 选择支付方式
      options: [{
        value: '选项1',
        label: '支付宝'
      }, {
        value: '选项2',
        label: '微信'
      }, {
        value: '选项3',
        label: '银行卡'
      }, {
        value: '选项4',
        label: '现金'
      }, {
        value: '选项5',
        label: '医保'
      }],
      value: '',
      // 弹出框
      dialogFormVisible: false,
      addChargeFormVisible: false,
      // 临时表数据
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        tag: '家'
      }],
      // 新增条目
      addChargeForm: {
        departmentId: '',
        name: '',
        number: ''
      },
      addChargeFormDisableBool: true,
      collectorId: 1001,
      // 选择器科室常量
      departmentList: [],
      chargeItemList: [],
      // 规范
      // 提交验证
      rules: {
        departmentId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
      // 表
      prescriptionTableData: [],
      // 退号对话框
      refundDialogVisible: false,
      refundForm: {}
    }
  },
  computed: {
  },
  watch: {
    'charge_form.actual_charge': function() {
      if (this.charge_form.actual_charge > this.charge_form.should_charge) {
        this.charge_form.actual_exchange = this.charge_form.actual_charge - this.charge_form.should_charge
      } else {
        this.charge_form.actual_exchange = 0
      }
    }
  },
  created() {
    this.registrationId = this.$route.query.registrationId
    this.registrationForm.registrationId = this.registrationId
    this.invokeFetchDepartmentList()
    // this.invokeSelectHistoryPrescription()
    this.invokeFetchRegistrationRecord()
  },
  methods: {
    // 预处理
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    filterPayState(value, row) {
      return row.payState === value
    },
    filterNotGivenNums(value, row) {
      if (value === 0) {
        // 不可发放
        return row.notGivenNums === 0 || row.payState !== 1
      } else if (value === 1) {
        // 可发放
        return row.notGivenNums > 0 && row.payState === 1
      }
    },
    invokeSelectHistoryPrescription() {
      selectHistoryPrescription({ 'registrationId': this.registrationId }).then(response => {
        var tempList = JSON.parse(response.data)
        console.log('selectHistoryPrescription response: ')
        console.log(tempList)
        var i
        this.chargeFormTableList = []
        for (i = 0; i < tempList.length; ++i) {
          if (tempList[i].saveState === 1 && tempList[i].registrationId === this.registrationId) {
            for (var j = 0; j < tempList[i].prescriptionEntryList.length; ++j) {
              this.chargeFormTableList.push({
                'nameZh': tempList[i].prescriptionEntryList[j].medicine.nameZh,
                'specification': tempList[i].prescriptionEntryList[j].medicine.medicineSpecification,
                'price': tempList[i].prescriptionEntryList[j].medicine.medicinePrice,
                'nums': tempList[i].prescriptionEntryList[j].nums,
                'totalPrice': tempList[i].prescriptionEntryList[j].medicine.medicinePrice * tempList[i].prescriptionEntryList[j].nums,
                'departmentName': '药房',
                'entryId': tempList[i].prescriptionEntryList[j].prescriptionEntryId,
                'notGivenNums': tempList[i].prescriptionEntryList[j].notGivenNums,
                'payState': tempList[i].prescriptionEntryList[j].payState
              })
            }
          }
        }
      }).catch(error => {
        console.log('selectHistoryPrescription error: ')
        console.log(error)
      })
    },
    // 打开退费面板
    openRefundDialog(index, row) {
      if (row.payState === 2) {
        this.$message.error('已退款，不能退药，错误！')
        return
      }
      if (row.payState === 0) {
        this.$message.error('未付款，不能退费，错误！')
        return
      }
      if (row.notGivenNums === row.nums) {
        this.$message.error('无可退费数量，错误！')
        return
      }
      this.refundDialogVisible = true
      console.log(row)
      this.refundForm = {
        'refundNumber': row.nums - row.notGivenNums,
        'entryId': row.entryId,
        'refundEntryName': row.nameZh,
        'prescriptionBool': row.departmentName === '药房' ? 1 : 0,
        'notGivenNums': row.nums - row.notGivenNums
      }
    },
    // 单退
    invokeSingleRefund() {
      this.refundDialogVisible = false
      var query = {
        'prescriptionEntryListJson': JSON.stringify([{
          'prescriptionEntryId': this.refundForm.entryId,
          // 退药 调用接口 和发药一样， 所以退的数量为负数
          'executionNums': -this.refundForm.refundNumber
        }])
      }
      prescriptionEntryDelivery(query).then(response => {
        this.$message({
          message: '退药登记成功！',
          type: 'success'
        })
        for (var i = 0; i < this.chargeFormTableList.length; ++i) {
          if (this.chargeFormTableList[i].entryId === this.refundForm.entryId) {
            this.chargeFormTableList[i].notGivenNums += this.refundForm.refundNumber
            break
          }
        }
      })
    },
    // 全退
    invokeDispensing() {
      // 数组必须要声明，不然push会不能识别
      var tempList = []
      var i
      if (this.multipleSelectionChargeFormTable.length === 0) {
        // 这个也是异步执行的，需要注意
        this.$confirm('未选中任意药品, 是否将全部能退的药品退药?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(this.chargeFormTableList)
          for (i = 0; i < this.chargeFormTableList.length; ++i) {
            if (this.chargeFormTableList[i].payState === 1 && this.chargeFormTableList[i].notGivenNums < this.chargeFormTableList[i].nums) {
              tempList.push({
                'prescriptionEntryId': this.chargeFormTableList[i].entryId,
                // 退药 调用接口 和发药一样， 所以退的数量为负数
                'executionNums': this.chargeFormTableList[i].notGivenNums - this.chargeFormTableList[i].nums
              })
            }
          }
          console.log(tempList)
          for (i = 0; i < tempList.length; ++i) {
            for (var j = 0; j < this.chargeFormTableList.length; ++j) {
              if (tempList[i].prescriptionEntryId === this.chargeFormTableList[j].entryId) {
                this.chargeFormTableList[j].notGivenNums = this.chargeFormTableList[j].nums
                break
              }
            }
          }
          prescriptionEntryDelivery({ 'prescriptionEntryListJson': JSON.stringify(tempList) }).then(response => {
            this.$message({
              message: '退药登记成功！',
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        for (i = 0; i < this.multipleSelectionChargeFormTable.length; ++i) {
          if (this.multipleSelectionChargeFormTable[i].payState === 1 && this.multipleSelectionChargeFormTable[i].notGivenNums < this.multipleSelectionChargeFormTable[i].nums) {
            tempList.push({
              'prescriptionEntryId': this.multipleSelectionChargeFormTable[i].entryId,
              'executionNums': this.multipleSelectionChargeFormTable[i].notGivenNums - this.multipleSelectionChargeFormTable[i].nums
            })
          }
        }
        if (tempList.length === 0) {
          this.$message.error('选中药品中均不能退药，错误！')
          this.multipleSelectionChargeFormTable = []
          this.$refs.chargeFormTableList.clearSelection()
          return
        }
        console.log('prescriptionEntryDelivery query')
        console.log(tempList)
        prescriptionEntryDelivery({ 'prescriptionEntryListJson': JSON.stringify(tempList) }).then(response => {
          this.$message({
            message: '退药登记成功！',
            type: 'success'
          })
          for (i = 0; i < tempList.length; ++i) {
            for (var j = 0; j < this.chargeFormTableList.length; ++j) {
              if (tempList[i].prescriptionEntryId === this.chargeFormTableList[j].entryId) {
                this.chargeFormTableList[j].notGivenNums = this.chargeFormTableList[j].nums
                break
              }
            }
          }
          this.multipleSelectionChargeFormTable = []
          this.$refs.chargeFormTableList.clearSelection()
        })
      }
    },
    // 根据病历号 registrationId 返回整条registration记录
    invokeFetchRegistrationRecord() {
      var query = { 'registrationId': this.registrationForm.registrationId }
      selectRegistrationByPrimaryKey(query).then(response => {
        console.log('selectRegistrationByPrimaryKey response: ')
        console.log(response)
        if (response.message === 'not found') {
          this.$message.error('未找到该条记录')
          return false
        } else {
          this.$message({
            message: '获取成功',
            type: 'success'
          })
          this.registrationForm = response.data
          this.registrationForm.departmentId = response.data.reserve1
          this.registrationForm.doctorId = response.data.reserve2
          this.registrationId = this.registrationForm.registrationId
          if (this.registrationForm.registrationCategoryId === 1) {
            this.registrationForm.registrationCategory = '普通号'
          } else if (this.registrationForm.registrationCategoryId === 2) {
            this.registrationForm.registrationCategory = '急诊号'
          } else if (this.registrationForm.registrationCategoryId === 3) {
            this.registrationForm.registrationCategory = '专家号'
          } else {
            this.registrationForm.registrationCategory = '其他号'
          }
          this.invokeSelectHistoryPrescription()
        }
      }).catch(error => {
        console.log('selectRegistrationByPrimaryKey error: ')
        console.log(error)
      })
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      // this.invokeFetchChargeItemListWithRegistrationId()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      // this.invokeFetchChargeItemListWithRegistrationId()
    },
    // 表的多级选择
    handleSelectionChange(val) {
      this.multipleSelectionChargeFormTable = val
    },
    // 新增顺序控制
    forceChange() {
      this.addChargeFormDisableBool = false
      this.getItemList()
    },
    getItemList() {
      var query = { 'departmentId': this.addChargeForm.departmentId }
      selectChargeItemByDepartmentId(query).then(response => {
        console.log('selectChargeItemByDepartmentId response: ')
        console.log(response)
        this.chargeItemList = response.data
      }).catch(error => {
        console.log('selectChargeItemByDepartmentId error: ')
        console.log(error)
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
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
  .half-height {
    height: 50%;
  }
</style>
