<template>
  <div class="app-container">
    <aside>科室管理</aside>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-radio-group v-model="departmentCategory" size="medium" @change="radioChangeGetList()">
          <el-radio-button label="所有科室" />
          <el-radio-button label="临床科室" />
          <el-radio-button label="医技科室" />
          <el-radio-button label="其他科室" />
        </el-radio-group>
        <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;float:right" type="primary" icon="document" @click="handleDownload">
          导出 Excel
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消所选</el-button>
        <el-button @click="addDepartmentDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      </el-col>
    </el-row>
    <div class="grid-content bg-purple-light">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="departmentTableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />

        <el-table-column
          prop="departmentCode"
          label="科室编码"
        />
        <el-table-column
          prop="departmentName"
          label="科室名称"
        />
        <el-table-column
          prop="category"
          label="科室分类"
        />
        <el-table-column
          prop="edit"
          label="编辑"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editDepartmentFormFunction(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
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
    </div>
    <!--新增科室的对话框-->
    <el-dialog
      title="新增科室"
      :visible.sync="addDepartmentDialogVisible"
      width="30%"
    >
      <el-form ref="departmentForm" :model="departmentForm" :rules="rules">
        <el-form-item label="科室编码" prop="departmentCode">
          <el-input v-model="departmentForm.departmentCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="departmentForm.departmentName" auto-complete="off" />
        </el-form-item>
        <el-form-item v-model="departmentForm.category" label="科室分类" prop="category">
          <!--新增科室对话框中，选择科室分类-->
          <template>
            <el-select
              v-model="selectValue"
              filterable
              placeholder="请选择"
              @change="forceChange"
            >
              <el-option
                v-for="item in departmentConstant"
                :key="item.constantItemId"
                :label="item.constantName"
                :value="item.constantItemId"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('departmentForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改科室的对话框-->
    <el-dialog
      title="修改科室"
      :visible.sync="editDepartmentDialogVisible"
      width="30%"
    >
      <el-form ref="editDepartmentForm" :model="editDepartmentForm" :rules="rules">
        <el-form-item label="科室ID" prop="departmentId">
          <el-input v-model="editDepartmentForm.departmentId" auto-complete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="科室编码" prop="departmentCode">
          <el-input v-model="editDepartmentForm.departmentCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="editDepartmentForm.departmentName" auto-complete="off" />
        </el-form-item>
        <el-form-item v-model="editDepartmentForm.category" label="科室分类" prop="category">
          <!--新增科室对话框中，选择科室分类-->
          <template>
            <el-select
              v-model="selectEditValue"
              filterable
              placeholder="请选择"
              @change="forceChange"
            >
              <el-option
                v-for="item in departmentConstant"
                :key="item.constantItemId"
                :label="item.constantName"
                :value="item.constantItemId"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDepartmentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate('editDepartmentForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchConstantDepartmentMap } from '../../api/constItem'
import {
  addDepartment,
  deleteDepartmentByPrimaryKey,
  fetchDepartmentList,
  updateDepartmentByPrimaryKey
} from '../../api/basicInfo/department'

export default {
  data() {
    return {
      downloadLoading: false,
      // 单选框
      departmentCategory: '所有科室',
      alls: [11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      fronts: [11, 12, 14, 15, 16, 17, 18, 19],
      techs: [27],
      others: [29],

      clinical_department_checked: true, // 临床科室多选框
      technology_department_checked: true, // 医技科室多选框
      other_department_checked: true, // 其他科室多选框

      departmentTableData: [], // 科室表格数据
      departmentConstant: [{
        constantItemId: '',
        constantTypeId: '',
        constantCode: '',
        constantName: '',
        valid: null
      }],
      // departmentConstant: [],// 科室数据常量，是 科室类别编号 到 科室类别名称 的映射
      listLoading: false, // 科室列表加载状态
      selectValue: '',
      addDepartmentDialogVisible: false, // 新增科室对话框可见
      departmentForm: { // 科室信息表单
        departmentCode: '',
        departmentName: '',
        category: ''
      },
      // 提交验证
      rules: {
        departmentCode: [
          { required: true, message: '请输入科室编码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,
      // 用于修改科室
      editDepartmentDialogVisible: false,
      editDepartmentForm: { // 科室信息表单
        departmentId: '',
        departmentCode: '',
        departmentName: '',
        category: ''
      },
      selectEditValue: '',
      // 用于删除科室
      multipleSelection: [],
      department_id_list: [],
      department_id: []
    }
  },

  created() {
    this.getDepartmentList()
  },

  methods: {
    radioChangeGetList() {
      // this.$message(this.departmentCategory)
      this.queryDepartmentListWithPage()
    },
    forceChange(val) {
      this.$set(this.departmentForm, 'category', val)
      this.$set(this.editDepartmentForm, 'category', val)
    },
    getDepartmentList() {
      this.query = { 'constant_type_code': 'DeptCategory' }
      fetchConstantDepartmentMap(this.query).then(response => { // 首先获取科室信息常量表，用于将科室类别的常数表示替换为文字
        console.log('fetchConstantDepartmentMap response: ')
        console.log(response)
        this.departmentConstant = response.data

        this.listLoading = true // 列表开始加载
        this.query = {
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'departmentCategory': this.alls
        }
        fetchDepartmentList(this.query).then(response => { // 然后获取科室信息列表
          console.log('fetchDepartmentList response: ')
          console.log(response)
          this.totalNumber = response.data.total
          // response.data 对应 PageInfo<Department>
          this.departmentTableData = response.data.list

          let i = 0
          const departmentTableDataLen = this.departmentTableData.length
          const departmentConstantLen = this.departmentConstant.length
          for (; i < departmentTableDataLen; ++i) {
            for (let j = 0; j < departmentConstantLen; ++j) {
              if (this.departmentConstant[j].constantItemId === this.departmentTableData[i].category) {
                this.departmentTableData[i].category = this.departmentConstant[j].constantName
                break
              }
            }
          }
          this.listLoading = false // 列表加载完成
        }).catch(error => {
          console.log('fetchDepartmentList error: ')
          console.log(error)
        })
      }
      ).catch(error => {
        console.log('fetchConstantDepartmentMap error: ')
        console.log(error)
      })
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
    // 分页
    queryDepartmentListWithPage() {
      this.listLoading = true // 列表开始加载
      var list
      if (this.departmentCategory === '所有科室') {
        list = this.alls
      } else if (this.departmentCategory === '临床科室') {
        list = this.fronts
      } else if (this.departmentCategory === '医技科室') {
        list = this.techs
      } else if (this.departmentCategory === '其他科室') {
        list = this.others
      }
      console.log(list)
      this.query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize,
        'departmentCategory': list
      }
      fetchDepartmentList(this.query).then(response => { // 然后获取科室信息列表
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.totalNumber = response.data.total
        // response.data 对应 PageInfo<Department>
        this.departmentTableData = response.data.list

        const departmentTableLen = this.departmentTableData.length
        const departmentConstantLen = this.departmentConstant.length
        for (let i = 0; i < departmentTableLen; ++i) {
          for (let j = 0; j < departmentConstantLen; ++j) {
            if (this.departmentConstant[j].constantItemId === this.departmentTableData[i].category) {
              this.departmentTableData[i].category = this.departmentConstant[j].constantName
              break
            }
          }
        }
        this.listLoading = false // 列表加载完成
      }).catch(error => {
        console.log('fetchDepartmentList error: ')
        console.log(error)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.queryDepartmentListWithPage()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.queryDepartmentListWithPage()
    },
    handleClose() {
      this.$message('取消新建条目')
    },
    submitAdd(formName) {
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
        this.department_id_list = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.department_id_list.push(this.multipleSelection[i].departmentId)
        }
        this.department_id_list = { 'department_id_list': this.department_id_list }
        /**
           * 按主键删除科室信息的请求
           */
        deleteDepartmentByPrimaryKey(this.department_id_list).then(response => {
          console.log('deleteDepartmentByPrimaryKey response: ')
          console.log(response)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        }).catch(error => {
          console.log('deleteDepartmentByPrimaryKey error: ')
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
    },
    editDepartmentFormFunction(index, row) {
      this.editDepartmentDialogVisible = true
      this.editDepartmentForm.departmentName = row.departmentName
      this.editDepartmentForm.departmentCode = row.departmentCode
      this.editDepartmentForm.category = row.category
      this.selectEditValue = row.category
      this.editDepartmentForm.departmentId = row.departmentId
    },
    submitUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editDepartmentDialogVisible = false
          // this.departmentForm.category =
          // console.log(this.departmentForm);

          for (let i = 0; i < this.departmentConstant.length; ++i) {
            if (this.editDepartmentForm.category === this.departmentConstant[i].constantName) { this.editDepartmentForm.category = this.departmentConstant[i].constantItemId }
          }

          var updateList = {
            'departmentId': this.editDepartmentForm.departmentId,
            'category': this.editDepartmentForm.category,
            'departmentCode': this.editDepartmentForm.departmentCode,
            'departmentName': this.editDepartmentForm.departmentName
          }

          updateDepartmentByPrimaryKey(updateList).then(response => {
            console.log('updateDepartmentByPrimaryKey response: ')
            console.log(response)

            this.$refs['editDepartmentForm'].resetFields()
            this.selectEditValue = ''
            this.queryDepartmentListWithPage()
          }).catch(error => {
            console.log('updateDepartmentByPrimaryKey error: ')
            console.log(error)
          })
        } else {
          console.log('error updateDepartmentByPrimaryKey!!')
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['科室编码', '科室名称', '科室分类']
        const filterVal = ['departmentCode', 'departmentName', 'category']
        const list = this.departmentTableData
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
