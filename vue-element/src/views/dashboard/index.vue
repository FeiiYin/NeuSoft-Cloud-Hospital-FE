<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="block">
      <el-carousel height="670px" :interval="10000">
        <el-carousel-item>
          <img src="./img/1.png" style="width:100%;height:100%">
        </el-carousel-item>
        <el-carousel-item>
          <img src="./img/2.png" style="width:100%;height:100%">
        </el-carousel-item>
        <el-carousel-item>
          <img src="./img/3.png" style="width:100%;height:100%">
        </el-carousel-item>
        <el-carousel-item>
          <img src="./img/4.png" style="width:100%;height:100%">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
