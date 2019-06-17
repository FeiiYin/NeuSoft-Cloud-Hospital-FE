<template>
  <div class="app-container">
    <aside>非药品收费项目管理</aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="20">
        <el-button @click="true">导入</el-button>
        <el-button @click="true">导出</el-button>
        <el-button @click="toggleSelection()">取消</el-button>
        <el-button @click="addChargeItemDataDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      </el-col>
    </el-row>
    <div>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="chargeItemTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40px"
        />
        <el-table-column
          prop="chargeItemCode"
          label="编号"
        />
        <el-table-column
          prop="chargeItemName"
          label="名称"
        />
        <el-table-column
          prop="chargeItemSpecification"
          label="规格"
        />
        <el-table-column
          prop="chargeItemPrice"
          label="价格(元)"
        />
        <el-table-column
          prop="chargeItemExpenseCategoryId"
          label="所属费用科目编号"
        />
        <el-table-column
          prop="chargeItemDepartmentId"
          label="收费科室编号"
        />
        <el-table-column
          prop="chargeItemChargeType"
          label="项目类型"
        />
        <el-table-column
          prop="chargeItemCreationTime"
          label="创建时间"
        />
        <el-table-column
          prop="chargeItemPinYin"
          label="收费项目拼音"
        />
        <el-table-column
          prop="edit"
          label="编辑"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editChargeItemDataFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
          :current-page="current_Page"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
        />
      </div>
    </div>
    <!--新增非药品收费项目-->
    <el-dialog
      title="新增非药品收费项目"
      :visible.sync="addChargeItemDataDialogVisible"
      width="30%"
    >
      <el-form ref="addChargeItemForm" :model="addChargeItemForm" :rules="rules" label-position="top">
        <el-form-item label="编号" prop="chargeItemCode">
          <el-input v-model="addChargeItemForm.chargeItemCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="名称" prop="chargeItemName">
          <el-input v-model="addChargeItemForm.chargeItemName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="规格" prop="chargeItemSpecification">
          <el-input v-model="addChargeItemForm.chargeItemSpecification" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格" prop="chargeItemPrice">
          <el-input v-model="addChargeItemForm.chargeItemPrice" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属费用科目编号" prop="chargeItemExpenseCategoryId">
          <el-input v-model="addChargeItemForm.chargeItemExpenseCategoryId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="收费科室编号" prop="chargeItemDepartmentId">
          <el-input v-model="addChargeItemForm.chargeItemDepartmentId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="项目类型" prop="chargeItemChargeType_Add">
          <el-radio-group v-model="ChargeTypeRadio_Add">
            <el-radio :label="3">1</el-radio>
            <el-radio :label="6">2</el-radio>
            <el-radio :label="9">3</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--新增收费项目中的日期选择器-->
        <el-form-item label="创建时间" prop="chargeItemCreationTime">
          <div class="block">
            <el-date-picker
              v-model="value_Add"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerTime"
            />
          </div>
        </el-form-item>
        <el-form-item label="收费项目拼音" prop="chargeItemPinYin">
          <el-input v-model="addChargeItemForm.chargeItemPinYin" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addChargeItemDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('userForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改收费项目-->
    <el-dialog
      title="修改收费项目信息"
      :visible.sync="editChargeItemDataDialogVisible"
      width="30%"
    >
      <el-form ref="editChargeItemForm" :model="editChargeItemForm" :rules="rules" label-position="top">
        <el-form-item label="编号" prop="chargeItemCode">
          <el-input v-model="editChargeItemForm.chargeItemCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="名称" prop="chargeItemName">
          <el-input v-model="editChargeItemForm.chargeItemName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="规格" prop="chargeItemSpecification">
          <el-input v-model="editChargeItemForm.chargeItemSpecification" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格" prop="chargeItemPrice">
          <el-input v-model="editChargeItemForm.chargeItemPrice" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属费用科目编号" prop="chargeItemExpenseCategoryId">
          <el-input v-model="editChargeItemForm.chargeItemExpenseCategoryId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="收费科室编号" prop="chargeItemDepartmentId">
          <el-input v-model="editChargeItemForm.chargeItemDepartmentId" auto-complete="off" />
        </el-form-item>
        <el-form-item label="项目类型" prop="chargeItemChargeType">
          <el-radio-group v-model="ChargeTypeRadio">
            <el-radio label="3">1</el-radio>
            <el-radio label="6">2</el-radio>
            <el-radio label="9">3</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间" prop="chargeItemCreationTime">
          <div class="block">
            <el-date-picker
              v-model="value"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerTime"
            />
          </div>
        </el-form-item>
        <el-form-item label="收费项目拼音" prop="chargeItemPinYin">
          <el-input v-model="editChargeItemForm.chargeItemPinYin" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editChargeItemDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate('editChargeItemForm')">确 定 修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      listLoading: false, // 收费项目列表加载状态
      // 分页
      current_Page: 1,
      pageSize: 50,
      totalNumber: 1,
      addChargeItemDataDialogVisible: false, // 新增收费项目表单可见
      // 新增收费项目
      addChargeItemForm: [{
        chargeItemCode: '',
        chargeItemName: '',
        chargeItemSpecification: '',
        chargeItemPrice: '',
        chargeItemExpenseCategoryId: '',
        chargeItemDepartmentId: '',
        chargeItemChargeType_Add: '',
        chargeItemCreationTime: '',
        chargeItemPinYin: ''
      }],
      ChargeTypeRadio_Add: '',
      ChargeTypeRadio: '',
      // 新增收费项目表单中的时间选择器
      pickerTime: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value: '',
      value_Add: '',
      // 修改收费项目信息
      editChargeItemDataDialogVisible: false, // 修改收费项目表单可见
      // 修改收费项目表单
      editChargeItemForm: [{
        chargeItemCode: '',
        chargeItemName: '',
        chargeItemSpecification: '',
        chargeItemPrice: '',
        chargeItemExpenseCategoryId: '',
        chargeItemDepartmentId: '',
        chargeItemChargeType: '',
        chargeItemCreationTime: '',
        chargeItemPinYin: ''
      }],
      // 提交验证
      rules: {
        chargeItemCode: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemSpecification: [
          { required: true, message: '请输入规格', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemExpenseCategoryId: [
          { required: true, message: '请输入所属费用科目编号', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemDepartmentId: [
          { required: true, message: '请输入收费科室编号', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        chargeItemPinYin: [
          { required: true, message: '请输入收费项目的拼音', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      // 收费项目表格数据
      chargeItemTableData: [{
        chargeItemCode: '120200001',
        chargeItemName: '大抢救',
        chargeItemSpecification: '日',
        chargeItemPrice: '200',
        chargeItemExpenseCategoryId: '16',
        chargeItemDepartmentId: '133',
        chargeItemChargeType: '3',
        chargeItemCreationTime: '2019-03-01',
        chargeItemPinYin: 'DQJ'
      },
      {
        chargeItemCode: '120200002',
        chargeItemName: '中抢救',
        chargeItemSpecification: '日',
        chargeItemPrice: '150',
        chargeItemExpenseCategoryId: '16',
        chargeItemDepartmentId: '133',
        chargeItemChargeType: '3',
        chargeItemCreationTime: '2019-03-01',
        chargeItemPinYin: 'ZQJ'
      },
      {
        chargeItemCode: '210103011',
        chargeItemName: 'X清抗谷氨酸脱J酶抗体测定（各种免疫X方法）',
        chargeItemSpecification: '单侧',
        chargeItemPrice: '50',
        chargeItemExpenseCategoryId: '3',
        chargeItemDepartmentId: '125',
        chargeItemChargeType: '2',
        chargeItemCreationTime: '2019-03-01',
        chargeItemPinYin: 'XQKGASTJMKTCD（GZMYXFF）'
      }
      ]
    }
  },
  methods: {
    editChargeItemDataFormFunction(index, row) {
      this.editChargeItemDataDialogVisible = true
      this.editChargeItemForm.chargeItemCode = row.chargeItemCode
      this.editChargeItemForm.chargeItemName = row.chargeItemName
      this.editChargeItemForm.chargeItemSpecification = row.chargeItemSpecification
      this.editChargeItemForm.chargeItemPrice = row.chargeItemPrice
      this.editChargeItemForm.chargeItemExpenseCategoryId = row.chargeItemExpenseCategoryId
      this.editChargeItemForm.chargeItemDepartmentId = row.chargeItemDepartmentId
      this.editChargeItemForm.chargeItemCreationTime = row.chargeItemCreationTime
      this.value = row.chargeItemCreationTime
      if (row.chargeItemChargeType === '1') {
        this.ChargeTypeRadio = '3'
      }
      if (row.chargeItemChargeType === '2') {
        this.ChargeTypeRadio = '6'
      }
      if (row.chargeItemChargeType === '3') {
        this.ChargeTypeRadio = '9'
      }
      this.editChargeItemForm.chargeItemPinYin = row.chargeItemPinYin
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
