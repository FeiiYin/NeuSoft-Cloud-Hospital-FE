<template>
  <div class="app-container">
    <aside>用户管理</aside>

    <el-row style="margin-bottom: 20px" :gutter="20">
      <el-col :span="18">
        <el-radio-group v-model="radioSelect" size="medium" @change="invokeChangeRadioSelect">
          <el-radio-button label="所有用户" />
          <el-radio-button label="门诊医生" />
          <el-radio-button label="医技医生" />
          <el-radio-button label="挂号收费员" />
          <el-radio-button label="药房操作员" />
          <el-radio-button label="财务管理员" />
          <el-radio-button label="医院管理员" />
        </el-radio-group>
        <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;float:right" type="primary" icon="document" @click="handleDownload">
          导出 Excel
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addAccountDataDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      </el-col>
    </el-row>
    <div>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="accountTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="34px"
        />
        <el-table-column v-if="1 === 0" prop="accountId" label="id" />
        <el-table-column v-if="1 === 0" prop="departmentId" label="id" />
        <el-table-column
          prop="userName"
          label="用户名"
        />
        <el-table-column
          v-if="1 === 0"
          prop="userPassword"
          label="密码"
        />
        <el-table-column
          prop="realName"
          label="真实姓名"
        />
        <el-table-column
          prop="departmentName"
          label="科室"
        />
        <el-table-column
          prop="accountType"
          label="类别"
        />
        <el-table-column
          v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
          prop="jobTitle"
          label="医生职称"
        />
        <el-table-column
          v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
          prop="doctorScheduling"
          label="医生排班"
        />
        <el-table-column
          prop="edit"
          label="编辑"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editAccountDataFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
        />
      </div>
      <!--新增用户信息对话框-->
      <el-dialog
        title="新增用户"
        :visible.sync="addAccountDataDialogVisible"
        width="30%"
      >
        <el-form ref="addAccountForm" :model="addAccountForm" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="addAccountForm.userName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="addAccountForm.userPassword" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="addAccountForm.realName" auto-complete="off" />
          </el-form-item>
          <!--新增用户对话框中，选择用户所在科室-->
          <el-form-item v-model="addAccountForm.departmentName" label="科室" prop="departmentName">
            <template>
              <el-select v-model="selectValue1" filterable placeholder="请选择" @change="forceChange1">
                <el-option
                  v-for="item in accountDepartment"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--新增用户对话框中，选择用户分类-->
          <el-form-item v-model="addAccountForm.accountType" label="类别" prop="accountType">
            <el-select v-model="selectValue2" filterable placeholder="请选择" @change="forceChange2">
              <el-option
                v-for="item in accountTyper"
                :key="item.constantItemId"
                :label="item.constantName"
                :value="item.constantItemId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
            label="医生职称"
            prop="jobTitle"
          >
            <!--新增用户对话框中，选择职称信息-->
            <template>
              <el-select v-model="selectValue3" filterable placeholder="请选择" @change="forceChange3">
                <el-option
                  v-for="item in accountJob"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item
            v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
            label="是否参与排班"
            prop="doctorScheduling"
          >
            <el-radio v-model="doctorSchedulingRadio_Add" label="1" @change="forceChange4">是</el-radio>
            <el-radio v-model="doctorSchedulingRadio_Add" label="0" @change="forceChange4">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAccountDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addAccountForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改用户信息对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editAccountDataDialogVisible"
        width="30%"
      >
        <el-form ref="editAccountForm" :model="editAccountForm" :rules="rules" label-position="top">
          <el-form-item v-if="1 === 0" label="id" prop="accountId" />
          <el-form-item v-if="1 === 0" label="id" prop="departmentId" />
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="editAccountForm.userName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="editAccountForm.userPassword" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="editAccountForm.realName" auto-complete="off" />
          </el-form-item>
          <!--修改用户对话框中，选择科室分类-->
          <el-form-item v-model="editAccountForm.departmentName" label="科室" prop="departmentName">
            <template>
              <el-select v-model="selectEditValue1" filterable placeholder="请选择" @change="forceChange1">
                <el-option
                  v-for="item in accountDepartment"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，选择用户类别-->
          <el-form-item v-model="editAccountForm.accountType" label="类别" prop="accountType">
            <template>
              <el-select v-model="selectEditValue2" filterable placeholder="请选择" @change="forceChange2">
                <el-option
                  v-for="item in accountTyper"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，选择职称信息(仅医生)-->
          <el-form-item
            v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
            v-model="editAccountForm.jobTitle"
            label="医生职称"
            prop="jobTitle"
          >
            <template>
              <el-select v-model="selectEditValue3" filterable placeholder="请选择" @change="forceChange3">
                <el-option
                  v-for="item in accountJob"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，是否参与排版选择器-->
          <template>
            <el-form-item
              v-if="radioSelect === '门诊医生' || radioSelect === '医技医生'|| radioSelect === '所有用户'"
              label="是否参与排班"
              prop="doctorScheduling"
            >
              <el-radio v-model="doctorSchedulingRadio" label="1" @change="forceChange4">是</el-radio>
              <el-radio v-model="doctorSchedulingRadio" label="0" @change="forceChange4">否</el-radio>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAccountDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdate('editAccountForm')">确 定 修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addAccount,
  selectAccountList,
  updateAccount,
  deleteAccount
} from '../../api/basicInfo/account'
import {
  fetchDepartmentList
} from '../../api/basicInfo/department'
// import moment from 'moment'
export default {
  data() {
    return {
      downloadLoading: false,
      // 单选框
      radioSelect: '所有用户',
      // 多选框
      clinical_account1_checked: true, // 挂号收费员多选框
      clinical_account2_checked: true, // 门诊医生
      clinical_account3_checked: true, // 医技医生
      clinical_account4_checked: true, // 药房操作员
      clinical_account5_checked: true, // 财务管理员
      clinical_account6_checked: true, // 医院管理员
      // 分页
      currentPage: 1,
      pageSize: 50,
      accountScope: ['00', '01', '10', '11', '12', '13'],
      totalNumber: 1,
      checkList: '',
      listLoading: false, // 用户列表加载状态
      doctorSchedulingRadio: '', // 单选器
      doctorSchedulingRadio_Add: '',
      // 修改
      selectEditValue1: '', // 选择人员类别
      selectEditValue2: '', // 选择用户所在科室
      selectEditValue3: '', // 选择医生职称
      // 修改用户信息表单
      editAccountForm: {
        accountId: '',
        userName: '',
        userPassword: '',
        realName: '',
        departmentName: '',
        departmentId: '',
        accountType: '',
        jobTitle: '',
        doctorScheduling: ''
      },
      editAccountDataDialogVisible: false, // 修改用户表单可见

      // 新增
      selectValue1: '', // 选择人员类别
      selectValue2: '', // 选择用户所在科室
      selectValue3: '', // 选择医生职称
      // 新增用户表单
      addAccountForm: {
        userName: '',
        userPassword: '',
        realName: '',
        departmentName: '',
        accountType: '',
        jobTitle: '',
        doctorScheduling: ''
      },
      addAccountDataDialogVisible: false, // 新增用户表单可见
      //  用户所在科室下拉框
      accountDepartment: [{
        departmentId: '',
        departmentName: ''
      }],
      // 用户分类下拉框
      accountTyper: [{
        constantItemId: '00',
        constantName: '门诊医生'
      },
      {
        constantItemId: '01',
        constantName: '医技医生'
      },
      {
        constantItemId: '10',
        constantName: '医院管理员'
      },
      {
        constantItemId: '11',
        constantName: '药房操作员'
      },
      {
        constantItemId: '12',
        constantName: '财务管理员'
      },
      {
        constantItemId: '13',
        constantName: '挂号收费员'
      }
      ],
      //  用户职称下拉框
      accountJob: [{
        constantItemId: '主任医师',
        constantName: '主任医师'
      },
      {
        constantItemId: '副主任医师',
        constantName: '副主任医师'
      },
      {
        constantItemId: '主治医师',
        constantName: '主治医师'
      },
      {
        constantItemId: '住院医师',
        constantName: '住院医师'
      }
      ],
      // 提交验证
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        departmentName: [
          { message: '请选择', trigger: 'blur' }
        ],
        accountType: [
          { message: '请选择', trigger: 'blur' }
        ],
        jobTitle: [
          { message: '请选择', trigger: 'blur' }
        ]
      },
      // 用户表格数据
      accountTableData: [{
        accountId: '1',
        userName: 'cxk',
        userPassword: '12345',
        realName: 'cxk',
        departmentName: '外科',
        accountType: '门诊医生',
        jobTitle: '主任医师',
        doctorScheduling: '否',
        departmentId: '1'
      }],
      accountConstant: [{
        constantItemId: '',
        constantTypeId: '',
        constantCode: '',
        constantName: '',
        valid: null
      }],
      multipleSelection: [],
      account_id_list: []
    }
  },
  created() {
    this.invokeSelectAccount()
  },
  methods: {
    invokeChangeRadioSelect(val) {
      // console.log(val)
      this.accountScope = []
      if (val === '所有用户') { // 输入对应参数进行查询
        this.accountScope = []
        this.accountScope.push('00', '01', '10', '11', '12', '13')
      } else if (val === '门诊医生') {
        this.accountScope = []
        this.accountScope.push('00')
      } else if (val === '医技医生') {
        this.accountScope = []
        this.accountScope.push('01')
      } else if (val === '医院管理员') {
        this.accountScope = []
        this.accountScope.push('10')
      } else if (val === '药房操作员') {
        this.accountScope = []
        this.accountScope.push('11')
      } else if (val === '财务管理员') {
        this.accountScope = []
        this.accountScope.push('12')
      } else if (val === '挂号收费员') {
        this.accountScope = []
        this.accountScope.push('13')
      }
      this.invokeSelectAccount()
    },
    invokeSelectAccount() { // 向后台查询数据
      this.listLoading = true
      var query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize,
        'accountScope': this.accountScope
      }
      console.log('query is', query)
      selectAccountList(query).then(response => { // 然后获取科室信息列表
        this.accountTableData = []
        console.log('selectAccountList response: ')
        console.log(response)
        const responseJsonList = response.data.list
        const len = response.data.list.length
        this.totalNumber = len
        let respondJson
        for (let i = 0; i < len; ++i) { // 获取所用用户信息表
          respondJson = JSON.parse(responseJsonList[i])
          if (respondJson['accountType'] === '00') {
            respondJson['accountType'] = '门诊医生'
          } else if (respondJson['accountType'] === '01') {
            respondJson['accountType'] = '医技医生'
          } else if (respondJson['accountType'] === '10') {
            respondJson['accountType'] = '医院管理员'
          } else if (respondJson['accountType'] === '11') {
            respondJson['accountType'] = '药房操作员'
          } else if (respondJson['accountType'] === '12') {
            respondJson['accountType'] = '财务管理员'
          } else if (respondJson['accountType'] === '13') {
            respondJson['accountType'] = '挂号收费员'
          }
          if (respondJson['doctorScheduling'] === 1) {
            respondJson['doctorScheduling'] = '是'
          } else if (respondJson['doctorScheduling'] === 0) {
            respondJson['doctorScheduling'] = '否'
          } else {
            respondJson['doctorScheduling'] = ''
          }
          this.accountTableData.push(respondJson)
        } this.listLoading = false
      }).catch(error => {
        console.log('selectAccountList error: ')
        console.log(error)
      })
      // 开始加载对应的所有科室
      this.departmentQuery = { 'currentPage': this.currentPage, 'pageSize': 400 }

      // console.log(this.departmentQuery)
      fetchDepartmentList(this.departmentQuery).then(response => { // 获取科室常量信息表
        console.log(response)
        this.accountDepartment = response.data.list
      })
    },
    editAccountDataFormFunction(index, row) {
      this.editAccountDataDialogVisible = true
      this.editAccountForm.accountId = row.accountId
      this.editAccountForm.userName = row.userName
      this.editAccountForm.userPassword = row.userPassword
      this.editAccountForm.realName = row.realName
      this.editAccountForm.departmentId = row.departmentId
      this.selectEditValue1 = row.departmentName
      this.editAccountForm.departmentName = row.departmentName
      this.selectEditValue2 = row.accountType
      this.editAccountForm.accountType = row.accountType
      this.selectEditValue3 = row.jobTitle
      this.editAccountForm.jobTitle = row.jobTitle
      if (row.doctorScheduling === '是') {
        this.doctorSchedulingRadio = '1'
        this.editAccountForm.doctorScheduling = 1
      } else {
        this.doctorSchedulingRadio = '0'
        this.editAccountForm.doctorScheduling = 0
      }
    }, // 1是科室，2是类别，3是职称, 4是排班
    forceChange1(val) {
      this.$set(this.addAccountForm, 'departmentId', val)
      this.$set(this.editAccountForm, 'departmentId', val)
    },
    forceChange2(val) {
      this.$set(this.addAccountForm, 'accountType', val)
      this.$set(this.editAccountForm, 'accountType', val)
    },
    forceChange3(val) {
      this.$set(this.addAccountForm, 'jobTitle', val)
      this.$set(this.editAccountForm, 'jobTitle', val)
    },
    forceChange4(val) {
      this.$set(this.addAccountForm, 'doctorScheduling', val)
      this.$set(this.editAccountForm, 'doctorScheduling', val)
    },
    // 全部选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 增加用户
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAccountDataDialogVisible = false
          addAccount(this.addAccountForm).then(response => {
            console.log('add account response: ')
            console.log(response)
            this.totalNumber += 1
            var tmp = Math.ceil(this.totalNumber / this.pageSize)
            this.current = tmp
            this.$refs['addAccountForm'].resetFields() // 清空内容及选择器
            this.selectValue1 = ''
            this.selectValue2 = ''
            this.selectValue3 = ''
            this.invokeSelectAccount()
          }).catch(error => {
            console.log('add account error: ')
            console.log(error)
          })
        } else {
          console.log('error addAccount!!')
          return false
        }
      })
    },
    submitUpdate(formName) {
      console.log('form content')
      console.log(this.editAccountForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editAccountDataDialogVisible = false
          updateAccount(this.editAccountForm).then(response => {
            console.log('update account response: ')
            console.log(response)
            this.invokeSelectAccount()
          }).catch(error => {
            console.log('update account error: ')
            console.log(error)
          })
        } else {
          console.log('error updateAccount')
          return false
        }
      }
      )
    },
    openConfirmDeleteMessageBox() {
      if (this.multipleSelection.length === 0 || this.multipleSelection.length == null) {
        this.$message.error('请选择您要删除的记录。')
        return
      }
      this.$confirm('这将永久删除这些记录, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        this.account_id_list = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.account_id_list.push(this.multipleSelection[i].accountId)
        }
        this.account_id_list = { 'accountIdList': this.account_id_list }
        /**
         * 按主键删除用户信息的请求
         */
        deleteAccount(this.account_id_list).then(response => {
          console.log('deleteDepartmentByPrimaryKey response: ')
          console.log(response)
          this.$message({
            type: 'success',
            message: '已删除'
          })
          this.invokeSelectAccount()
        }).catch(error => {
          console.log('deleteDepartmentByPrimaryKey error: ')
          console.log(error)
          this.$message.error('删除失败')
        })
        this.currentPage = 1
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '真实姓名', '科室', '类别']
        const filterVal = ['userName', 'realName', 'departmentName', 'accountType']
        const list = this.accountTableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
