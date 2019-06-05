<template>
  <div style="padding:1%;">
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <aside>疾病目录分类</aside>
          <aside>
            <svg-icon icon-class="search" />
            搜索
            <el-input v-model="form.name" />
          </aside>

          <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            @check-change="handleCheckChange"
          />
        </div>
      </el-col>

      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <aside>疾病目录列表</aside>
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

            <el-table-column prop="diseaseCode" label="疾病编码" width="120">
              <template slot-scope="scope">{{ scope.row.diseaseCode }}</template>
            </el-table-column>

            <el-table-column prop="diseaseName" label="疾病名称" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.diseaseName }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="pinyinCode" label="拼音码" show-overflow-tooltip />

            <el-table-column prop="ICDCode" label="ICD码" show-overflow-tooltip />

            <el-table-column prop="diseaseCategory" label="疾病种类" show-overflow-tooltip />

          </el-table>

          <div style="margin-top: 20px; margin-left: 20px;">
            <el-button @click="toggleSelection()">取消选择</el-button>

            <!-- 添加疾病的表单 -->
            <el-button @click="dialogFormVisible = true">新建条目</el-button>

            <el-dialog title="新建条目" :visible.sync="dialogFormVisible">

              <el-form :model="form">
                <el-form-item label="疾病名称" :label-width="formLabelWidth">
                  <el-input v-model="form.diseaseCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病编码" :label-width="formLabelWidth">
                  <el-input v-model="form.diseaseName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病ICD码" :label-width="formLabelWidth">
                  <el-input v-model="form.ICDCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="拼音码" :label-width="formLabelWidth">
                  <el-input v-model="form.pinyinCode" auto-complete="off" />
                </el-form-item>
                <el-form-item label="疾病种类" :label-width="formLabelWidth">
                  <el-input v-model="form.diseaseCategory" auto-complete="off" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>

            <el-button @click="toggleSelection()">删除条目</el-button>
            <el-button @click="toggleSelection()">保存修改</el-button>
          </div>
          <div style="height:30px;" />
          <div class="block;margin-left:20px;">
            <el-pagination
              v-show="total>0"
              :current-page="currentPage4"
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
import { fetchList } from '@/api/basicInfo/diagnosis.js'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  data() {
    return {
      // tree 目录
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,

      // table
      listLoading: true,
      diseaseTable: [{
        diseaseCode: null, // 疾病编码
        diseaseName: null, // 疾病名称
        ICDCode: null, // ICD 码
        pinyinCode: null, // 拼音码
        diseaseCategory: null // 疾病种类
      }],

      multipleSelection: [],

      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() { // 获取列表
      this.listLoading = true // 列表正在加载
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items // 数据列表
        this.total = response.data.total // 数据项数量
        this.listLoading = false // 列表加载完成
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])

      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }

      setTimeout(() => {
        let data
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    }
  }
}
</script>

<style scoped>
  .wordbox {
    margin: 2%;
    display: inline-block;
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
