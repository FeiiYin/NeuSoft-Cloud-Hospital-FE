<template>
  <div class="app-container">
    <aside>用户管理</aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="18">
        <el-radio-group v-model="radioSelect" size="medium">
          <el-radio-button label="全体人员" />
          <el-radio-button label="挂号收费员" />
          <el-radio-button label="门诊医生" />
          <el-radio-button label="医技医生" />
          <el-radio-button label="药房操作员" />
          <el-radio-button label="财务管理员" />
          <el-radio-button label="医院管理员" />
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消</el-button>
        <el-button @click="addUserDataDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      </el-col>
    </el-row>
    <div class="grid-content bg-purple-light">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="userTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35px" />
        <el-table-column
          prop="userName"
          label="登录名"
        />
        <el-table-column
          prop="passWord"
          label="密码"
        />
        <el-table-column
          prop="realName"
          label="真实姓名"
        />
        <el-table-column
          prop="userDepartmentName"
          label="用户所在科室"
        />
        <el-table-column
          prop="userType"
          label="用户类别"
          width="150px"
        />
        <el-table-column
          prop="jobTitle"
          label="职称信息(仅医生)"
        />
        <el-table-column
          prop="ifWork"
          label="是否参与排班(仅医生)"
        />
        <el-table-column
          prop="edit"
          label="编辑"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editUserDataFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          :current-page="current_Page"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
        />
      </div>
      <!--新增用户信息对话框-->
      <el-dialog
        title="新增用户"
        :visible.sync="addUserDataDialogVisible"
        width="30%"
      >
        <el-form ref="addUserForm" :model="addUserForm" :rules="rules" label-position="top">
          <el-form-item label="登录名" prop="userName">
            <el-input v-model="addUserForm.username" auto-complete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-input v-model="addUserForm.password" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="addUserForm.realName" auto-complete="off" />
          </el-form-item>
          <el-form-item v-model="addUserForm.userDepartmentName" label="用户所在科室" prop="userDepartmentName">
            <!--新增用户对话框中，选择用户所在科室-->
            <template>
              <el-select v-model="selectValue1" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userDepartment"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="用户类别" prop="userType">
            <!--新增用户对话框中，选择用户分类-->
            <template>
              <el-select v-model="selectValue2" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userTyper"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="职称信息(仅医生)" prop="jobTitle">
            <!--新增用户对话框中，选择职称信息-->
            <template>
              <el-select v-model="selectValue3" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userJob"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="是否参与排班" prop="ifWork_Add">
            <el-radio v-model="ifWorkRadio_Add" label="1">是</el-radio>
            <el-radio v-model="ifWorkRadio_Add" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('userForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改用户信息对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editUserDataDialogVisible"
        width="30%"
      >
        <el-form ref="editUserForm" :model="editUserForm" :rules="rules" label-position="top">
          <el-form-item label="登录名" prop="userName">
            <el-input v-model="editUserForm.userName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editUserForm.passWord" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="editUserForm.realName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="用户所在科室" prop="userDepartment">
            <!--修改用户对话框中，选择科室分类-->
            <template>
              <el-select v-model="selectEditValue1" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userDepartment"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，选择用户类别-->
          <el-form-item v-model="editUserForm.userType" label="用户类别" prop="userType">
            <template>
              <el-select v-model="selectEditValue2" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userTyper"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，选择职称信息(仅医生)-->
          <el-form-item v-model="editUserForm.jobTitle" label="职称信息(仅医生)" prop="userTitle">
            <template>
              <el-select v-model="selectEditValue3" filterable placeholder="请选择" @change="true">
                <el-option
                  v-for="item in userJob"
                  :key="item.constantItemId"
                  :label="item.constantName"
                  :value="item.constantItemId"
                />
              </el-select>
            </template>
          </el-form-item>
          <!--修改用户对话框中，是否参与排版选择器-->
          <el-form-item label="是否参与排班" prop="ifWork">
            <el-radio v-model="ifWorkRadio" label="1">是</el-radio>
            <el-radio v-model="ifWorkRadio" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdate('editDepartmentForm')">确 定 修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      //  单选框
      radioSelect: '全体人员',
      // 多选框
      clinical_user1_checked: true, // 挂号收费员多选框
      clinical_user2_checked: true, // 门诊医生
      clinical_user3_checked: true, // 医技医生
      clinical_user4_checked: true, // 药房操作员
      clinical_user5_checked: true, // 财务管理员
      clinical_user6_checked: true, // 医院管理员
      // 分页
      current_Page: 1,
      page_size: 50,
      totalNumber: 1,
      checkList: '',
      listLoading: false, // 用户列表加载状态
      ifWorkRadio: '', // 单选器
      ifWorkRadio_Add: '',
      // 修改
      selectEditValue1: '', // 选择人员类别
      selectEditValue2: '', // 选择用户所在科室
      selectEditValue3: '', // 选择医生职称
      // 修改用户信息表单
      editUserForm: {
        userName: '',
        passWord: '',
        realName: '',
        userDepartmentName: '',
        userType: '',
        jobTitle: '',
        ifWork_Add: '',
        edit: ''
      },
      editUserDataDialogVisible: false, // 修改用户表单可见

      // 新增
      selectValue1: '', // 选择人员类别
      selectValue2: '', // 选择用户所在科室
      selectValue3: '', // 选择医生职称
      // 新增用户表单
      addUserForm: {
        userName: '',
        passWord: '',
        realName: '',
        userDepartmentName: '',
        userType: '',
        jobTitle: '',
        ifWork: '',
        edit: ''
      },
      addUserDataDialogVisible: false, // 新增用户表单可见
      //  用户所在科室下拉框
      userDepartment: [{}],
      // 用户分类下拉框
      userTyper: [{
        constantItemId: '01',
        constantName: '挂号收费员'
      },
      {
        constantItemId: '02',
        constantName: '门诊医生'
      },
      {
        constantItemId: '03',
        constantName: '医技医生'
      },
      {
        constantItemId: '04',
        constantName: '药房操作员'
      },
      {
        constantItemId: '05',
        constantName: '财务管理员'
      },
      {
        constantItemId: '06',
        constantName: '医院管理员'
      }
      ],
      //  用户职称下拉框
      userJob: [{
        constantItemId: '01',
        constantName: '主任医师'
      },
      {
        constantItemId: '02',
        constantName: '副主任医师'
      },
      {
        constantItemId: '03',
        constantName: '主治医师'
      },
      {
        constantItemId: '04',
        constantName: '住院医师'
      }
      ],
      // 提交验证
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        userDepartmentName: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        jobTitle: [
          { message: '请选择', trigger: 'blur' }
        ]
      },
      // 用户表格数据
      userTableData: [{
        userName: 'cxk',
        passWord: '12345',
        realName: 'cxk',
        userDepartmentName: '外科',
        userType: '医生',
        jobTitle: '主任',
        ifWork: '否'
      },
      {

      },
      {

      },
      {

      }
      ],
      multipleSelection: []
    }
  },
  methods: {
    editUserDataFormFunction(index, row) {
      this.editUserDataDialogVisible = true
      this.editUserForm.userName = row.userName
      this.editUserForm.passWord = row.passWord
      this.editUserForm.realName = row.realName
      this.selectEditValue1 = row.userDepartmentName
      this.selectEditValue2 = row.userType
      this.selectEditValue3 = row.jobTitle
      if (row.ifWork === '是') {
        this.ifWorkRadio = '1'
      } else {
        this.ifWorkRadio = '2'
      }
    },
    forceChange(val) {
      this.$set(this.departmentForm, 'category', val)
      this.$set(this.editDepartmentForm, 'category', val)
    },
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
    }
  }
}

</script>
