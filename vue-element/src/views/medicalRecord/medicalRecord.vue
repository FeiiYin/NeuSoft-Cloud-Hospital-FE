<template>
  <div class="app-container">
    <el-container>
      <transition name="el-zoom-in-left">
        <el-aside width="500px" v-show="model_panel_show">
          <aside style="background:#E0E0E0">
            病历模板
            <el-button type="primary" plain style="float:right">新建</el-button>
          </aside>
          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick">
          </el-tree>
        </el-aside>
      </transition>
      <el-main>
        <aside>
          <el-button type="primary" id="show_button" v-on:click="openModelPanel()">
              <i class="el-icon-caret-left" v-show="model_panel_show"/>
              <i class="el-icon-caret-right" v-show="!model_panel_show"/>
          </el-button>
          <span style="margin-left:30px;">门诊病历消息</span>
          
        </aside>
        <el-container>
          <el-main id="subOutputRank-print">
            <h3>
              病史内容
            </h3>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="主诉" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="现病史" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="既往史" prop="name">
                <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
              </el-form-item>
              <el-form-item label="个人史" prop="name">
                <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
              </el-form-item>
              <el-form-item label="体格检查" prop="name">
                <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
              </el-form-item>
              <el-form-item label="辅助检查" prop="name">
                <el-input v-model="ruleForm.name" type="textarea" :rows="4"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-button @click="resetForm('ruleForm')">存储</el-button>
                <el-button @click="doPrint('ruleForm')">预览</el-button>
              </el-form-item>
            </el-form>
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-main>

      <!--模板的对话框-->
      <el-dialog title="模板预览" :visible.sync="modelDialogVisible" width="30%">
        <el-form ref="modelForm" :model="modelForm">
          <el-form-item label="主诉" prop="name">
            <el-input v-model="modelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="现病史" prop="name">
            <el-input v-model="modelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="既往史" prop="name">
            <el-input v-model="modelForm.name" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="个人史" prop="name">
            <el-input v-model="modelForm.name" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="体格检查" prop="name">
            <el-input v-model="modelForm.name" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="辅助检查" prop="name">
            <el-input v-model="modelForm.name" type="textarea" :rows="2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addChargeFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="invokeAddChargeItem('addChargeForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>

</template>

<script>
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
      model_panel_show: false,
      
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      // 模板的树形目录      
      data: [
        {
          label: '全员',
          children: []
        }, 
        {
          label: '科室',
          children: []
        }, 
        {
          label: '个人',
          children: [
            {
              label: '病历模板',
              children: []
            }, {
              label: '综合模板',
              children: [
                {
                  label: '内科模板'
                }
              ]
            }
          ]
        }
      ],
      // 树形列表的类名
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 模板的对话框
      modelDialogVisible: false,
      modelForm: {
        name: '',
      }
    }
  },
  methods: {
    openModelPanel() {
      this.model_panel_show = ! this.model_panel_show;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 树形目录检测
    handleNodeClick(data) {
      if (data.isLeaf) {
        console.log(this.modelDialogVisible)
        this.modelDialogVisible = true
        console.log(this.modelDialogVisible)
      } else {
        console.log('jioasdjf')
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    doPrint(e){
        let subOutputRankPrint = document.getElementById('subOutputRank-print');
        console.log(subOutputRankPrint.innerHTML);
        let newContent =subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
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
