<!--调整前端的时间显示问题-->
<template>
  <div style="padding:1%;" class="app-container">
    <aside>医生排班规则维护</aside>
    <el-row style="margin-bottom: 20px">
    <el-col :span="6">
      <el-button @click="addScheduleVisible = true">新增</el-button>
      <el-button @click="openConfirmDeleteMessageBox()">删除</el-button>
      <el-button @click="toggleSelection()">取消所选</el-button>
    </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      highlight-current-row
      :data="schedulingTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="schedulingRuleId" label="规则id" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="weekday" label="星期 数字" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="weekdayName" label="星期" width="120"></el-table-column>
      <el-table-column prop="departmentName" label="科室" width="120"></el-table-column>
      <el-table-column prop="departmentId" label="科室id" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="doctorName" label="排班医生" width="120"></el-table-column>
      <el-table-column prop="doctorId" label="排班医生id" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="registrationCategoryName" label="挂号类别" width="120"></el-table-column>
      <el-table-column prop="registrationCategoryId" label="挂号类别id" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="validName" label="有效状态" width="120"></el-table-column>
      <el-table-column prop="valid" label="有效状态 数字" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="noonName" label="午别" width="120"></el-table-column>
      <el-table-column prop="noon" label="午别 数字" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="limitation" label="排班限额" width="120"></el-table-column>
      <el-table-column prop="operationAccountName" label="操作员" width="120"></el-table-column>
      <el-table-column prop="operationAccountId" label="操作员id" width="120" v-if="1 === 0"></el-table-column>
      <el-table-column prop="operationDate1" label="操作日期" width="120"></el-table-column>
      <el-table-column
        prop="edit"
        label="编辑"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editScheduleRuleFormDataFunction(scope.$index, scope.row)"
          >
            <i class="el-icon-edit" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
      />
    </div>
<!--    新增排班规则对话框-->
    <el-dialog titile="新增排班规则" :visible.sync="addScheduleVisible" width="30%">
      <el-form ref="addScheduleRuleForm" :model="addScheduleRuleForm" :rules="rules" label-position="top">
        <el-form-item lable="星期" prop="weekday" label="星期" v-model="addScheduleRuleForm.weekday">
          <template>
            <el-select v-model="SelectValueWeek" filterable placeholder="请选择星期" @change="changeWeek">
              <el-option
                v-for="item in weekType"
                :key="item.weekId"
                :label="item.weekName"
                :value="item.weekId"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="addScheduleRuleForm.departmentId" label="科室" prop="departmentId">
          <template>
            <el-select v-model="SelectValueDep" filterable placeholder="请选择科室" @change="changeDep">
              <el-option
                v-for="item in departmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="addScheduleRuleForm.doctorId" label="医生‍" prop="doctorId">
          <template>
            <el-select v-model="SelectValueDoc" filterable placeholder="请选择医生" @change="changeDoc">
              <el-option
                v-for="item in doctorList"
                :key="item.doctorId"
                :label="item.doctorName"
                :value="item.doctorId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="addScheduleRuleForm.registrationCategoryId" label="挂号类别" prop="registrationCategoryId">
          <template>
            <el-select v-model="SelectValueRC" filterable placeholder="请选择号别" @change="changeRC">
              <el-option
                v-for="item in registrationCategoryType"
                :key="item.registrationCategoryId"
                :label="item.registrationCategoryName"
                :value="item.registrationCategoryId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="addScheduleRuleForm.noon" label="午别" prop="noon">
          <template>
            <el-select v-model="SelectValueNoonName" filterable placeholder="请选择号别" @change="changeN">
              <el-option
                v-for="item in noonList"
                :key="item.noonId"
                :label="item.noonName"
                :value="item.noonId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="排班限额" prop="limitation">
          <el-input v-model="addScheduleRuleForm.limitation" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addScheduleVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSchedulingRuleV('addScheduleRuleForm')">确 定</el-button>
        </span>
    </el-dialog>
<!--    修改排班规则信息-->
    <el-dialog titile="更新排班规则" :visible.sync="saveScheduleVisible" width="30%">
      <el-form ref="saveScheduleRuleForm" :model="saveScheduleRuleForm" :rules="rules" label-position="top">
        <el-form-item lable="星期" prop="weekday" label="星期" v-model="addScheduleRuleForm.weekday">
          <template>
            <el-select v-model="SelectValueWeek" filterable placeholder="请选择星期" @change="changeWeek">
              <el-option
                v-for="item in weekType"
                :key="item.weekId"
                :label="item.weekName"
                :value="item.weekId"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="saveScheduleRuleForm.departmentId" label="科室" prop="departmentId">
          <template>
            <el-select v-model="SelectValueDep" filterable placeholder="请选择科室" @change="changeDep">
              <el-option
                v-for="item in departmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="saveScheduleRuleForm.doctorId" label="医生‍" prop="doctorId">
          <template>
            <el-select v-model="SelectValueDoc" filterable placeholder="请选择医生" @change="changeDoc">
              <el-option
                v-for="item in doctorList"
                :key="item.doctorId"
                :label="item.doctorName"
                :value="item.doctorId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="saveScheduleRuleForm.registrationCategoryId" label="挂号类别" prop="registrationCategoryId">
          <template>
            <el-select v-model="SelectValueRC" filterable placeholder="请选择号别" @change="changeRC">
              <el-option
                v-for="item in registrationCategoryType"
                :key="item.registrationCategoryId"
                :label="item.registrationCategoryName"
                :value="item.registrationCategoryId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-model="saveScheduleRuleForm.noon" label="午别" prop="noon">
          <template>
            <el-select v-model="SelectValueNoonName" filterable placeholder="请选择号别" @change="changeN">
              <el-option
                v-for="item in noonList"
                :key="item.noonId"
                :label="item.noonName"
                :value="item.noonId"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="排班限额" prop="limitation">
          <el-input v-model="saveScheduleRuleForm.limitation" auto-complete="off" />
        </el-form-item>
        <template>
          <el-form-item
            label="是否有效"
            prop="valid"
          >
            <el-radio v-model="schedulingValidRadio" label="1" @change="changeVld">是</el-radio>
            <el-radio v-model="schedulingValidRadio" label="0" @change="changeVld">否</el-radio>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="saveScheduleVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSchedulingRuleV1('saveScheduleRuleForm')">确 定</el-button>
        </span>
    </el-dialog>
    <aside>
      医生排班信息
    </aside>
    <div class="block" :rule="rules" ref="valueDate">
      <span class="demonstration" style="padding-left: 10px; padding-right: 15px">请选择开始和结束日期</span>
      <el-date-picker
        v-model="valueDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        prop="valueDate"
        :picker-options="pickerOptions">
      </el-date-picker>
        <el-button @click="valueDate = ''">重选日期</el-button>
        <el-button type="primary" @click="generateSchedulingInfoV()">生成排班信息</el-button>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading2"
      highlight-current-row
      :data="schedulingTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="schedulingCode" label="疾病编码" width="120">
        <template slot-scope="scope">{{ scope.row.schedulingCode }}</template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
      />
    </div>
  </div>
</template>

<script>
import { fetchList, saveSchedulingRule, deleteSchedulingRule, generateSchedulingInfo, selectSchedulingInfo, saveSchedulingInfo, deleteSchedulingInfo} from '../../api/basicInfo/schedule';
import { fetchDepartmentList } from '../../api/basicInfo/department'
import { selectRegistration_categoryList } from '../../api/basicInfo/registration_category'
import { selectDoctorList } from '../../api/basicInfo/account'

export default {
  data() {
    return {
      totalNumber: 0,
      listLoading: false, // 加载表格
      listLoading2: false, // 医生排班信息表
      addScheduleVisible: false,
      saveScheduleVisible: false,
      SelectValueWeek: '', // 增加排班规则的选择的值
      SelectValueDep: '', // 增加排班规则的选择的值
      SelectValueDoc: '', // doctor choosing
      SelectValueRC: '',
      schedulingValidRadio: '', // 单选器
      SelectValueNoonName: '',
      dateValue: '',
      addScheduleRuleForm: {
        schedulingRuleId: null,
        weekday: '', // 排班星期：星期日 0，星期六 6
        departmentId: '', // 排班医生所在科室的编号
        doctorId: '', // 排班医生的编号
        registrationCategoryId: '', // 挂号类别，详见 registration_category 表
        registrationCategoryName: '',
        noon: '', // 午别：全天 0；上午 1；下午 2
        noonName: '',
        limitation: null, // 排班限额
        accountId: 51, // 操作员的帐号
        accountName: '舒管理'
      },
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
      schedulingTable: [],
      currentPage: 1,
      pageSize: 20,
      // js 方法的组成  的参数
      listQuery: {
        currentPage: -1,
        pageSize: -1
      },
      saveScheduleRuleForm: {
        schedulingRuleId: '', // 排班计划编号；新增时不填，修改时必填
        weekday: '', // 排班星期：星期日 0，星期六 6
        departmentId: '', // 排班医生所在科室的编号
        doctorId: '', // 排班医生的编号
        registrationCategoryId: '', // 挂号类别，详见 registration_category 表
        registrationCategoryName: '',
        noon: '', // 午别：全天 0；上午 1；下午 2
        noonName: '',
        limitation: null, // 排班限额
        accountId: 51, // 操作员的帐号
        accountName: '舒管理'
      },
      deleteSchedulingRuleParam: {
        schedulingRuleIdList: []
      },
      generateSchedulingInfoParam: {
        startDate: '1999-12-31',
        endDate: '2000-01-01'
      },
      selectSchedulingInfoParam: {
        currentPage: -1,
        pageSize: -1
      },
      saveSchedulingInfoParam: {
        schedulingInfoId: -1,
        schedulingTime: '',
        departmentId: -1,
        doctorId: -1,
        registrationCategoryId: -1,
        valid: -1,
        noon: -1,
        limitation: -1,
        remainNums: -1
      },
      deleteSchedulingInfoParam: {
        schedulingInfoIdList: []
      },
      rules: {
        weekday: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        doctorId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        registrationCategoryId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        noon: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        limitation: [
          { required: true, message: '请输入挂号限制额', trigger: 'blur' },
          { min: 1, max: 2, message: '限制额在 1 到 99', trigger: 'blur' }
        ],
        valueDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ]
      },
      // 一些常量
      aWeek: {
        0: '星期日',
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六'
      },
      weekType: [{
        weekId: 0,
        weekName: '星期日'
      },
      {
        weekId: 1,
        weekName: '星期一'
      },
      {
        weekId: 2,
        weekName: '星期二'
      },
      {
        weekId: 3,
        weekName: '星期三'
      },
      {
        weekId: 4,
        weekName: '星期四'
      },
      {
        weekId: 5,
        weekName: '星期五'
      },
      {
        weekId: 6,
        weekName: '星期六'
      }
      ],
      // 要从数据库里读取
      registrationCategoryType: [{
        registrationCategoryId: 1,
        registrationCategoryName: '普通号'
      },
      { registrationCategoryId: 2,
        registrationCategoryName: '专家号'
      },
      {
        registrationCategoryId: 3,
        registrationCategoryName: '急诊号'
      }],
      // 有效无效 选择
      validType: [{
        validId: 0,
        validName: '无效'
      }, {
        validId: 1,
        validName: '有效'
      }],
      departmentList: [{
        departmentId: '',
        departmentName: ''
      }],
      doctorList: [{
        doctorId: '',
        doctorName: ''
      }],
      noonList: [{
        noonId: 0,
        noonName: '全天'
      }, {
        noonId: 1,
        noonName: '上午'
      }, {
        noonId: 2,
        noonName: '下午'
      }],
      multipleSelection: [],
      scheduleRuleIdList: [],
      scheduleInfoIdList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      valueDate: ''
    }
  },

  created() {
    this.getList()
    this.getDropDown()
  },

  methods: {
    // 日期选择

    // change函数 series
    changeWeek(val) {
      this.$set(this.addScheduleRuleForm, 'weekday', val)
      this.$set(this.saveScheduleRuleForm, 'weekday', val)
    },
    changeDep(val) {
      this.$set(this.addScheduleRuleForm, 'departmentId', val)
      this.$set(this.saveScheduleRuleForm, 'departmentId', val)
    },
    changeDoc(val) {
      this.$set(this.addScheduleRuleForm, 'doctorId', val)
      this.$set(this.saveScheduleRuleForm, 'doctorId', val)
    },
    changeRC(val) {
      this.$set(this.addScheduleRuleForm, 'registrationCategoryId', val)
      this.$set(this.saveScheduleRuleForm, 'registrationCategoryId', val)
    },
    changeN(val) {
      this.$set(this.addScheduleRuleForm, 'noon', val)
      this.$set(this.saveScheduleRuleForm, 'noon', val)
    },
    changeVld(val) {
      this.$set(this.saveScheduleRuleForm, 'valid', val)
    },
    editScheduleRuleFormDataFunction(index, row) {
      this.saveScheduleVisible = true
      this.saveScheduleRuleForm.schedulingRuleId = row.schedulingRuleId
      this.SelectValueWeek = row.weekdayName
      this.saveScheduleRuleForm.weekday = row.weekday
      this.SelectValueDep = row.departmentName
      this.saveScheduleRuleForm.departmentId = row.departmentId
      this.SelectValueDoc = row.doctorName
      this.saveScheduleRuleForm.doctorId = row.doctorId
      this.SelectValueRC = row.registrationCategoryName
      this.saveScheduleRuleForm.registrationCategoryId = row.registrationCategoryId
      this.saveScheduleRuleForm.noon = row.noon
      this.SelectValueNoonName = row.noonName
      this.saveScheduleRuleForm.limitation = row.limitation + ''
      this.schedulingValidRadio = row.valid + ''
    },
    // 全部选择
    toggleSelection(rows) { // 这里的全选有点问题，不能取消
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 打开选择框
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
        this.scheduleRuleList = []
        for (let i = 0; i < this.multipleSelection.length; ++i) {
          this.scheduleRuleList.push(this.multipleSelection[i].schedulingRuleId)
        }
        this.scheduleRuleList = { 'schedulingRuleIdList': this.scheduleRuleList }
        console.log('List', this.scheduleRuleList)
        /**
         * 按主键删除用户信息的请求
         */
        deleteSchedulingRule(this.scheduleRuleList).then(response => {
          console.log('deleteDepartmentByPrimaryKey response: ')
          console.log(response)
          this.$message({
            type: 'success',
            message: '已删除'
          })
          this.schedulingTable = []
          this.getList()
        }).catch(error => {
          console.log('deleteDepartmentByPrimaryKey error: ')
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
    },
    // 更新表格的 变量 匹配 方法
    // 删除表格的 选择框方法
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('handle de 值是', val)
    },
    // 和 js 相匹配的方法
    getDropDown() {
      // 获取科室及挂号类别
      var query = { 'currentPage': this.currentPage, 'pageSize': 1000 }
      fetchDepartmentList(query).then(response => {
        this.departmentList = response.data.list
      }).catch(error => {
        console.log('查询科室返回出现错误 ', error)
      })
      var query1 = {
        'currentPage': this.currentPage,
        'pageSize': 500
      }
      selectRegistration_categoryList(query1).then(response => {
        this.registrationCategoryType = response.data.list
      }).catch(error => {
        console.log('查询挂号类别 返回 出现的错误 ', error)
      })
      var query2 = {
        'currentPage': this.currentPage,
        'pageSize': 500,
        'accountScope': ['00'],
        arrayFormat: 'brackets'
      }
      selectDoctorList(query2).then(response => {
        this.doctorList = response.data.list
      }).catch(error => {
        console.log('返回医生列表 错误', error)
      })
    },
    getList() { // 获取列表
      this.listLoading = true // 列表正在加载
      this.listQuery.currentPage = this.currentPage
      this.listQuery.pageSize = this.pageSize
      fetchList(this.listQuery).then(response => {
        var tableRow = {}
        this.totalNumber = response.data.list.length
        response.data.list.map((value) => {
          value = JSON.parse(value) // 后端传的是JSON
          tableRow = value
          if (value.noon === 0) {
            tableRow.noonName = '全天'
          } else if (value.noon === 1) {
            tableRow.noonName = '上午'
          } else {
            tableRow.noonName = '下午'
          }
          tableRow.weekdayName = this.aWeek[value.weekday]
          if (value.valid === 1) {
            tableRow.validName = '有效'
          } else {
            tableRow.validName = '无效'
          }
          tableRow.operationDate1 = value.operationDate
          this.schedulingTable.push(tableRow)
        })
        console.log('查询成功后的response', response)
        this.listLoading = false // 列表加载完成
      }).catch(error => {
        console.log('在返回之后出现的问题', error)
      })
    },
    saveSchedulingRuleV(formName) {
      console.log('add rule', this.addScheduleRuleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addScheduleVisible = false
          saveSchedulingRule(this.addScheduleRuleForm).then(response => {
            console.log('add after return', response)
            this.addScheduleRuleForm = {}
            this.schedulingTable = []
            this.getList()
          })
        } else {
          console.log('error add')
          return false
        }
      })
    },
    saveSchedulingRuleV1(formName) {
      console.log('edit', this.saveScheduleRuleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveScheduleVisible = false
          saveSchedulingRule(this.saveScheduleRuleForm).then(response => {
            this.schedulingTable = []
            console.log('update after return', response)
            this.saveScheduleRuleForm = {}
            this.getList()
          })
        } else {
          console.log('error save')
        }
      })
    },
    generateSchedulingInfoV() {
      if (this.valueDate === '') {
        this.$message({
          message: '请选择日期',
          type: 'warning',
          center: true
        })
        return false
      } else {
        console.log('dateValue', this.valueDate)


      }
    },
    selectSchedulingInfoV() {

    },
    saveSchedulingInfoV() {

    },
    deleteSchedulingInfoV() {

    }
  }
}
</script>

<style scoped>
</style>
