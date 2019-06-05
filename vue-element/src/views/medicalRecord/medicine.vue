<template>
  <div class="app-container">
    <el-container>
        <el-main>
            <aside>
              <span style="margin-left:30px;">门诊诊断</span>
              <span style="margin-left:30px;">这里是前面传过来的</span>
            </aside>
            <!-- model div 1 -->
            <!-- <el-container v-show="model_array[0]"> -->
            <el-container >
              <el-header>
                    <span style="margin-left:30px;">处方类型</span>
                    <el-select v-model="value8" filterable placeholder="从上面传过来" style="margin-left:30px;">
                        <el-option  v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span style="margin-left:30px;">处方金额</span>
                    <el-input placeholder="请输入内容" v-model="input1" :disabled="true" style="width:30%;margin-left:30px;">
                    </el-input>
              </el-header>
              <el-main id="subOutputRank-print">
                  <el-button @click="dialogFormVisible = true">新增</el-button>
                  <el-button @click="$refs.editable.removeSelecteds()">删除选中</el-button>
                  <el-button @click="$refs.editable.clear()">清空</el-button>
                  
                  <elx-editable ref="editable" :data.sync="tableData">
                    <elx-editable-column type="selection" width="55"></elx-editable-column>
                    <elx-editable-column type="index" width="55"></elx-editable-column>
                    
                    <elx-editable-column prop="medicine_name" label="药品名称"></elx-editable-column>
                    <elx-editable-column prop="medicine_norm" label="规格"></elx-editable-column>
                    <elx-editable-column prop="medicine_unit_price" label="单价"></elx-editable-column>
                      
                    <elx-editable-column prop="medicine_frequency" label="频次" :edit-render="{name: 'ElSelect', options: frequencyList}"></elx-editable-column>
                    <elx-editable-column prop="medicine_number" label="数量" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="medicine_unit" label="单位"></elx-editable-column>
                    <elx-editable-column prop="remark" label="用药嘱托" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                  </elx-editable>
              </el-main>
              <el-footer>
                  Footer
                  <el-button @click="true">保存</el-button>
                  <el-button @click="true">作废</el-button>
                  <el-button @click="true">打印</el-button>
                  <el-button @click="true">常用药</el-button>
              </el-footer>
              

            <el-dialog title="新建条目" :visible.sync="dialogFormVisible">
              <el-form :model="medicine_form" >
                <el-form-item label="药品名称" :label-width="formLabelWidth">
                  <el-autocomplete
                    v-model="medicine_form.medicineName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect" style="width:100%">
                  </el-autocomplete>
                </el-form-item>
                
                <el-form-item label="药品规格" :label-width="formLabelWidth">
                  <el-input v-model="medicine_form.medicineNorm" auto-complete="off" />
                </el-form-item>
                <el-form-item label="药品频率" :label-width="formLabelWidth">
                  <el-input v-model="medicine_form.medicineFrequency" auto-complete="off" />
                </el-form-item>
                <el-form-item label="药品数量" :label-width="formLabelWidth">
                  <el-input v-model="medicine_form.medicineNumber" auto-complete="off" />
                </el-form-item>
                <el-form-item label="用药嘱托" :label-width="formLabelWidth">
                  <el-input v-model="medicine_form.medicineRemark" auto-complete="off" />
                </el-form-item>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button @click="clear_dialog()">清 空</el-button>
                <el-button type="primary" @click="insert_medicine()">确 定</el-button>
              </div>
            </el-dialog>
            </el-container>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'
import { fetchList } from '@/api/article'
import ThemePicker from '@/components/ThemePicker'

// table used 
import {
  Editable,
  EditableColumn
} from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'
Vue.use(Editable)
Vue.use(EditableColumn)
Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn ', EditableColumn)

export default {
  components: { ThemePicker },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  data() {
    return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value8: '',
        input1: 1300,
//          first table
        tableData: [],
        frequencyList: [
          {
            'label': '一天一次',
            'value': '1'
          },
          {
            'label': '一天两次',
            'value': '2'
          },
          {
            'label': '一天三次',
            'value': '3'
          }
        ],
        // test table
        restaurants: [],
        state4: '',
        timeout:  null,

        // dialog
        dialogFormVisible: false,
        medicine_form: {
          medicineName: '',
          medicineNorm: '',
          medicineFrequency: '',
          medicineNumber: '',
          medicineRemark: ''
        },
        formLabelWidth: '120px'
        // end here
    }
  },
  methods: {
        insert_medicine () {
            var medicineName = this.medicine_form.medicineName;
            var medicineNorm = this.medicine_form.medicineNorm;
            var medicineFrequency = this.medicine_form.medicineFrequency;
            var medicineNumber = this.medicine_form.medicineNumber;
            var medicineRemark = this.medicine_form.medicineRemark;

            // 未验证错误关系

            this.$refs.editable.insert({
              medicine_name: medicineName, 
              medicine_norm: medicineNorm,
              medicine_unit_price: 1,
              medicine_frequency: medicineFrequency,
              medicine_number: medicineNumber,
              medicine_unit: '瓶',
              remark: medicineRemark
              });

            this.$notify({
              title: '插入成功',
              message: '插入数据成功  '+name,
              type: 'success'
            });
            this.dialogFormVisible = false;
        },
        clear_dialog() {
            this.medicine_form.medicineName = '';
            this.medicine_form.medicineNorm = '';
            this.medicine_form.medicineFrequency = '';
            this.medicine_form.medicineNumber = '';
            this.medicine_form.medicineRemark = '';
        },
        handleCommand(command) {
            this.$message('click on item ' + command);
        },
        async getList() {
            this.listLoading = true
            const { data } = await fetchList(this.listQuery)
            const items = data.items
            this.list = items.map(v => {
                this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
                v.originalTitle = v.title //  will be used when user click the cancel botton
                return v
            })
            this.listLoading = false
        },
        cancelEdit(row) {
            row.title = row.originalTitle
            row.edit = false
            this.$message({
                message: 'The title has been restored to the original value',
                type: 'warning'
            })
        },
        confirmEdit(row) {
            row.edit = false
            row.originalTitle = row.title
            this.$message({
                message: 'The title has been edited',
                type: 'success'
            })
        },
        loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
          { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        ];
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      }
    // end here
  },
  mounted() {
      this.restaurants = this.loadAll();
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
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
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
