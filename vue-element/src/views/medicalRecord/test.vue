<template>
  <div>
    <el-button @click="$refs.editable.insert({name: 'new1'})">新增</el-button>
    <el-button @click="$refs.editable.removeSelecteds()">删除选中</el-button>
    <el-button @click="$refs.editable.clear()">清空</el-button>
    <elx-editable ref="editable" :data.sync="tableData">
      <elx-editable-column type="selection" width="55"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="name" label="只读"></elx-editable-column>
      <elx-editable-column prop="sex" label="性别" :edit-render="{name: 'ElSelect', options: sexList}"></elx-editable-column>
      <elx-editable-column prop="age" label="数值" :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
      <elx-editable-column prop="date" label="日期" :edit-render="{name: 'ElDatePicker', attrs: {type: 'date', format: 'yyyy-MM-dd'}}"></elx-editable-column>
      <elx-editable-column prop="flag" label="开关" :edit-render="{name: 'ElSwitch', type: 'visible'}"></elx-editable-column>
      <elx-editable-column prop="remark" label="文本" :edit-render="{name: 'ElInput'}"></elx-editable-column>
    </elx-editable>

    <el-transfer
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入城市拼音"
      v-model="value2"
      :data="data2">
    </el-transfer>
  </div>
</template>

<script>
import Vue from 'vue'
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
  data () {
    const generateData2 = _ => {
        const data = [];
        const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
        const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
            pinyin: pinyin[index]
          });
        });
        return data;
      };
      return {
        data2: generateData2(),
        value2: [],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        }
      };

    return {
      tableData: [{
        date: 1551322088449,
        name: '小徐',
        sex: '1',
        age: '26',
        flag: false,
        remark: '备注'
      }],
      sexList: [
        {
          'label': '男',
          'value': '1'
        },
        {
          'label': '女',
          'value': '0'
        }
      ]
    }
  }
}
</script>