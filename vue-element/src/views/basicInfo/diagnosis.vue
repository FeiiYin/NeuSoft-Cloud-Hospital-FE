<template>
  <div style="padding:1%;">
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <aside>疾病目录分类</aside>
          <template>
            <el-select v-model="searchDiseaseCategoryName" filterable placeholder="搜索选择疾病分类" @change="setDiseaseCategoryId">
              <el-option
                v-for="item in diseaseCategoryList"
                :key="item.diseaseCategoryId"
                :label="item.diseaseName"
                :value="item.diseaseCategoryId"
              />
              <!-- label 是显示的标签，value 是值-->
            </el-select>
            <template>
              <el-table
                :data="diseaseCategoryList"
                height="800"
                border
                style="width: 71%; color: #90caf9"
                @row-click="setDiseaseCategoryId1"
              >
                <el-table-column
                  prop="diseaseName"
                  label="疾病目录表"
                ></el-table-column>
              </el-table>
            </template>
          </template>
        </div>
      </el-col>

      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <aside>疾病目录列表</aside>

          <div style="margin-top: 20px; margin-left: 20px;">
            <el-button @click="toggleSelection()">取消选择</el-button>
            <!--新增疾病信息的按钮-->
            <el-button @click="dialogFormVisible = true">新增</el-button>
            <!--新增疾病信息的对话框-->
            <el-dialog title="新增" :visible.sync="dialogFormVisible">
              <!-- 新建疾病信息的表单 -->
              <el-form :model="diseaseForm" :rules="rules">
                <el-form-item label="疾病编码" :label-width="formLabelWidth" prop="diseaseIcd">
                  <el-input v-model="diseaseForm.diseaseIcd" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病名称" :label-width="formLabelWidth" prop="diseaseName">
                  <el-input v-model="diseaseForm.diseaseName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="拼音码" :label-width="formLabelWidth" prop="diseaseCode">
                  <el-input v-model="diseaseForm.diseaseCode" auto-complete="off" />
                </el-form-item>
                <el-form-item v-model="diseaseCategoryList" label="疾病所属种类" :label-width="formLabelWidth" prop="diseaseCategory">
                  <template>
                    <el-select v-model="selectEditValue1" filterable placeholder="请选择" @change="forceChangeCategory">
                      <el-option
                        v-for="item in diseaseCategoryList"
                        :key="item.diseaseCategoryId"
                        :label="item.diseaseName"
                        :value="item.diseaseCategoryId"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false; selectEditValue1 = ''">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false; submitAddDisease('diseaseForm')">确 定</el-button>
              </div>
            </el-dialog>

            <!--编辑疾病信息框-->
            <el-dialog title="编辑" :visible.sync="editDialogFormVisible" >

              <!-- 编辑疾病信息的表单 -->
              <el-form :model="editDiseaseForm" :rules="rules" ref="editDiseaseForm">
                <el-form-item label="疾病编码" :label-width="formLabelWidth" prop="diseaseIcd">
                  <el-input v-model="editDiseaseForm.diseaseIcd" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病名称" :label-width="formLabelWidth" prop="diseaseName">
                  <el-input v-model="editDiseaseForm.diseaseName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="拼音码" :label-width="formLabelWidth" prop="diseaseCode">
                  <el-input v-model="editDiseaseForm.diseaseCode" auto-complete="off" />
                </el-form-item>
                <el-form-item v-model="diseaseCategoryList" label="疾病所属种类" :label-width="formLabelWidth" prop="diseaseCategory">
                  <template>
                    <el-select v-model="selectEditValue2" filterable placeholder="请选择" @change="forceChangeCategory">
                      <el-option
                        v-for="item in diseaseCategoryList"
                        :key="item.diseaseCategoryId"
                        :label="item.diseaseName"
                        :value="item.diseaseCategoryId"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false; selectEditValue2 = ''">取 消</el-button>
                <el-button type="primary" @click="submitUpdateDisease('editDiseaseForm')">确 定</el-button>
              </div>
            </el-dialog>
            <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
          </div>

          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            highlight-current-row
            :data="diseaseTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >

            <el-table-column type="selection" width="55" />
            <el-table-colimn prop="diseaseId" v-if="1 === 0">
              <template slot-scope="scope">
                {{ scope.row.diseaseId }}
              </template>
            </el-table-colimn>
            <el-table-colimn prop="diseaseCategory" v-if="1 === 0">
              <template slot-scope="scope">
                {{ scope.row.diseaseCategory }}
              </template>
            </el-table-colimn>

            <el-table-column prop="diseaseIcd" label="疾病编码" width="150">
              <template slot-scope="scope">
                {{ scope.row.diseaseIcd }}
              </template>
            </el-table-column>

            <el-table-column prop="diseaseName" label="疾病名称" width="350">
              <template slot-scope="scope">
                {{ scope.row.diseaseName }}
              </template>
            </el-table-column>

            <el-table-column prop="diseaseCode" label="拼音码" width="150">
              <template slot-scope="scope">
                {{ scope.row.diseaseCode }}
              </template>
            </el-table-column>
            <el-table-column
              prop="edit"
              label="编辑"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="editDiseaseFormFunction(scope.$index, scope.row)"
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
        </div>
      </el-col>
      <!-- <el-col :span="16"><div class="grid-content bg-purple"></div></el-col> -->
    </el-row>
  </div>
</template>

<script>
import { fetchDiseaseCategory, fetchDiseaseList, addDisease, updateDisease, deleteDiseaseByPrimaryKey } from '../../api/basicInfo/diagnosis'

export default {
  data() {
    return {
      totalNumber: 0,
      // 页面左侧：疾病种类
      diseaseCategoryList: [{
        diseaseId: null,
        diseaseName: null
      }],
      diseaseTable: [],
      // 页面右侧：具体的疾病
      listLoading: false,
      total: 0, // 疾病数据项数量

      selectEditValue1: '',
      selectEditValue2: '',
      multipleSelection: [],
      diseaseForm: {
        diseaseId: 0,
        diseaseCategory: 0,
        diseaseIcd: '',
        diseaseName: '',
        diseaseCode: ''
      },
      editDiseaseForm: {
        diseaseId: 0,
        diseaseCategory: 0,
        diseaseIcd: '',
        diseaseName: '',
        diseaseCode: ''
      },
      diseaseIdList: [],
      dialogFormVisible: false,
      editDialogFormVisible: false,
      searchDiseaseCategoryId: '',
      searchDiseaseCategoryName: '',
      formLabelWidth: '120px',
      currentPage: 1, // 当前页
      pageSize: 50, // 每页大小
      rules: {
        diseaseIcd: [
          { required: true, message: '请输入疾病编码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
          // todo 前端要写 输入 规则判断
        ],
        diseaseName: [
          { required: true, message: '请输入疾病名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        diseaseCode: [
          { required: true, message: '请输入拼音码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        diseaseCategory: [
          { required: true, message: '请选择疾病编码', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getDiseaseCategory()
  },

  methods: {
    /**
       * 获取页面左侧的疾病种类
       */
    getDiseaseCategory() {
      fetchDiseaseCategory().then(response => {
        console.log('fetchDiseaseCategory response: ')
        console.log(response)
        this.diseaseCategoryList = response.data
      }).catch(error => {
        console.log('fetchDiseaseList error: ')
        console.log(error)
      })
    },
    test(row, column) {
      console.log('row: ', row)
      console.log('column: ', column)
    },
    toggleSelection(rows) { // 取消选择的函数
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
    setDiseaseCategoryId(val) {
      this.searchDiseaseCategoryId = val
      console.log('DiseaseCategoryId: ', this.searchDiseaseCategoryId)
      this.getDiseaseList()
    },
    setDiseaseCategoryId1(val) { // 获取点击后的值
      this.searchDiseaseCategoryName = val.diseaseName
      console.log('name: ', this.searchDiseaseCategoryName)
      this.searchDiseaseCategoryId = val.diseaseCategoryId
      console.log('DiseaseCategoryId: ', this.searchDiseaseCategoryId)
      this.getDiseaseList()
    },
    /**
       * 获取页面右侧的疾病信息表格
       */
    getDiseaseList() {
      this.listLoading = true // 列表正在加载
      this.query = {
        'currentPage': this.currentPage,
        'pageSize': this.pageSize,
        'diseaseCategoryId': this.searchDiseaseCategoryId
      }
      fetchDiseaseList(this.query).then(response => {
        console.log('fetchDiseaseList response: ')
        console.log(response)
        // todo 分页按钮，分页数量，每页大小等
        this.diseaseTable = response.data.list // 数据列表
        // this.total = response.data.total // 数据项数量
        this.listLoading = false // 列表加载完成
      }).catch(error => {
        console.log('fetchDiseaseList error: ')
        console.log(error)
      })
    },
    forceChangeCategory(val) {
      console.log('forceChange: ', val)
      this.$set(this.diseaseForm, 'diseaseCategory', val)
      console.log(this.diseaseForm.diseaseCategory)
      this.$set(this.editDiseaseForm, 'diseaseCategory', val)
    }, // 开始增删改查
    submitAddDisease(formName) {
      console.log('增加的疾病表', this.diseaseForm)
      addDisease(this.diseaseForm).then(response => {
        console.log('增加完后的返回', response)
        this.totalNumber += 1
        var tmp = Math.ceil(this.totalNumber / this.pageSize)
        this.current = tmp
        this.getDiseaseList()
        this.$refs[formName] = '' // 清空内容及选择器
      })
    }, // 修改 ，读取原有row 数据
    editDiseaseFormFunction(index, row) {
      this.editDialogFormVisible = true
      this.editDiseaseForm.diseaseIcd = row.diseaseIcd
      this.editDiseaseForm.diseaseName = row.diseaseName
      this.editDiseaseForm.diseaseCode = row.diseaseCode
      this.selectEditValue2 = this.searchDiseaseCategoryName
      this.editDiseaseForm.diseaseId = row.diseaseId
      this.editDiseaseForm.diseaseCategory = row.diseaseCategory
    },
    submitUpdateDisease(formName) {
      console.log('update disease now')
      console.log(this.editDiseaseForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editDialogFormVisible = false
          updateDisease(this.editDiseaseForm).then(response => {
            this.$refs[formName].resetFields() // 清空下 修改表
            this.getDiseaseList()
            console.log(response)
          }).catch(error => {
            console.log('update error disease', error)
          })
        } else {
          console.log('error update diagnosis up-disease')
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
        this.diseaseIdList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.diseaseIdList.push(this.multipleSelection[i].diseaseId)
        }
        this.diseaseIdList = { 'diseaseIdList': this.diseaseIdList }
        console.log('list 疾病', this.diseaseIdList)
        /**
         * 按主键删除疾病信息的请求
         */
        deleteDiseaseByPrimaryKey(this.diseaseIdList).then(response => {
          console.log('deleteDiseaseByPrimaryKey response: ')
          console.log(response)
          this.$message({
            type: 'success',
            message: '已删除'
          })
          this.getDiseaseList()
        }).catch(error => {
          console.log('deleteDiseaseByPrimaryKey error: ')
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

<style scoped>
  .wordbox {
    margin: 2%;
    background: #eef1f6;
    padding: 8px 24px;
    padding-top: 20px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
  }

  .row {
    display: inline-block;
    margin: 1%;
    width: 100%;
  }

  .word_input_2 {
    width: 49%;
    height: 46px;
    display: inline-block;
  }

  .word_input_4 {
    width: 24.5%;
    height: 46px;
    display: inline-block;
  }

  .registration_input {
    position: relative;
    padding: 4px 7px;
    width: 80%;
    height: 30px;
    cursor: text;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(0, 0, 0, .65);
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  .registration_input_2 {
    position: relative;
    padding: 4px 7px;
    width: 91%;
    height: 30px;
    cursor: text;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(0, 0, 0, .65);
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  .row_h4 {
    margin-bottom: 2px;
  }

  h3 {
    margin: 10px;
  }
</style>
