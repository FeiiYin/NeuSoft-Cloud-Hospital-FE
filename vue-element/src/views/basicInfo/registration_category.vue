<template>
  <div class="app-container">
    <aside>
      挂号级别管理
    </aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addRegistrationCategoryDataDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox">删除</el-button>
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
        <el-table-column
          type="selection"
          width="34px"
        />
        <el-table-column
          prop="registrationCategoryId"
          label="号别编码"
        />
        <el-table-column
          prop="registrationCategoryName"
          label="号别名称"
        />
        <el-table-column
          prop="isDefault"
          label="是否默认"
        />
        <el-table-column
          prop="sequenceNo"
          label="顺序号"
        />
        <el-table-column
          label="挂号费(元)"
          prop="registrationFee"
        />
        <el-table-column
          prop="edit"
          label="编辑"
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
          <el-form-item label="号别名称" prop="registrationCategoryName">
            <el-input v-model="addRegistrationCategoryForm.registrationCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否默认" prop="isDefault_Add">
            <el-radio v-model="addRegistrationCategoryForm.isDefault" label="1" @change="forceChange">是</el-radio>
            <el-radio v-model="addRegistrationCategoryForm.isDefault" label="0" @change="forceChange">否</el-radio>
          </el-form-item>
          <el-form-item label="顺序号" prop="sequenceNo">
            <el-input v-model="addRegistrationCategoryForm.sequenceNo" auto-complete="off" />
          </el-form-item>
          <el-form-item label="挂号费" prop="registrationFee">
            <el-input v-model="addRegistrationCategoryForm.registrationFee" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearAddRegistrationCategoryDataDialog">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addRegistrationCategoryForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改挂号信息对话框-->
      <el-dialog
        title="修改挂号级别"
        :visible.sync="editRegistrationCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="editRegistrationCategoryForm" :model="editRegistrationCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="号别编码" prop="registrationCategoryId">
            <el-input v-model="editRegistrationCategoryForm.registrationCategoryId" auto-complete="off" :disabled="true" />
          </el-form-item>
          <el-form-item label="号别名称" prop="registrationCategoryName">
            <el-input v-model="editRegistrationCategoryForm.registrationCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否默认" prop="isDefault">
            <el-radio v-model="isDefaultRadio" label="1" @change="forceChange">是</el-radio>
            <el-radio v-model="isDefaultRadio" label="0" @change="forceChange">否</el-radio>
          </el-form-item>
          <el-form-item label="顺序号" prop="sequenceNo">
            <el-input v-model="editRegistrationCategoryForm.sequenceNo" auto-complete="off" />
          </el-form-item>
          <el-form-item label="挂号费" prop="registrationFee">
            <el-input v-model="editRegistrationCategoryForm.registrationFee" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRegistrationCategoryDataDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpdate('editRegistrationCategoryForm')">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  selectRegistration_categoryList,
  addRegistration_category,
  updateRegistration_category,
  deleteRegistration_categoryByPrimaryKey
} from '../../api/basicInfo/registration_category'

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      // 新增挂号类别表单
      addRegistrationCategoryForm: {
        registrationCategoryId: '',
        registrationCategoryName: '',
        sequenceNo: '',
        isDefault: false,
        registrationFee: '',
        isDefaultId: 0
      },
      addRegistrationCategoryDataDialogVisible: false, // 新增挂号级别表单可见
      isDefaultRadio: '', // 单选器
      listLoading: false, // 挂号级别列表加载状态
      // 修改挂号类别可见
      editRegistrationCategoryForm: {
        registrationCategoryId: 0,
        registrationCategoryName: '',
        isDefault: false,
        sequenceNo: 0,
        registrationFee: 0.0,
        isDefaultId: 0
      },
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
        sequenceNo: [
          { required: true, message: '请输入顺序号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        registrationFee: [
          { required: true, message: '请输入号挂号费', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 挂号级别表格数据
      registrationTableData: [{
        registrationCategoryId: '1',
        registrationCategoryName: '普通号',
        isDefault: '是',
        sequenceNo: '001',
        registrationFee: '10'
      },
      {
        registrationCategoryId: '2',
        registrationCategoryName: '专家号',
        isDefault: '否',
        sequenceNo: '002',
        registrationFee: '20'
      },
      {
        registrationCategoryId: '3',
        registrationCategoryName: '急诊号',
        isDefault: '否',
        sequenceNo: '003',
        registrationFee: '25'
      }],
      multipleSelection: [],
      registrationCategoryIdList: []
    }
  },

  created() {
    this.getRegistration_category()
  },

  methods: {
    editRegistrationCategoryFormFunction(index, row) {
      this.editRegistrationCategoryDataDialogVisible = true
      this.editRegistrationCategoryForm.registrationCategoryId = row.registrationCategoryId + ''
      this.editRegistrationCategoryForm.registrationCategoryName = row.registrationCategoryName
      this.editRegistrationCategoryForm.sequenceNo = row.sequenceNo + ''
      this.editRegistrationCategoryForm.registrationFee = row.registrationFee + ''
      console.log('row is default', row.isDefault)
      if (row.isDefault === '是') {
        this.isDefaultRadio = '1'
        this.editRegistrationCategoryForm.isDefault = true
      } else {
        this.isDefaultRadio = '0'
        this.editRegistrationCategoryForm.isDefault = false
      }
    },
    forceChange(val) {
      if (val === '1') {
        this.$set(this.editRegistrationCategoryForm, 'isDefault', true)
      } else {
        this.$set(this.addRegistrationCategoryForm, 'isDefault', false)
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
    },
    getRegistration_category() {
      this.listLoading = true
      var query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      }
      selectRegistration_categoryList(query).then(
        response => {
          console.log('selectRegistrationCategory response: ')
          console.log(response)
          this.registrationTableData = response.data.list
          this.registrationTableData.map((value) => {
            if (value.isDefault === true) {
              value.isDefault = '是'
              this.addRegistrationCategoryForm.isDefaultId = value.registrationCategoryId
              this.editRegistrationCategoryForm.isDefaultId = value.registrationCategoryId
              console.log('isDefaultId', this.addRegistrationCategoryForm.isDefaultId)
            } else if (value.isDefault === false) {
              value.isDefault = '否'
            }
          })
          this.listLoading = false
        }
      ).catch(error => {
        console.log('selectResponseCategory error:')
        console.log(error)
      })
    },
    clearAddRegistrationCategoryDataDialog() {
      this.addRegistrationCategoryDataDialogVisible = false
      this.$refs['addRegistrationCategoryForm'].resetFields()
    },
    submitAdd(formName) {
      console.log('add registration_category: ', this.addRegistrationCategoryForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRegistration_category(this.addRegistrationCategoryForm).then(response => {
            this.totalNumber += 1
            var tmp = Math.ceil(this.totalNumber / this.pageSize)
            this.current = tmp
            this.clearAddRegistrationCategoryDataDialog()
            this.getRegistration_category()
          }).catch(error => {
            console.log('add r c error: ')
            console.log(error)
          })
        } else {
          console.log('error addRC!!')
          return false
        }
      }
      )
    },
    submitUpdate(formName) {
      console.log('edit registration_category', this.editRegistrationCategoryForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editRegistrationCategoryDataDialogVisible = false
          console.log('$$$Update', this.editRegistrationCategoryForm)
          updateRegistration_category(this.editRegistrationCategoryForm).then(response => {
            console.log('update RegistrationCategoryForm response: ')
            console.log(response)
            this.getRegistration_category()
          }).catch(error => {
            console.log('update RegistrationCategory error: ')
            console.log(error)
          })
        } else {
          console.log('error updateRegistrationCategory')
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
        this.registrationCategoryIdList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.registrationCategoryIdList.push(this.multipleSelection[i].registrationCategoryId)
        }
        this.registrationCategoryIdList = { 'registrationCategoryIdList': this.registrationCategoryIdList }
        /**
         * 按主键删除挂号种类信息的请求
         */
        deleteRegistration_categoryByPrimaryKey(this.registrationCategoryIdList).then(response => {
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
    }
  }
}

</script>
