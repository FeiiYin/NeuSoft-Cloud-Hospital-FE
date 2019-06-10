<template>
  <div class="app-container">
    <aside>科室管理</aside>

    <el-row>
      <el-col :span="18">
        <el-checkbox-group size="medium">
          <el-checkbox-button :checked="clinical_department_checked">临床科室</el-checkbox-button>
          <el-checkbox-button :checked="technology_department_checked">医技科室</el-checkbox-button>
          <el-checkbox-button :checked="other_department_checked">其他科室</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
      <el-col :span="6">
        <el-button @click="toggleSelection()">取消</el-button>
        <el-button @click="addDepartmentDialogVisible = true">新增</el-button>
        <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      </el-col>
    </el-row>
    <div class="grid-content bg-purple-light">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="departmentTableData"
        border
      >
        <el-table-column type="selection"  />

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
        <!--            <el-table-column-->
        <!--              prop="type"-->
        <!--              label="科室类别"-->
        <!--            />-->
        <el-table-column
          prop="edit"
          label="编辑"
        >
          <!--todo 编辑每项科室信息的按钮-->
        </el-table-column>
      </el-table>
      <div class="block">
      
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber">
      </el-pagination>
    </div>
    </div>
    <!--新增科室的对话框-->
    <el-dialog
      title="新增科室"
      :visible.sync="addDepartmentDialogVisible"
      width="30%"
    >
      <el-form :model="departmentForm">
        <el-form-item label="科室编码" >
          <el-input v-model="departmentForm.departmentCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="科室名称" >
          <el-input v-model="departmentForm.departmentName" auto-complete="off" />
        </el-form-item>
        <el-form-item v-model="departmentForm.category" label="科室分类" >
          <!--新增科室对话框中，选择科室分类-->
          <!--todo 科室分类的选择器-->
          <template>
            <el-select
              v-model="selectValue"
              filterable
              placeholder="请选择"
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
        <el-button type="primary" @click="addDepartment()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchConstantMap} from '../../api/constItem'
  import {fetchDepartmentList} from '../../api/basicInfo/department'

  export default {
  data() {
    return {
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
      
      // 分页
      currentPage: 1, // 当前页码
      pageSize: 50, // 页码大小
      totalNumber: 0,
    }
  },

  created() {
    this.getDepartmentList()
  },

  methods: {
    testShow() {
      var str = ''

      this.$notify({
        title: '成功',
        message: this.departmentConstant,
        type: 'success'
      })
    },
    forceChange(val) {
      this.$set(this.departmentForm, 'category', val)
    },
    getDepartmentList() {
      this.query = { 'constant_type_code': 'DeptCategory' }
      fetchConstantMap(this.query).then(response => { // 首先获取科室信息常量表，用于将科室类别的常数表示替换为文字
        console.log('fetchConstantMap response: ')
        console.log(response)
        this.departmentConstant = response.data
       
        this.listLoading = true // 列表开始加载
        this.query = { 'current_page': this.currentPage, 'page_size': this.pageSize }
        fetchDepartmentList(this.query).then(response => { // 然后获取科室信息列表
          console.log('fetchDepartmentList response: ')
          console.log(response)
          this.totalNumber = response.data.total;
          // response.data 对应 PageInfo<Department>
          this.departmentTableData = response.data.list

          let i = 0
          const len = this.departmentTableData.length
          for (; i < len; i++) {
            for (var j = 0; j < this.departmentConstant.length; ++j) {
              if (this.departmentConstant[j].constantItemId == this.departmentTableData[i].category) {
                this.departmentTableData[i].category = this.departmentConstant[j].constantName
                break;
              }
            }
            // this.departmentTableData[i].category = this.departmentConstant[this.departmentTableData[i].category]
            // _this.$set(_this.departmentForm)
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
      this.query = { 'current_page': this.currentPage, 'page_size': this.pageSize }
      fetchDepartmentList(this.query).then(response => { // 然后获取科室信息列表
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.totalNumber = response.data.total;
        // response.data 对应 PageInfo<Department>
        this.departmentTableData = response.data.list

        let i = 0
        const len = this.departmentTableData.length
        for (; i < len; i++) {
          for (var j = 0; j < this.departmentConstant.length; ++j) {
            if (this.departmentConstant[j].constantItemId == this.departmentTableData[i].category) {
              this.departmentTableData[i].category = this.departmentConstant[j].constantName
              break;
            }
          }
          // this.departmentTableData[i].category = this.departmentConstant[this.departmentTableData[i].category]
          // _this.$set(_this.departmentForm)
        }
        this.listLoading = false // 列表加载完成
      }).catch(error => {
        console.log('fetchDepartmentList error: ')
        console.log(error)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.queryDepartmentListWithPage();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryDepartmentListWithPage();
    },
    handleClose() {
      this.$message('取消新建条目');
    },
    addDepartment() {
      addDepartmentDialogVisible = false;
      
    },
    openConfirmDeleteMessageBox() {
      
      this.$confirm('此操作将永久删除这些条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
