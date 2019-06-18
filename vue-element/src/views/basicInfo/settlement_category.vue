<template>
  <div class="app-container">
    <aside>
      结算类别管理
    </aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消</el-button>
        <el-button @click="addSettlementCategoryDataDialogVisible = true">新增</el-button>
        <el-button @click="true">删除</el-button>
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
        />
        <el-table-column
          prop="settlementCategoryName"
          label="结算类别名称"
        />
        <el-table-column
          label="是否有效"
          prop="ifValid"
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
      <!--新增结算类别对话框-->
      <el-dialog
        title="新增结算类别"
        :visible.sync="addSettlementCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="addSettlementCategoryForm" :model="addSettlementCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="结算类别编码" prop="settlementCategoryId">
            <el-input v-model="addSettlementCategoryForm.settlementCategoryId" auto-complete="off" />
          </el-form-item>
          <el-form-item label="结算类别名称" prop="settlementCategoryName">
            <el-input v-model="addSettlementCategoryForm.settlementCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否有效" prop="ifValid_Add">
            <el-radio v-model="ifValidRadio_Add" label="1">是</el-radio>
            <el-radio v-model="ifValidRadio_Add" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearAddSettlementCategoryDataDialog">取 消</el-button>
          <el-button type="primary" @click="submitAdd('userForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改结算类别对话框-->
      <el-dialog
        title="修改结算类别"
        :visible.sync="editSettlementCategoryDataDialogVisible"
        width="30%"
      >
        <el-form ref="editSettlementCategoryForm" :model="editSettlementCategoryForm" :rules="rules" label-position="top">
          <el-form-item label="结算类别编码" prop="settlementCategoryId">
            <el-input v-model="editSettlementCategoryForm.settlementCategoryId" auto-complete="off" />
          </el-form-item>
          <el-form-item label="结算类别名称" prop="settlementCategoryName">
            <el-input v-model="editSettlementCategoryForm.settlementCategoryName" auto-complete="off" />
          </el-form-item>
          <el-form-item label="是否有效" prop="ifValid">
            <el-radio v-model="ifValidRadio" label="1">是</el-radio>
            <el-radio v-model="ifValidRadio" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editSettlementCategoryDataDialogVisible = false">取 消</el-button>
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
      listLoading: false, // 加载表格
      ifValidRadio_Add: '', // 新增表单的单选器
      ifValidRadio: '', // 编辑表单的单选器
      addSettlementCategoryDataDialogVisible: false, //  新增表单可见
      // 新增表单
      addSettlementCategoryForm: {
        settlementCategoryId: '',
        settlementCategoryName: '',
        ifValid_Add: ''
      },
      editSettlementCategoryDataDialogVisible: false, // 修改表单可见
      // 修改表单
      editSettlementCategoryForm: {
        settlementCategoryId: '',
        settlementCategoryName: '',
        ifValid: ''
      },
      rules: {
        settlementCategoryId: [
          { required: true, message: '请输入结算类别编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        settlementCategoryName: [
          { required: true, message: '请输入结算类别名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      },
      settlementCategoryForm: [{
        settlementCategoryId: '1',
        settlementCategoryName: '自费',
        ifValid: '1'
      },
      {
        settlementCategoryId: '2',
        settlementCategoryName: '医疗保险',
        ifValid: '1'
      },
      {
        settlementCategoryId: '3',
        settlementCategoryName: '新型农村合作医疗',
        ifValid: '1'
      }
      ]
    }
  },
  methods: {
    editSettlementCategoryFormFunction(index, row) {
      this.editSettlementCategoryDataDialogVisible = true
      this.editSettlementCategoryForm.settlementCategoryId = row.settlementCategoryId
      this.editSettlementCategoryForm.settlementCategoryName = row.settlementCategoryName
      if (row.ifValid === '是') {
        this.ifValidRadio = '2'
      } else {
        this.ifValidRadio = '1'
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
    clearAddSettlementCategoryDataDialog() {
      this.addSettlementCategoryDataDialogVisible = false
      this.$refs['addSettlementCategoryForm'].resetFields()
    }
  }
}
</script>
