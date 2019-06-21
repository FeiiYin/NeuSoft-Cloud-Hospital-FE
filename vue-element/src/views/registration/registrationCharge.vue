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
    <aside style="height:50px;">
      <el-button type="info" style="float:right" @click="invokeDeleteChargeItemInForm">
        删除
      </el-button>
      <el-button type="primary" style="float:right;margin-right:20px;" @click="addChargeFormVisible = true">
        新增
      </el-button>
    </aside>
    <el-table
      :data="chargeFormTableList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="chargeFormTableLoading">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column  prop="reserve3" label="名称" sortable>
      </el-table-column>
      <el-table-column  prop="reserve1" label="规格" >
      </el-table-column>
      <el-table-column  prop="reserve2" label="单价" >
      </el-table-column>
      <el-table-column  prop="nums" label="数量" >
      </el-table-column>
      <el-table-column  prop="reserve1" label="单位" >
      </el-table-column>
      <el-table-column  prop="totalPrice" label="金额" >
      </el-table-column>
      <el-table-column  prop="departmentName" label="执行科室">
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

    <aside style="height:60px;">
      <span>总计金额：
        <svg-icon icon-class="money" />
      </span>
      <el-input v-model="totalListMoney" :disabled="true" style="width:20%" />

      <el-button type="info" style="float:right">
        <i class="el-icon-printer" />
        打印发票
      </el-button>
      <el-button
        type="primary"
        style="float:right;margin-right:20px;"
        @click="openChargeFormDialog()">
        <svg-icon icon-class="money" />
        交费
      </el-button>
    </aside>
    <!-- 缴费对话框 -->
    <el-dialog title="收费" :visible.sync="dialogFormVisible">
      <el-form :model="charge_form">
        <el-form-item label="应收金额">
          <el-input v-model="charge_form.should_charge" :disabled="true" />
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input v-model="charge_form.actual_charge" />
        </el-form-item>
        <el-form-item label="实际找零">
          <el-input v-model="charge_form.actual_exchange" :disabled="true" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeChargeSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增条目的对话框-->
    <el-dialog title="新增项目" :visible.sync="addChargeFormVisible" width="30%">
      <el-form ref="addChargeForm" :model="addChargeForm" :rules="rules">
        <el-form-item label="科室名称" prop="departmentId">
          <!--新增科室对话框中，选择科室分类-->
          <template>
            <el-select
              v-model="addChargeForm.departmentId"
              filterable
              placeholder="请选择"
              @change="forceChange"
              width="100%"
              >
              <el-option
                v-for="item in departmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <template>
            <el-select
              v-model="addChargeForm.name"
              filterable
              placeholder="请选择"
              width="100%"
              :disabled="addChargeFormDisableBool"
              >
              <el-option
                v-for="item in chargeItemList"
                :key="item.chargeItemId"
                :label="item.nameZh"
                :value="item.chargeItemId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="addChargeForm.number" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addChargeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeAddChargeItem('addChargeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectRegistrationByPrimaryKey
} from '../../api/registrationCharge/registration'

import {
  selectChargeForm,
  selectChargeItemByDepartmentId,
  addChargeItemToForm,
  deleteChargeItemInForm,
  payBill
} from '../../api/registrationCharge/chargeEntry'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

export default {
  data() {
    return {
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
        notGivenNums: '',
      },
      chargeFormTableList: [],
      multipleSelectionChargeFormTable: [],
      chargeFormTableLoading: false,
      // 总共金额
      totalListMoney: '0.00',
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
      totalNumber: 0
    }
  },
  created() {
    this.getDepartmentList()
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
  methods: {
    // 根据病历号 registrationId 返回整条registration记录
    invokeFetchRegistrationRecord() {
      var query = { 'registrationId': this.registrationForm.registrationId }
      selectRegistrationByPrimaryKey(query).then(response => {
        console.log('selectRegistrationByPrimaryKey response: ')
        console.log(response)
        if (response.message === 'not found') {
          this.$message.error('未找到该条记录')
          return
        } else {
          this.$message({
            message: '获取成功',
            type: 'success'
          })
          this.registrationForm = response.data
          this.registrationForm.departmentId = response.data.reserve1
          this.registrationForm.doctorId = response.data.reserve2
          this.invokeFetchChargeItemListWithRegistrationId()
        }
      }).catch(error => {
        console.log('selectRegistrationByPrimaryKey error: ')
        console.log(error)
      })
    },
    // 根据 病历号 获取当前所有对应条目 所有未交费条目
    invokeFetchChargeItemListWithRegistrationId() {
      this.chargeFormTableLoading = true
      var query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize,
        'registrationId': this.registrationForm.registrationId,
        'chargeFormCategory': 0 // 未完成支付
      }
      selectChargeForm(query).then(response => {
        console.log('selectChargeForm response: ')
        console.log(response)
        this.totalListMoney = 0
        this.chargeFormTableList = response.data.list
        for (var i = 0; i < this.chargeFormTableList.length; ++i) {
          // this.chargeFormTableList[i].totalPrice = this.chargeFormTableList[i].itemCount * this.chargeFormTableList[i].reserve2
          this.totalListMoney += this.chargeFormTableList[i].totalPrice
          // this.chargeFormTableList[i].chargeItemId = this.chargeFormTableList[i].reserve3
          for (var j = 0; j < this.departmentList.length; ++j) {
            if (this.departmentList[j].departmentId === this.chargeFormTableList[i].departmentId) {
              this.chargeFormTableList[i].departmentName = this.departmentList[j].departmentName
            }
          }
        }
        this.totalNumber = response.data.total
        this.charge_form.actual_charge = 0
        this.charge_form.actual_exchange = 0
        this.chargeFormTableLoading = false
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    // 临时添加一个条目
    invokeAddChargeItem(formName) {
      if (this.registrationForm.registrationId === '' || this.registrationForm.registrationId == null) {
        this.$message.error('未输入病历号，错误！')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var query = {
            'chargeItemId': this.addChargeForm.name,
            'registrationId': this.registrationForm.registrationId,
            'itemCount': this.addChargeForm.number,
            'collectorId': this.collectorId,
            'doctorAdvice': '医嘱'
          }
          // 'unitPrice' should be done on back
          this.addChargeFormVisible = false
          addChargeItemToForm(query).then(response => {
            console.log('addChargeItemToForm response: ')
            console.log(response)
            this.currentPage = 1
            this.$refs['addChargeForm'].resetFields()
            this.invokeFetchRegistrationRecord()
          }).catch(error => {
            console.log('addChargeItemToForm error: ')
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 临时删除一个项目
    invokeDeleteChargeItemInForm() {
      if (this.multipleSelectionChargeFormTable.length === 0) {
        this.$message.error('当前未选中条目，错误！');
        return
      }
      var tempChargeFormIdList = []
      for (var i = 0; i < this.multipleSelectionChargeFormTable.length; ++i) {
        tempChargeFormIdList.push(this.multipleSelectionChargeFormTable[i].chargeFormId)
      }
      var query = {
        'chargeItemIdList': tempChargeFormIdList
      }
      deleteChargeItemInForm(query).then(response => {
        this.currentPage = 1
        this.invokeFetchChargeItemListWithRegistrationId()
      }).catch(error => {
        console.log('deleteChargeItemInForm error: ')
        console.log(error)
      })
    },
    // 付费
    openChargeFormDialog() {
      this.dialogFormVisible = true
      this.charge_form.should_charge = this.totalListMoney
    },
    invokeChargeSubmit() {
      if (this.charge_form.should_charge === 0) {
        this.$message.error('付款金额为 0 ，错误！')
        return
      }
      if (this.charge_form.actual_charge < this.charge_form.should_charge) {
        this.$message.error('实际付款小于应当付款 ，错误！')
        return
      }
      this.dialogFormVisible = false
      var tempChargeItemIdList = []
      for (var i = 0; i < this.chargeFormTableList.length; ++i) {
        tempChargeItemIdList.push(this.chargeFormTableList[i].chargeFormId)
      }
      var query = {
        'chargeItemIdList': tempChargeItemIdList,
      }
      payBill(query).then(response => {
        this.$message({
          message: '缴费成功！',
          type: 'success'
        });
        this.invokeFetchChargeItemListWithRegistrationId()
      }).catch(error => {
        console.log('deleteChargeItemInForm error: ')
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
    getDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      }).catch(error => {
        console.log('fetchDepartmentList error: ')
        console.log(error)
      })
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
