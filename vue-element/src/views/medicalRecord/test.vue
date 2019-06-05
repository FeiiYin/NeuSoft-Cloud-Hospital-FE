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