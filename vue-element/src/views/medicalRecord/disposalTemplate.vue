<template>
  <div class="app-container">
    <aside>
      <span style="margin-left:30px;">治疗项目模板管理</span>
    </aside>
    <el-container>
      <el-row :gutter="40" style="width:100%">
        <el-col :span="8">
          <el-tree
            :data="templateTreeData"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span="16">
          <div>
            <el-form ref="chargeFormForm" :model="chargeFormForm" label-width="100px">
              <el-row :gutter="10" style="margin-bottom:0px">
                <el-col :span="8">
                  <el-form-item label="治疗模板编号" prop="chargeFormId">
                    <el-input v-model="chargeFormForm.chargeFormId" prefix-icon="el-icon-document" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="治疗申请名称" prop="chargeFormName">
                    <el-input v-model="chargeFormForm.chargeFormName" prefix-icon="el-icon-document" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="saveState" placeholder="请选择">
                    <el-option
                      v-for="item in templateCategory"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 治疗列表，可动态新增和删除 -->
          <div style="margin-top:60px">
            <el-button @click="chargeItemFormVisible = true">新增</el-button>
            <el-button @click="commonDisposalDialogVisible = true">常用项目</el-button>

            <el-button @click="$refs.chargeItemEditableTableData.removeSelecteds()">删除选中</el-button>
            <el-button @click="$refs.chargeItemEditableTableData.clear()">清空</el-button>

            <elx-editable ref="chargeItemEditableTableData" :data.sync="chargeItemEditableTableData" @blur-active="calculateTotalMoney">
              <elx-editable-column type="selection" width="55" />
              <elx-editable-column type="index" width="55" />
              <elx-editable-column prop="nameZh" label="项目名称" />
              <elx-editable-column prop="specification" label="规格" />
              <elx-editable-column prop="price" label="单价" />
              <elx-editable-column prop="nums" label="数量" :edit-render="{name: 'ElInputNumber'}" />
              <elx-editable-column prop="doctorAdvice" label="医嘱" :edit-render="{name: 'ElInput'}" />
            </elx-editable>
          </div>
          <!-- 全局按钮 -->
          <div style="text-align:center;margin-top:40px;">
            <el-button type="primary" @click="invokeAddTemplate(1)">新建</el-button>
            <el-button type="info" @click="invokeAddTemplate(0)">更改</el-button>
            <el-button type="danger" @click="invokeDeleteDisposal">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </el-container>

    <!--新增条目的对话框-->
    <el-dialog title="新增治疗项目" :visible.sync="chargeItemFormVisible" width="30%">
      <el-form ref="chargeItemForm" :model="chargeItemForm" label-width="120px">
        <el-form-item label="科室名称" prop="departmentId">
          <el-select
            v-model="chargeItemForm.departmentId"
            filterable
            placeholder="请选择"
            width="100%"
            @change="forceChange"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="治疗项目名称" prop="chargeItemId">
          <el-select
            v-model="chargeItemForm.chargeItemId"
            filterable
            placeholder="请选择"
            :disabled="chargeItemFormDisable"
          >
            <el-option
              v-for="item in chargeItemList"
              :key="item.chargeItemId"
              :label="item.nameZh"
              :value="item.chargeItemId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeItemFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertChargeItemTable">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 常用项目 dialog -->
    <el-dialog title="常用药" :visible.sync="commonDisposalDialogVisible">
      <div style="margin-left:13%">
        <!-- 选中 穿梭框 -->
        <el-transfer
          v-model="commonDisposalListValue"
          filterable
          :filter-method="transferFilterMethod"
          filter-placeholder="请输入"
          :data="commonDisposalListData"
          :titles="['常用项目列表', '选中列表']"
          style=""
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commonDisposalDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertCommonDisposal()">确 定</el-button>
      </div>
    </el-dialog>

    <!--模板的对话框-->
    <el-dialog title="模板" :visible.sync="templateDialogVisible" width="30%">
      <span>模板保存类别</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="templateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCurrentIntoTemplate()">保存模板</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import Vue from 'vue'
// 可编辑table使用
// table used
import { Editable, EditableColumn } from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

import {
  fetchDepartmentList
} from '../../api/basicInfo/department'

import {
  saveDisposal,
  selectDisposalItemListInChargeItemByDepartmentId,
  deleteDisposal,
  selectDisposalTemplate
} from '../../api/medicalRecord/disposal'

Vue.use(Editable)
Vue.use(EditableColumn)
Vue.component('ElxEditable', Editable)
Vue.component('ElxEditableColumn', EditableColumn)

export default {
  data() {
    return {
      // 基础前置信息
      doctorId: 1,
      totalListMoney: 0,
      // 治疗表单
      chargeFormForm: {
        disease: '',
        chargeFormName: '',
        chargeFormId: ''
      },
      // 项目表单
      chargeItemForm: {
        chargeItemId: ''
      },
      chargeItemFormVisible: false,
      chargeItemFormDisable: true,
      departmentList: [],
      chargeItemList: [],
      // 项目列表
      chargeItemEditableTableData: [],
      // 处方物品-药品
      prescriptionItem: {
        prescriptionItemId: '',
        medicineId: '',
        medicineUsage: '',
        medicineDosage: '',
        medicineFrequency: '',
        medicineNumberDay: '',
        medicineQuantity: '',
        skinTest: '',
        skinTestResult: ''
      },
      // 药品远程选择
      medicineTotalList: [],
      // 常用药对话框
      commonDisposalDialogVisible: false,
      commonDisposalListData: [],
      commonDisposalListValue: [],
      transferFilterMethod(query, item) {
        return item.nameZh.indexOf(query) > -1
      },
      // 树形目录参数
      // 树形列表的类名
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 模板
      templateTreeData: [
        {
          label: '全院',
          children: []
        }, {
          label: '科室',
          children: []
        }, {
          label: '个人',
          children: []
        }
      ],
      templateDialogVisible: false,
      templateTreeDirectory: 0,
      // 模板的完整数据 二维的
      templateData: [],
      // 一个具体模板的数据
      templateExample: [],
      saveState: '',
      templateCategory: [{
        value: 2,
        label: '全院模板'
      }, {
        value: 3,
        label: '科室模板'
      }, {
        value: 4,
        label: '个人模板'
      }]
    }
  },
  watch: {
  },
  created() {
    // not defined like below, 我把获取历史列表写在了获取部门列表里
    // this.invokeFetchDepartmentList().then(response => {
    //   this.invokeSelectHistoryDisposal()
    // })
    this.doctorId = this.$store.getters.doctorId
    console.log(this.doctorId)
    this.invokeCommonDisposal()
    this.invokeFetchDepartmentList_withNoRegistration()
    this.invokeSelectTemplate()
  },
  methods: {
    invokeFetchDepartmentList_withNoRegistration() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
      })
    },
    // 获取
    invokeFetchDepartmentList() {
      var query = { 'currentPage': 1, 'pageSize': 400 }
      fetchDepartmentList(query).then(response => {
        console.log('fetchDepartmentList response: ')
        console.log(response)
        this.departmentList = response.data.list
        // this.invokeSelectHistoryDisposal()
      })
    },
    forceChange() {
      this.chargeItemFormDisable = false
      this.invokeSelectDisposalItemListInChargeItemByDepartmentId()
    },
    invokeSelectDisposalItemListInChargeItemByDepartmentId() {
      var query = { 'departmentId': this.chargeItemForm.departmentId }
      selectDisposalItemListInChargeItemByDepartmentId(query).then(response => {
        console.log('selectDisposalItemListInChargeItemByDepartmentId response: ')
        console.log(response)
        this.chargeItemList = []
        this.chargeItemList = response.data
      })
    },
    insertChargeItemTable() {
      var id = this.chargeItemForm.chargeItemId
      for (var i = 0; i < this.chargeItemList.length; ++i) {
        if (this.chargeItemList[i].chargeItemId === id) {
          this.chargeItemForm = this.chargeItemList[i]
          break
        }
      }
      this.chargeItemForm.nums = 1
      this.chargeItemForm.doctorAdvice = '无'
      this.chargeItemForm.departmentName = this.departmentList[this.chargeItemForm.departmentId - 1].departmentName
      for (i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        if (this.chargeItemEditableTableData[i].chargeItemId === this.chargeItemForm.chargeItemId) {
          this.$message.error('列表中有重复元素，错误！')
          this.chargeItemFormVisible = false
          this.chargeItemFormDisable = true
          this.chargeItemForm = {}
          return
        }
      }
      this.$refs.chargeItemEditableTableData.insert(this.chargeItemForm)
      this.$message({
        message: '插入数据成功！',
        type: 'success'
      })
      this.chargeItemFormVisible = false
      this.chargeItemFormDisable = true
      this.chargeItemForm = {}
    },
    submitCheck() {
      if (this.chargeFormForm.chargeFormName === '' || this.chargeFormForm.requirement === '') {
        this.$message.error('当前治疗名称信息缺失，错误！')
        return false
      }
      if (this.chargeItemEditableTableData.length === 0 || this.chargeItemEditableTableData.length == null) {
        this.$message.error('未选中任何项目，错误！')
        return false
      }
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        if (this.chargeItemEditableTableData[i].nums == null ||
          this.chargeItemEditableTableData[i].nums === '' ||
          this.chargeItemEditableTableData[i].nums <= 0
        ) {
          this.$message.error('项目信息缺失或错误，错误！')
          return false
        }
      }
      return true
    },
    calculateTotalMoney() {
      this.totalListMoney = 0
      var bool = false
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        this.totalListMoney += this.chargeItemEditableTableData[i].nums *
          this.chargeItemEditableTableData[i].price
        if (this.chargeItemEditableTableData[i].nums <= 0) {
          bool = true
          break
        }
      }
      if (bool) {
        this.totalListMoney = 0
        this.$message.error('输入数据小于等于0，将无法提交！')
      }
    },
    invokeAddTemplate(choose) {
      if (this.submitCheck() === false) { return }
      var tempList = []
      for (var i = 0; i < this.chargeItemEditableTableData.length; ++i) {
        tempList.push({
          'chargeItemId': this.chargeItemEditableTableData[i].chargeItemId,
          'nums': this.chargeItemEditableTableData[i].nums,
          'doctorAdvice': this.chargeItemEditableTableData[i].doctorAdvice
        })
      }
      var query = {
        'disposalJson': {
          'registrationId': -1,
          'saveState': this.saveState, // 暂存 0；正式提交 1；全院模板 2；科室模板 3；医生个人模板 4
          'chargeFormName': this.chargeFormForm.chargeFormName,
          'chargeEntryList': tempList
        }
      }
      if (choose === 0) {
        // 修改
        if (this.chargeFormForm.chargeFormId === '') {
          this.$message.error('没有选中模板，无编号，错误！')
          return
        }
        query.disposalJson.chargeFormId = this.chargeFormForm.chargeFormId
      }

      console.log(query)
      saveDisposal(query).then(response => {
        console.log('saveDisposal response: ')
        console.log(response)
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.initData()
        this.invokeSelectTemplate()
      })
    },
    // 常用治疗
    invokeCommonDisposal() {
      this.commonDisposalListData.push({
        label: '大抢救',
        key: 1,
        chargeItemId: 1,
        nameZh: '大抢救',
        departmentId: 133,
        departmentName: '护理科',
        price: 200,
        specification: '日',
        nums: 1,
        doctorAdvice: '医嘱'
      })
      this.commonDisposalListData.push({
        label: '中抢救',
        key: 2,
        chargeItemId: 2,
        nameZh: '中抢救',
        departmentId: 133,
        departmentName: '护理科',
        price: 150,
        specification: '日',
        nums: 1,
        doctorAdvice: '医嘱'
      })
      // commonMedicine({'medicineNumber': 7}).then(response => {
    },
    insertCommonDisposal() {
      if (this.commonDisposalListValue.length === 0) {
        this.$message('未插入常用治疗')
        this.commonDisposalDialogVisible = false
        return
      }
      var abool
      for (var i = 0; i < this.commonDisposalListValue.length; ++i) {
        var id = this.commonDisposalListValue[i]
        for (var j = 0; j < this.commonDisposalListData.length; ++j) {
          if (id === this.commonDisposalListData[j].chargeItemId) {
            var bool = false
            for (var k = 0; k < this.chargeItemEditableTableData.length; ++k) {
              if (this.chargeItemEditableTableData[k].chargeItemId === id) {
                bool = true
                abool = true
                break
              }
            }
            if (bool) {
              break
            }
            this.$refs.chargeItemEditableTableData.insert(this.commonDisposalListData[j])
            break
          }
        }
      }
      this.commonDisposalListValue = []
      if (abool) {
        this.$message('已去除重复条目')
      } else {
        this.$message({
          message: '插入数据成功！',
          type: 'success'
        })
      }
      this.commonDisposalDialogVisible = false
    },
    // 暂存
    handleTempSaveTableSelectionChange(val) {
      this.tempsaveDisposalTableMultipleSelection = val
    },
    showTempsaveDisposalItemExample(row, event, column) {
      this.tempsaveDisposalItemExample = row.chargeEntryList
      this.tempsaveDisposalData = row
      // var tempList = JSON.parse(row.medicine)
      // this.tempsaveDisposalItemExample = []
      // for (var i = 0; i < tempList.length; ++i) {
      //   this.tempsaveDisposalItemExample.push(this.medicineTotalList[tempList[i].medicineId-1])
      // }
    },
    initData() {
      this.chargeFormForm.chargeFormId = ''
      this.chargeFormForm.chargeFormName = ''
      this.$refs.chargeItemEditableTableData.clear()
    },
    // 删除暂存的处方
    invokeDeleteDisposal() {
      var tempList = []
      if (this.chargeFormForm.chargeFormId === '') {
        this.$message.error('没有选中模板，无编号，错误！')
        return
      }
      tempList.push(this.chargeFormForm.chargeFormId)
      deleteDisposal({ 'chargeFormIdList': tempList }).then(response => {
        this.invokeSelectTemplate()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.initData()
      })
    },
    checkIfNotIn(id) {
      for (var j = 0; j < this.chargeItemEditableTableData.length; ++j) {
        if (this.chargeItemEditableTableData[j].chargeItemId === id) {
          return false
        }
      }
      return true
    },
    // 模板
    applyTemplate(template) {
      this.chargeFormForm.chargeFormName = template.chargeFormName
      this.chargeFormForm.chargeFormId = template.chargeFormId
      this.saveState = template.saveState
      this.$refs.chargeItemEditableTableData.clear()
      for (var i = 0; i < template.chargeEntryList.length; ++i) {
        this.$refs.chargeItemEditableTableData.insert(template.chargeEntryList[i])
      }
    },
    invokeSelectTemplate() {
      this.templateData = []
      var query = {
        'disposalScope': 2,
        'doctorId': this.doctorId
      }
      selectDisposalTemplate(query).then(response => {
        console.log('selectPrescriptionTemplate response:')

        this.templateData.push(JSON.parse(response.data))
        query.disposalScope = 3
        selectDisposalTemplate(query).then(response => {
          this.templateData.push(JSON.parse(response.data))
          query.disposalScope = 4
          selectDisposalTemplate(query).then(response => {
            this.templateData.push(JSON.parse(response.data))
            console.log(this.templateData)

            this.templateTreeData = [
              {
                label: '全院',
                children: []
              }, {
                label: '科室',
                children: []
              }, {
                label: '个人',
                children: []
              }]
            // 加到树形列表中
            console.log(this.templateData)
            for (var i = 0; i < 3; ++i) {
              for (var j = 0; j < this.templateData[i].length; ++j) {
                this.templateTreeData[i].children.push({
                  'label': this.templateData[i][j].chargeFormName,
                  'id': this.templateData[i][j].chargeFormId
                })
                for (var k = 0; k < this.templateData[i][j].chargeEntryList.length; ++k) {
                  this.templateData[i][j].chargeEntryList[k].nameZh = this.templateData[i][j].chargeEntryList[k].chargeItem.nameZh
                  this.templateData[i][j].chargeEntryList[k].specification = this.templateData[i][j].chargeEntryList[k].chargeItem.specification
                  this.templateData[i][j].chargeEntryList[k].price = this.templateData[i][j].chargeEntryList[k].chargeItem.price
                }
              }
            }
          })
        })
      })
    },

    // 树形目录检测
    handleNodeClick(data) {
      console.log(data)
      if (data.label === '全院') {
        this.templateTreeDirectory = 0
        return
      }
      if (data.label === '科室') {
        this.templateTreeDirectory = 1
        return
      }
      if (data.label === '个人') {
        this.templateTreeDirectory = 2
        return
      }
      var now = this.templateTreeDirectory
      for (var i = 0; i < this.templateData[now].length; ++i) {
        // console.log(this.medicalRecordTemplateData[now][i].templateName)
        if (this.templateData[now][i].chargeFormId === data.id) {
          // console.log('tempList')
          // console.log(tempList)
          this.applyTemplate(this.templateData[now][i])
          break
        }
      }
    },
    saveCurrentIntoTemplate() {
      if (this.submitCheck() === false) { return }
      if (this.saveState === '') {
        this.$message.error('未选择保存模板类型，错误！')
        return
      }
      this.templateDialogVisible = false
      this.invokekSavePrescription(-1, this.saveState)
      this.invokeSelectTemplate()
      // console.log('now here ' + this.saveState)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
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
</style>
