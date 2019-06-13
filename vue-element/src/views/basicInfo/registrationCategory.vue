<template>
  <div class="app-container">
    <aside>
      挂号级别管理
    </aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消</el-button>
        <el-button @click="addRegistrationCategoryDataDialogVisible = true">新增</el-button>
        <el-button @click="true">删除</el-button>
      </el-col>
    </el-row>
    <div class="gird-content bg-purple-light">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="registrationTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35px" />
        <el-table-column
          prop="registrationCategoryId"
          label="号别编码"
        />
        <el-table-column
          prop="registrationCategoryName"
          label="号别名称"
        />
        <el-table-column
          prop="ifDefault"
          label="是否默认"
        />
        <el-table-column
          prop="sequence"
          label="顺序号"
        />
        <el-table-column
          label="挂号费(元)"
          prop="fee"
        />
        <el-table-column
          prop="edit"
          label="编辑"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editRegistrationCategoryFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增挂号信息对话框-->
      <el-dialog
        title="新增挂号级别"
        :visible.sync="addRegistrationCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="addRegistrationCategoryForm" :model="addRegistrationCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="号别编码" prop="registrationId">
            <el-input v-model="addRegistrationCategoryForm.registrationCategoryId" auto-complete="off" />
          </el-form-item>
          <el-form-item label="号别名称" prop="registrationName">
            <el-input v-model="addRegistrationCategoryForm.registrationCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否默认" prop="ifDefault_Add">
            <el-radio v-model="ifDefaultRadio_Add" label="1">是</el-radio>
            <el-radio v-model="ifDefaultRadio_Add" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="顺序号" prop="sequence">
            <el-input v-model="addRegistrationCategoryForm.sequence" auto-complete="off" />
          </el-form-item>
          <el-form-item label="挂号费" prop="fee">
            <el-input v-model="addRegistrationCategoryForm.fee" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRegistrationCategoryDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('userForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改挂号信息对话框-->
      <el-dialog
        title="修改挂号级别"
        :visible.sync="editRegistrationCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="editRegistrationCategoryForm" :model="editRegistrationCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="号别编码" prop="registrationId">
            <el-input v-model="editRegistrationCategoryForm.registrationCategoryId" auto-complete="off" />
          </el-form-item>
          <el-form-item label="号别名称" prop="registrationName">
            <el-input v-model="editRegistrationCategoryForm.registrationCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否默认" prop="ifDefault">
            <el-radio v-model="ifDefaultRadio" label="1">是</el-radio>
            <el-radio v-model="ifDefaultRadio" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="顺序号" prop="sequence">
            <el-input v-model="editRegistrationCategoryForm.sequence" auto-complete="off" />
          </el-form-item>
          <el-form-item label="挂号费" prop="fee">
            <el-input v-model="editRegistrationCategoryForm.fee" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRegistrationCategoryDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('userForm')">确 定 修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 新增挂号类别表单
      addRegistrationCategoryForm: [{
        registrationCategoryId: '',
        registrationCategoryName: '',
        sequence: '',
        ifDefault_Add: '',
        fee: ''
      }],
      addRegistrationCategoryDataDialogVisible: false, // 新增挂号级别表单可见
      ifDefaultRadio: '', // 单选器
      ifDefaultRadio_Add: '',
      listLoading: false, // 挂号级别列表加载状态
      // 修改挂号类别可见
      editRegistrationCategoryForm: [{
        registrationCategoryId: '',
        registrationCategoryName: '',
        ifDefault: '',
        sequence: '',
        fee: ''
      }],
      editRegistrationCategoryDataDialogVisible: false, // 修改挂号级别表单可见
      rules: {
        registrationCategoryId: [
          { required: true, message: '请输入号别编码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        registrationCategoryName: [
          { required: true, message: '请输入号别名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        sequence: [
          { required: true, message: '请输入顺序号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入号挂号费', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 挂号级别表格数据
      registrationTableData: [{
        registrationCategoryId: '1',
        registrationCategoryName: '普通号',
        ifDefault: '是',
        sequence: '001',
        fee: '10'
      },
      {
        registrationCategoryId: '2',
        registrationCategoryName: '专家号',
        ifDefault: '是',
        sequence: '002',
        fee: '20'
      },
      {
        registrationCategoryId: '3',
        registrationCategoryName: '急诊号',
        ifDefault: '是',
        sequence: '003',
        fee: '25'
      }],
      multipleSelection: []
    }
  },
  methods: {
    editRegistrationCategoryFormFunction(index, row) {
      this.editRegistrationCategoryDataDialogVisible = true
      this.editRegistrationCategoryForm.registrationCategoryId = row.registrationCategoryId
      this.editRegistrationCategoryForm.registrationCategoryName = row.registrationCategoryName
      this.editRegistrationCategoryForm.sequence = row.sequence
      this.editRegistrationCategoryForm.fee = row.fee
      if (row.ifDefault === '是') {
        this.ifDefaultRadio = '1'
      } else {
        this.ifDefaultRadio = '2'
      }
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
