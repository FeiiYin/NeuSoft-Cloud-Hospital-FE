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
            <el-form-item label="结算类别">
              <el-input v-model="registrationForm.settleAccountsCategory" :disabled="true" />
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
      <el-button type="info" style="float:right">
        删除
      </el-button>
      <el-button type="primary" style="float:right;margin-right:20px;" @click="addChargeFormVisible = true">
        新增
      </el-button>
    </aside>
    <el-table :data="chargeForm" style="width: 100%" 
      @selection-change="handleSelectionChange" v-loading="chargeFormTableLoading">
      <el-table-column type="selection" width="55">
    </el-table-column>
      <el-table-column  prop="chargeItemId" label="消费项目" sortable>
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="规格" >
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="单价" >
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="数量" >
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="单位" >
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="金额" >
      </el-table-column>
      <el-table-column  prop="chargeItemId" label="执行科室">
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
      <span>总共金额： </span>
      <el-input v-model="total_money" :disabled="true" style="width:20%" />

      <el-button type="info" style="float:right">
        <i class="el-icon-printer" />
        打印发票
      </el-button>
      <el-button type="primary" style="float:right;margin-right:20px;"
        @click="dialogFormVisible=true">
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
        <el-button type="primary" @click="charge()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增条目的对话框-->
    <el-dialog title="新增项目" :visible.sync="addChargeFormVisible" width="30%">
      <el-form ref="editDepartmentForm" :model="addChargeForm" :rules="rules">
        <el-form-item label="项目名称" prop="departmentId">
          <!--新增科室对话框中，选择科室分类-->
          <template>
            <!-- <el-select
              v-model="addChargeForm.name"
              filterable
              placeholder="请选择"
              @change="forceChange" >
              <el-option
                v-for="item in departmentConstant"
                :key="item.constantItemId"
                :label="item.constantName"
                :value="item.constantItemId"
              />
            </el-select> -->
          </template>          
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="addChargeForm.number" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addChargeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate('editDepartmentForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  selectRegistrationByPrimaryKey,
  selectChargeForm,
} from '../../api/registrationCharge/registration'

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
      multipleSelectionChargeFormTable: [],
      chargeFormTableLoading: false,    
      // 总共金额
      total_money: '600.00',
      // 充值金额
      charge_form: {
        should_charge: '',
        actual_charge: '',
        actual_exchange: ''
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
        name: '',
        number: '',
      },
      // 规范
      // 提交验证
      rules: {
        departmentCode: [
          { required: true, message: '请输入科室编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 0,
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
          });
          this.registrationForm = response.data
          this.invokeFetchChargeItemListWithRegistrationId()
        }
      }).catch(error => {
        console.log('selectRegistrationByPrimaryKey error: ')
        console.log(error)
      })
    },
    // 根据 病历号 获取当前所有对应条目
    // TODO
    invokeFetchChargeItemListWithRegistrationId() {
      this.chargeFormTableLoading = true;
      var query = {
        'currentPage': this.currentPage, 
        'pageSize': this.pageSize,
        'registrationId' : this.registrationForm.registrationId, 
      }
      selectChargeForm(query).then(response => {
        console.log('selectChargeForm response: ')
        console.log(response)
        this.registrationList = response.data.list
        this.totalNumber = response.data.total        
        this.chargeFormTableLoading = false
      }).catch(error => {
        console.log('selectChargeForm error: ')
        console.log(error)
      })
    },
    // 临时添加一个条目
    invokeAddChargeItem(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          this.addDepartmentDialogVisible = false
          // this.departmentForm.category =
          // console.log(this.departmentForm);
          addDepartment(this.departmentForm).then(response => {
            console.log('addDepartment response: ')
            console.log(response)
            this.totalNumber += 1
            var tmp = Math.ceil(this.totalNumber / this.pageSize)
            this.currentPage = tmp
            this.$refs['departmentForm'].resetFields()
            this.selectValue = ''
            this.queryDepartmentListWithPage()
          }).catch(error => {
            console.log('addDepartment error: ')
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatter(row, column) {
      return row.address
    },
    filterTag(value, row) {
      return row.tag === value
    },
    charge() {
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '支付成功',
        type: 'success'
      })
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
