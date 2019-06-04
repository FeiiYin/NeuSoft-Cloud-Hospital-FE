<template>
  <div style="padding:1%;">
    <el-row>
        <el-col :span="6"><div class="grid-content bg-purple">
            <aside>疾病目录分类</aside>
            <aside>
                <svg-icon icon-class="search" /> 
                搜索
                <el-input v-model="form.name" ></el-input>
            </aside>
            
            <el-tree
                :props="props"
                :load="loadNode"
                lazy
                show-checkbox
                @check-change="handleCheckChange">
            </el-tree>
        </div></el-col>
        <el-col :span="18"><div class="grid-content bg-purple-light">
            <aside>疾病目录列表</aside>
            <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="疾病编码"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="疾病名称"
            width="120">
            </el-table-column>
            <el-table-column
            prop="address"
            label="拼音码"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="address"
            label="ICD码"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="address"
            label="疾病种类"
            show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px; margin-left: 20px;">
            <el-button @click="toggleSelection()">取消选择</el-button>
            <!-- Form -->
            <el-button @click="dialogFormVisible = true">新建条目</el-button>

            <el-dialog title="新建条目" :visible.sync="dialogFormVisible">
            
            <el-form :model="form">
                <el-form-item label="疾病名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="疾病编码" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="疾病ICD码" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="拼音码" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="疾病种类" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="50"
                layout="total, sizes, prev, pager, next, jumper"
                :total="200">
            </el-pagination>
        </div>

        <div style="height:30px;" />        
        </div></el-col>
    <!-- <el-col :span="16"><div class="grid-content bg-purple"></div></el-col> -->
    </el-row>
    
    
  </div>
</template>

<script>    
  export default {
     data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
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
      };
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
     

      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      }      
    }
  };
</script>

<style  scoped>
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
    display:inline-block;
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
    margin-bottom:2px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
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
  h3 {
    margin: 10px;
  }
</style>