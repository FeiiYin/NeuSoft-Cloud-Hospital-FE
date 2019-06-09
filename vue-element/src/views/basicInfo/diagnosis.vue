<template>
  <div style="padding:1%;">
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <aside>疾病目录分类</aside>
          <template>
            <el-select v-model="searchDiseaseCategoryId" filterable placeholder="搜索选择疾病分类" @change="getDiseaseList">
              <el-option
                v-for="item in diseaseCategoryList"
                :key="item.diseaseId"
                :label="item.diseaseName"
                :value="item.diseaseId"
              />
              <!-- label 是显示的标签，value 是值-->
            </el-select>
          </template>
        </div>
      </el-col>

      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <aside>疾病目录列表</aside>

          <div style="margin-top: 20px; margin-left: 20px;">
            <el-button @click="toggleSelection()">取消</el-button>
            <!--新增疾病信息的按钮-->
            <el-button @click="dialogFormVisible = true">新增</el-button>
            <!--新增疾病信息的对话框-->
            <el-dialog title="新增" :visible.sync="dialogFormVisible">
              <!-- 新建疾病信息的表单 -->
              <el-form :model="diseaseForm">
                <el-form-item label="疾病编码" :label-width="formLabelWidth">
                  <el-input v-model="diseaseForm.diseaseIcd" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病名称" :label-width="formLabelWidth">
                  <el-input v-model="diseaseForm.diseaseName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="拼音码" :label-width="formLabelWidth">
                  <el-input v-model="diseaseForm.diseaseCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病种类" :label-width="formLabelWidth">
                  <el-input v-model="diseaseForm.diseaseCategory" auto-complete="off" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>

            <el-button @click="toggleSelection()">删除</el-button>
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

            <!--            <el-table-column prop="diseaseCategory" label="疾病种类" width="150">-->
            <!--              <template slot-scope="scope">-->
            <!--                {{ scope.row.diseaseCategory }}-->
            <!--              </template>-->
            <!--            </el-table-column>-->

          </el-table>
          <div style="height:30px;" />
          <div class="block;margin-left:20px;">
            <el-pagination
              v-show="total>0"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 200]"
              :page-size="50"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <div style="height:30px;" />
        </div>
      </el-col>
      <!-- <el-col :span="16"><div class="grid-content bg-purple"></div></el-col> -->
    </el-row>
  </div>
</template>

<script>
import { fetchDiseaseCategory, fetchDiseaseList } from '@/api/basicInfo/diagnosis.js'

export default {
  data() {
    return {
      // 页面左侧：疾病种类
      diseaseCategoryList: [{
        diseaseId: null,
        diseaseName: null
      }],
      // 页面右侧：具体的疾病
      listLoading: false,
      diseaseTable: [],
      total: 0, // 疾病数据项数量

      multipleSelection: [],
      diseaseForm: {},
      dialogFormVisible: false,
      searchDiseaseCategoryId: null,
      formLabelWidth: '120px',
      currentPage: 1, // 当前页
      pageSize: 50 // 每页大小
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
      fetchDiseaseCategory(this.listQuery).then(response => {
        console.log('fetchDiseaseCategory response: ')
        console.log(response)
        this.diseaseCategoryList = response.data
      }).catch(error => {
        console.log('fetchDiseaseList error: ')
        console.log(error)
      })
    },
    /**
       * 获取页面右侧的疾病信息表格
       */
    getDiseaseList() {
      this.listLoading = true // 列表正在加载
      this.query = {
        'current_page': this.currentPage,
        'page_size': this.pageSize,
        'disease_category': this.searchDiseaseCategoryId
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
