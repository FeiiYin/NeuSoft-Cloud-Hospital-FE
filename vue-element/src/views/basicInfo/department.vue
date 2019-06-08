<template>
  <div style="padding:1%;" class="app-container">
    <aside>科室管理</aside>

    <el-row>
      <el-col :span="3">
        <div class="grid-content bg-purple">
          <el-checkbox v-model="clinical_department_checked">临床科室</el-checkbox>
          <el-checkbox v-model="technology_department_checked">医技科室</el-checkbox>
          <el-checkbox v-model="other_department_checked">其他科室</el-checkbox>
        </div>

      </el-col>

      <el-col :span="21">
        <el-row>
          <el-button @click="toggleSelection()">取消</el-button>
          <el-button @click="addDepartmentDialogVisible = true">新增</el-button>
          <el-button>删除</el-button>
        </el-row>
        <div class="grid-content bg-purple-light">
          <el-table
            v-loading="listLoading"
            :data="departmentTableData"
            height="250"
            border
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />

            <el-table-column
              prop="departmentCode"
              label="科室编码"
              width="150"
            />
            <el-table-column
              prop="departmentName"
              label="科室名称"
              width="150"
            />
            <el-table-column
              prop="category"
              label="科室分类"
              width="150"
            />
            <!--            <el-table-column-->
            <!--              prop="type"-->
            <!--              label="科室类别"-->
            <!--            />-->
            <el-table-column
              prop="edit"
              label="编辑"
              width="50"
            >
              <!--编辑 按钮-->
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          title="新增科室"
          :visible.sync="addDepartmentDialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form :model="departmentForm">
            <el-form-item label="科室编码" :label-width="formLabelWidth">
              <el-input v-model="departmentForm.departmentCode" auto-complete="off" />
            </el-form-item>
            <el-form-item label="科室名称" :label-width="formLabelWidth">
              <el-input v-model="departmentForm.departmentName" auto-complete="off" />
            </el-form-item>
            <el-form-item label="科室分类" :label-width="formLabelWidth">
              <el-dropdown>
                <el-button type="primary">
                  请选择<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!--科室分类的下拉菜单-->
                  <!--todo-->
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDepartmentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDepartmentDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { fetchConstantMap } from '../../api/constItem'
import { fetchDepartmentList } from '../../api/basicInfo/department'

export default {
  data() {
    return {
      clinical_department_checked: true, // 临床科室多选框
      technology_department_checked: true, // 医技科室多选框
      other_department_checked: true, // 其他科室多选框
      departmentTableData: [], // 科室表格数据
      departmentConstant: [], // 科室数据常量
      listLoading: false, // 科室列表加载状态
      addDepartmentDialogVisible: false, // 新增科室对话框可见
      departmentForm: { // 科室信息表单
        departmentCode: '',
        departmentName: '',
        category: ''
      }
    }
  },

  created() {
    this.getDepartmentList()
  },

  methods: {
    getDepartmentList() {
      this.query = { 'constant_type_code': 'DeptCategory' }
      fetchConstantMap(this.query).then(response => {
        console.log('fetchConstantMap response: ')
        console.log(response)
        this.departmentConstant = response.data
        this.listLoading = true
        fetchDepartmentList().then(response => {
          console.log('fetchDepartmentList response: ')
          console.log(response)
          this.departmentTableData = response.data

          let i = 0
          const len = this.departmentTableData.length
          for (; i < len; i++) {
            this.departmentTableData[i].category = this.departmentConstant[this.departmentTableData[i].category]
          }
          this.listLoading = false // 列表加载完成
        }).catch(error => {
          console.log('fetchDepartmentList error: ')
          console.log(error)
        })
      }
      ).catch(error => {
        console.log('fetchConstantMap error: ')
        console.log(error)
      })
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

  &
  :last-child {
    margin-bottom: 0;
  }

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
