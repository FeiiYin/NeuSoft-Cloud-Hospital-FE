<template>
  <div>
    <div class="wordbox">
      <h2>门诊挂号管理</h2>
      <hr>
      <div style="display:inline-block;">
        <label class="radio-label" style="padding-left:0;">门诊挂号登记号 </label>
        <el-input v-model="filename" placeholder="100001" style="width:345px;margin-left:20px;" prefix-icon="el-icon-document" />
      </div>
      <el-button style="margin:0 0 20px 350px;" type="primary" icon="document" @click="handleDownload">
        预约选择
      </el-button>
      <el-button style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">
        挂号
      </el-button>
      <el-button style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">
        补收挂号费
      </el-button>
      <div />
      <svg-icon style="display:inline-block;margin-right:20px;" icon-class="peoples" /> Personal Info
      <hr>
      <div class="row">
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">姓名</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">性别</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">年龄</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">出生日期</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
      </div>

      <div class="row">
        <div class="word_input_2">
          <h4 class="row_h4">身份证号</h4>
          <input id="projectinput1" type="text" class="registration_input_2" placeholder="" name="fname">
        </div>
        <div class="word_input_2">
          <h4 class="row_h4">家庭住址</h4>
          <input id="projectinput1" type="text" class="registration_input_2" placeholder="" name="fname">
        </div>
      </div>

      <svg-icon style="display:inline-block;margin-right:20px;margin-top:20px;" icon-class="tab" /> Required Info
      <hr>

      <div class="row">
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">病历号</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">结算类别</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">医疗证号</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">医疗类别</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
      </div>

      <div class="row">
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">看诊日期</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">号列</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">挂号科室</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">看诊医生</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
      </div>

      <div class="row">
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">挂号来源</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">医保诊断</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">病历本</h4>
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </div>
        <div class="word_input_4">
          <h4 style="margin-bottom:2px;">应收金额</h4>
          <input id="projectinput1" type="text" class="registration_input" placeholder="" name="fname">
        </div>
      </div>

      <div style="margin-top:80px;margin-bottom:40px;text-align:center">
        <el-button type="primary">提交</el-button>
        <el-button type="info">清空</el-button>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      radio: '1'
    }
  }
}
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
</style>
