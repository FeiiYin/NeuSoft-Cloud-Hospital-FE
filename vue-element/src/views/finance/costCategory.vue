<template>
  <div class="app-container">
    <aside>费用科目管理</aside>

    <el-row>
      <el-col :span="6" style="float:right">
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addExpenseCategoryDialogVisible = true">新增</el-button>
        <el-button @click="invokeDelete()">删除</el-button>
      </el-col>
    </el-row>
    <div class="grid-content bg-purple-light">
      <el-table
        ref="expenseCategoryTableData"
        v-loading="expenseCategoryTableLoading"
        :data="expenseCategoryTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="expenseCategoryId" label="费用科目编号" />
        <el-table-column prop="expenseCategoryCode" label="科目编码" />
        <el-table-column prop="expenseCategoryName" label="科目名称" />
        <el-table-column prop="edit" label="编辑">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openEditDialog(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增科室的对话框 -->
    <el-dialog
      title="新增科室"
      :visible.sync="addExpenseCategoryDialogVisible"
      width="30%"
    >
      <el-form ref="expenseCategoryForm" :model="expenseCategoryForm" :rules="rules">
        <el-form-item label="科目编码" prop="expenseCategoryCode">
          <el-input v-model="expenseCategoryForm.expenseCategoryCode" />
        </el-form-item>
        <el-form-item label="科室名称" prop="expenseCategoryName">
          <el-input v-model="expenseCategoryForm.expenseCategoryName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addExpenseCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改科室的对话框-->
    <el-dialog
      title="修改科室"
      :visible.sync="editExpenseCategoryDialogVisible"
      width="30%"
    >
      <el-form ref="expenseCategoryForm" :model="expenseCategoryForm" :rules="rules">
        <el-form-item label="科目编码" prop="expenseCategoryCode">
          <el-input v-model="expenseCategoryForm.expenseCategoryCode" />
        </el-form-item>
        <el-form-item label="科室名称" prop="expenseCategoryName">
          <el-input v-model="expenseCategoryForm.expenseCategoryName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editExpenseCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectExpenseCategory,
  saveExpenseCategory,
  deleteExpenseCategory
} from '../../api/finance/expenseCategory'

import {
  deepClone
} from '../../utils'

export default {
  data() {
    return {
      expenseCategoryForm: {
        'expenseCategoryId': '',
        'expenseCategoryCode': '',
        'expenseCategoryName': '',
        'valid': ''
      },
      // 查询
      expenseCategoryTableData: [],
      expenseCategoryTableLoading: false,
      // 新增
      addExpenseCategoryDialogVisible: false,
      // 修改
      editExpenseCategoryDialogVisible: false,
      // 删除
      multipleSelection: [],
      tempList: [],
      department_id: [],
      // 提交验证
      rules: {
        expenseCategoryCode: [
          { required: true, message: '请输入科室编码', trigger: 'blur' }
        ],
        expenseCategoryName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ]
      },
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0
    }
  },
  created() {
    this.invokeSelectExpenseCategory()
  },
  methods: {
    // 查询 刷新
    invokeSelectExpenseCategory() {
      this.expenseCategoryTableLoading = true
      var query = {
        'currentPage': 1,
        'pageSize': 100
      }
      selectExpenseCategory(query).then(response => {
        console.log('selectExpenseCategory response: ')
        console.log(response)
        this.expenseCategoryTableData = response.data.list
        this.expenseCategoryTableLoading = false
      }).catch(error => {
        console.log('selectExpenseCategory error: ')
        console.log(error)
      })
    },
    // 取消選擇
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.expenseCategoryTableData.toggleRowSelection(row)
        })
      } else {
        this.$refs.expenseCategoryTableData.clearSelection()
      }
    },
    // 新建
    invokeAdd() {
      this.$refs['expenseCategoryForm'].validate((valid) => {
        if (valid) {
          this.addExpenseCategoryDialogVisible = false
          var query = {
            'expenseCategoryJson': {
              // 'expenseCategoryId': 新增 不填
              'expenseCategoryCode': this.expenseCategoryForm.expenseCategoryCode,
              'expenseCategoryName': this.expenseCategoryForm.expenseCategoryName
            }
          }
          saveExpenseCategory(query).then(response => {
            console.log(response)
            this.invokeSelectExpenseCategory()
            this.$message({
              message: '新增成功！',
              type: 'success'
            })
          }).catch(error => {
            console.log('addDepartment error: ')
            console.log(error)
          })
        } else {
          console.log('invokeAdd error!')
          return
        }
      })
    },
    invokeDelete() {
      if (this.multipleSelection.length === 0 || this.multipleSelection.length == null) {
        this.$message.error('请选择您要删除的记录。')
        return
      }
      this.$confirm('这将永久删除这些记录, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        var tempList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          tempList.push(this.multipleSelection[i].expenseCategoryId)
        }
        var query = {
          'expenseCategoryIdList': tempList
        }
        deleteExpenseCategory(query).then(response => {
          console.log('deleteDepartmentByPrimaryKey response: ')
          console.log(response)
          this.invokeSelectExpenseCategory()
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    openEditDialog(index, row) {
      this.editExpenseCategoryDialogVisible = true
      this.expenseCategoryForm = deepClone(row)
    },
    invokeUpdate() {
      this.$refs['expenseCategoryForm'].validate((valid) => {
        if (valid) {
          this.editExpenseCategoryDialogVisible = false
          for (var i = 0; i < this.expenseCategoryTableData.length; ++i) {
            if (this.expenseCategoryTableData[i].expenseCategoryId === this.expenseCategoryForm.expenseCategoryId) {
              this.expenseCategoryTableData[i] = deepClone(this.expenseCategoryForm)
              break
            }
          }
          var query = {
            'expenseCategoryJson': {
              'expenseCategoryId': this.expenseCategoryForm.expenseCategoryId,
              'expenseCategoryCode': this.expenseCategoryForm.expenseCategoryCode,
              'expenseCategoryName': this.expenseCategoryForm.expenseCategoryName
            }
          }
          saveExpenseCategory(query).then(response => {
            console.log('updateDepartmentByPrimaryKey response: ')
            console.log(response)
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
          }).catch(error => {
            console.log('updateDepartmentByPrimaryKey error: ')
            console.log(error)
          })
        } else {
          console.log('invokeUpdate error!')
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-row {
    margin-bottom: 20px;

    /* &
    :last-child {
      margin-bottom: 0; */
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

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
