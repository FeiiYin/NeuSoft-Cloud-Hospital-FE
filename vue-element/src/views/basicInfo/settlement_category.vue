<template>
  <div class="app-container">
    <aside>
      结算类别管理
    </aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addSettlementCategoryDataDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox">删除</el-button>
      </el-col>
    </el-row>
    <div class="gird-content bg-purple-light">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="settlementCategoryForm"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35px"
        />
        <el-table-column
          prop="settlementCategoryId"
          label="结算类别编码"
          v-if="1 === 0"
        />
        <el-table-column
          prop="settlementCategoryName"
          label="结算类别名称"
        />
        <el-table-column
          label="是否有效"
          prop="ifValid"
          v-if="1 === 0"
        />
        <el-table-column
          prop="edit"
          label="编辑"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editSettlementCategoryFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div style="height:30px;" />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
      />
      <!--新增结算类别对话框-->
      <el-dialog
        title="新增结算类别"
        :visible.sync="addSettlementCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="addSettlementCategoryForm" :model="addSettlementCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="结算类别名称" prop="settlementCategoryName">
            <el-input v-model="addSettlementCategoryForm.settlementCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否有效" prop="ifValid" v-if="1 === 0">
            <el-radio v-model="ifValidRadio" label=1>是</el-radio>
            <el-radio v-model="ifValidRadio" label=0>否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearAddSettlementCategoryDataDialog">取 消</el-button>
          <el-button type="primary" @click="submitAddSettlementCategory('addSettlementCategoryForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改结算类别对话框-->
      <el-dialog
        title="修改结算类别"
        :visible.sync="editSettlementCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="editSettlementCategoryForm" :model="editSettlementCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="结算类别编码" prop="settlementCategoryId" v-if="1 === 0">
            <el-input v-model="editSettlementCategoryForm.settlementCategoryId" auto-complete="off" :disabled="true"/>
          </el-form-item>
          <el-form-item label="结算类别名称" prop="settlementCategoryName">
            <el-input v-model="editSettlementCategoryForm.settlementCategoryName" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editSettlementCategoryDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdateSettlementCategory('editSettlementCategoryForm')">确 定 修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { fecthSettlementCategory, addSettlementCategory, updateSettlementCategory, deleteSettlementCategoryByPrimaryKey } from '../../api/basicInfo/settlement_category'
export default {
  data() {
    return {
      listLoading: false, // 加载表格
      ifValidRadio: '', // 编辑表单的单选器
      addSettlementCategoryDataDialogVisible: false, //  新增表单可见
      // 新增表单
      addSettlementCategoryForm: {
        settlementCategoryName: ''
      },
      editSettlementCategoryDataDialogVisible: false, // 修改表单可见
      // 修改表单
      editSettlementCategoryForm: {
        settlementCategoryId: -1,
        settlementCategoryName: ''
      },
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,
      multipleSelection: [],
      rules: {
        settlementCategoryName: [
          { required: true, message: '请输入结算类别名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      },
      settlementCategoryForm: [{
        settlementCategoryId: '1',
        settlementCategoryName: '自费',
        ifValid: '是'
      },
      {
        settlementCategoryId: '2',
        settlementCategoryName: '医疗保险',
        ifValid: '是'
      },
      {
        settlementCategoryId: '3',
        settlementCategoryName: '新型农村合作医疗',
        ifValid: '否'
      }
      ]
    }
  }, created() {
    this.getSettlementCategoryList()
  },
  methods: {
    editSettlementCategoryFormFunction(index, row) {
      this.editSettlementCategoryDataDialogVisible = true
      this.editSettlementCategoryForm.settlementCategoryId = row.settlementCategoryId
      this.editSettlementCategoryForm.settlementCategoryName = row.settlementCategoryName
    //   if (row.ifValid === '是') {
    //     this.ifValidRadio = '1'
    //   } else {
    //     this.ifValidRadio = '0'
    //   }
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
      console.log('handle de 值是', val)
    },
    clearAddSettlementCategoryDataDialog() {
      this.addSettlementCategoryDataDialogVisible = false
      this.$refs['addSettlementCategoryForm'].resetFields()
    },
    getSettlementCategoryList() {
      console.log('加载收费项目管理')
      this.query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      }
      fecthSettlementCategory(this.query).then(response => {
        this.settlementCategoryForm = response.data.list
        this.totalNumber = response.data.list.length
        console.log('s,g 返回数据', response)
      }).catch(error => {
        console.log('fetchSettlementCategory error:   ', error)
      })
    },
    submitAddSettlementCategory(formName) {
      // this.$set(this.$refs[formName], 'ifValid', 1)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSettlementCategoryDataDialogVisible = false
          addSettlementCategory(this.addSettlementCategoryForm).then(response => {
            console.log('add SettlementCategory successfully')
            console.log(response)
            this.$refs[formName].resetFields()
            this.getSettlementCategoryList()
          })
        } else {
          console.log('error 增加SettlementCategory vue')
        }
      })
    },
    submitUpdateSettlementCategory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editSettlementCategoryDataDialogVisible = false
          console.log('update：传的参数', this.editSettlementCategoryForm)
          updateSettlementCategory(this.editSettlementCategoryForm).then(response => {
            console.log('update SettlementCategory success')
            console.log(response)
            this.getSettlementCategoryList()
          }).catch(error => {
            console.log('update wrong maybe js:  ', error)
          })
        } else {
          console.log('valid failed')
        }
      })
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
        this.settlementCategoryList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.settlementCategoryList.push(this.multipleSelection[i].settlementCategoryId)
        }
        this.settlementCategoryList = { 'settlementCategoryIdList': this.settlementCategoryList }
        console.log('settleMentCategory 的list 是', this.settlementCategoryList)
        /**
         * 按主键删除结算类别信息的请求
         */
        deleteSettlementCategoryByPrimaryKey(this.settlementCategoryList).then(response => {
          console.log('deleteSettlementCategoryByPrimaryKey response: ')
          console.log(response)
          this.$message({
            type: 'success',
            message: '已删除'
          })
          this.getSettlementCategoryList()
        }).catch(error => {
          console.log('deleteSettlementCategoryByPrimaryKey error: ')
          console.log(error)
          this.$message.error('删除失败')
        })
        this.currentPage = 1
        this.queryDepartmentListWithPage()
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
