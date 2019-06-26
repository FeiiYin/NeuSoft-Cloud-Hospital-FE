<template>
  <div class="app-container">
    <aside>非药品收费项目管理</aside>

    <el-row style="margin-bottom: 20px">
      <el-col :span="20">
        <el-button @click="true">导入</el-button>
        <el-button @click="true">导出</el-button>
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addChargeItemDataDialogVisible = true; clearAddChargeItemDataDialog ">新增</el-button>
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
        <el-table-column prop="chargeItemId" label="收费项目id" v-if=false></el-table-column>
        <el-table-column
          prop="chargeItemCode"
          label="编号"
        />
        <el-table-column prop="nameZh" label="收费项目名"></el-table-column>
        <el-table-column
          prop="namePinyin"
          label="收费项目拼音"
        />
        <el-table-column
          prop="specification"
          label="规格"
        />
        <el-table-column
          prop="price"
          label="价格(元)"
        />
        <el-table-column
          prop="expenseCategoryId"
          label="所属费用科目编号"
          v-if=false
        />
        <el-table-column prop="expenseCategoryName" label="所属收费种类"></el-table-column>
        <el-table-column
          prop="departmentId"
          label="收费科室编号"
          v-if=false
        />
        <el-table-column prop="departmentName" label="收费科室"></el-table-column>
        <el-table-column
          prop="chargeType"
          label="项目类型id"
          v-if=false
        />
<!--        <el-table-column prop="chargeTypeName" label="项目类型"></el-table-column>-->
        <el-table-column
          prop="creationTime"
          label="创建时间"
          :formatter="dateFormat1"
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
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
        <el-form-item label="名称" prop="nameZh">
          <el-input v-model="addChargeItemForm.nameZh" auto-complete="off" />
        </el-form-item>
        <el-form-item label="收费项目拼音" prop="namePinyin">
          <el-input v-model="addChargeItemForm.namePinyin" auto-complete="off" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="addChargeItemForm.specification" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="addChargeItemForm.price" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属收费种类" prop="expenseCategoryId" v-model="addChargeItemForm.expenseCategoryId">
          <el-select v-model="selectEC" filterable placeholder="请选择收费种类" @change="changeEC">
            <el-option
              v-for="item in expenseCategoryList"
              :key="item.expenseCategoryId"
              :label="item.expenseCategoryName"
              :value="item.expenseCategoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收费科室" prop="departmentId" v-model="addChargeItemForm.departmentId">
          <el-select v-model="selectDep" filterable placeholder="请选择科室" @change="changeDep">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearAddChargeItemDataDialog">取 消</el-button>
        <el-button type="primary" @click="saveSchedulingRule1('addChargeItemForm')">确 定</el-button>
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
        <el-form-item label="名称" prop="nameZh">
          <el-input v-model="editChargeItemForm.nameZh" auto-complete="off" />
        </el-form-item>
        <el-form-item label="收费项目拼音" prop="namePinyin">
          <el-input v-model="editChargeItemForm.namePinyin" auto-complete="off" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="editChargeItemForm.specification" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格（元）" prop="price">
          <el-input v-model="editChargeItemForm.price" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属收费种类" prop="expenseCategoryId" v-model="editChargeItemForm.expenseCategoryId">
          <el-select v-model="selectEC" filterable placeholder="请选择收费种类" @change="changeEC">
            <el-option
              v-for="item in expenseCategoryList"
              :key="item.expenseCategoryId"
              :label="item.expenseCategoryName"
              :value="item.expenseCategoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收费科室" prop="departmentId" v-model="editChargeItemForm.departmentId">
          <el-select v-model="selectDep" filterable placeholder="请选择科室" @change="changeDep">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editChargeItemDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSchedulingRule2('editChargeItemForm')">确 定 修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { selectChargeItem, saveChargeItem, deleteChargeItem } from '../../api/basicInfo/charge_item'
import { fetchDepartmentList } from '../../api/basicInfo/department'
import moment from 'moment'
import { selectExpenseCategory } from '../../api/finance/expenseCategory'
export default {
  data: function() {
    return {
      selectEC: '',
      selectDep: '',
      listLoading: false, // 收费项目列表加载状态
      // 分页
      currentPage: 1,
      pageSize: 50,
      totalNumber: 1,
      addChargeItemDataDialogVisible: false, // 新增收费项目表单可见
      // 新增收费项目
      addChargeItemForm: {
        chargeItemCode: '123',
        departmentId: 6,
        expenseCategoryId: 5,
        namePinyin: '12333',
        nameZh: '123',
        price: '5',
        specification: '1234'
      },
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
      editChargeItemForm: {
        chargeItemId: '',
        chargeItemCode: '',
        nameZh: '',
        specification: '',
        price: '',
        expenseCategoryId: '',
        departmentId: '',
        namePinyin: ''
      },
      // 提交验证
      rules: {
        chargeItemCode: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        nameZh: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请输入规格', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个数字', trigger: 'blur' }
        ],
        expenseCategoryId: [
          { required: true, message: '请选择对应的收费类型', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择对应的科室', trigger: 'blur' }
        ],
        namePinyin: [
          { required: true, message: '请输入收费项目的拼音', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      // 收费项目表格数据
      chargeItemTableData: [],
      departmentIdList: [],
      departmentList: [],
      expenseCategoryList: [],
      chargeItemList: []
    }
  },
  created() {
    this.selectChargeItemV()
  },
  methods: {
    dateFormat1: function(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    editChargeItemDataFormFunction(index, row) {
      this.editChargeItemDataDialogVisible = true
      this.editChargeItemForm.chargeItemCode = row.chargeItemCode
      this.editChargeItemForm.chargeItemId = row.chargeItemId
      this.editChargeItemForm.namePinyin = row.namePinyin
      this.selectEC = row.expenseCategoryName
      this.editChargeItemForm.nameZh = row.nameZh
      this.editChargeItemForm.specification = row.specification
      this.editChargeItemForm.price = row.price + ''
      this.editChargeItemForm.expenseCategoryId = row.expenseCategoryId
      this.editChargeItemForm.departmentId = row.departmentId
      this.selectDep = row.departmentName
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
    clearAddChargeItemDataDialog() {
      this.addChargeItemDataDialogVisible = false
      this.$refs['addChargeItemForm'].resetFields()
    },
    changeDep(val) {
      this.$set(this.addChargeItemForm, 'departmentId', val)
      this.$set(this.editChargeItemForm, 'departmentId', val)
    },
    changeEC(val) {
      this.$set(this.addChargeItemForm, 'expenseCategoryId', val)
      this.$set(this.editChargeItemForm, 'expenseCategoryId', val)
    },
    // 增删改查, show info
    selectChargeItemV() {
      this.chargeItemTableData = []
      var query = {
        'currentPage': this.currentPage,
        'pageSize': 500
      }
      fetchDepartmentList(query).then(response => {
        this.departmentList = response.data.list
        response.data.list.map(value => {
          this.departmentIdList.push(value.departmentId)
        })
        console.log('dep list over')
        var query2 = {
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'departmentIdList': this.departmentIdList
        }
        selectChargeItem(query2).then(response => {
          response.data.list.map(value => {
            this.chargeItemTableData.push(JSON.parse(value))
          })
          this.totalNumber = response.data.list.length
        })
        selectExpenseCategory(query).then(response => {
          this.expenseCategoryList = response.data.list
        }).catch(error => {
          console.log('expense category wrong', error)
        })
      })
    },
    saveSchedulingRule1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addChargeItemDataDialogVisible = false
          saveChargeItem(this.addChargeItemForm).then(response => {
            this.addChargeItemForm = {}
            this.selectChargeItemV()
          }).catch(error => {
            console.log('add return wrong ', error)
          })
        }
      })
    },
    saveSchedulingRule2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editChargeItemDataDialogVisible = false
          saveChargeItem(this.editChargeItemForm).then(response => {
            this.selectChargeItemV()
          }).catch(error => {
            console.log('Update return wrong ', error)
          })
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
        this.chargeItemList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.chargeItemList.push(this.multipleSelection[i].chargeItemId)
        }
        this.chargeItemList = { 'chargeItemIdList': this.chargeItemList }
        console.log('List', this.chargeItemList)
        /**
         * 按主键删除用户信息的请求
         */
        deleteChargeItem(this.chargeItemList).then(response => {
          this.$message({
            type: 'success',
            message: '已删除'
          })
          this.selectChargeItemV()
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.selectChargeItemV()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.selectChargeItemV()
    },
  }
}
</script>
