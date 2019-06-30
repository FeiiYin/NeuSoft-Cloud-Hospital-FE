<template>
  <!-- <div class="app-container">
    <el-button @click="downLoad">
      here
    </el-button>
    <el-button @click="getBucket">
      here
    </el-button>
    <el-button @click="upLoad">
      upload
    </el-button>
    <img v-bind:src="url"/>
    <el-upload
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :http-request="handleUpload"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :limit="10"
      :show-file-list="true"
      :file-list="fileList">
      <el-button
        type="success"
        icon="el-icon-upload"
        size="mini">添加附件
      </el-button>
    </el-upload>

    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :http-request="handleUpload"
      :limit="2"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div> -->
</template>
<script>
export default {
}
</script>
