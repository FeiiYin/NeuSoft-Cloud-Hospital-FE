<template>
  <div class="app-container">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      COS: null,
      url: null,
      Bucket: 'neusoft-hospital-1259205273',
      Region: 'ap-beijing',
      SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
      SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE',
      cos: null,

      fileList: [],

      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    var COS = require('cos-js-sdk-v5')
    this.cos = new COS({
      SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
      SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE'
    })
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.cos.deleteObject({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: file.name
      }, function(err, data) {
        console.log(err || data)
      })
    },
    handleExceed() {
      this.$message.warning({
        message: '不能超过10个附件'
      })
    },
    handleUpload(param) {
      const self = this
      const file = param.file
      if (!file) return
      const originName = file.name
      const originSize = file.size
      const originType = file.type
      console.log('fileName ' + originName)
      console.log('originSize ' + originSize)
      console.log('originType ' + originType)

      const bucket = this.Bucket
      const region = this.Region
      self.cos.putObject({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: file.name,
        Body: file
      }, function(err, data) {
        console.log(err || data)
        if (err) {
          self.$message.error({
            message: err.error
          })
        } else {
          const file_path = 'https://' + bucket + '.cos.' + region + '.myqcloud.com/' + file.name
          console.log('文件上传成功 ' + file_path) // 得到的file_path 就是上传到腾讯云的路径，将这个URL传给后端即可
        }
      })
    },
    downLoad() {
      var COS = require('cos-js-sdk-v5')
      const cos = new COS({
        SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
        SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE'
      })
      const url = cos.getObjectUrl({
        Bucket: this.Bucket, // Bucket 格式：test-1250000000
        Region: this.Region,
        Key: '1.jpg'
      }, function(err, data) {
        console.log(err || data && data.Url)
      })
      console.log(url)
      this.url = url
    },
    getBucket() {
      var COS = require('cos-js-sdk-v5')
      const cos = new COS({
        SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
        SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE'
      })
      var directory = cos.getBucket({
        Bucket: this.Bucket,
        Region: this.Region,
        Prefix: '1' // 这里传入列出的文件前缀
      }, function(err, data) {
        console.log(err || data.Contents)
      })
      console.log(directory)
    },
    upLoad() {
      var COS = require('cos-js-sdk-v5')
      const cos = new COS({
        SecretId: 'AKIDHQK4h66DvPgiWGF6C2mKdhdMtBFBCPiu',
        SecretKey: '7zhHdqnU2LSPDsPhyf7f3IF5h74mGWbE'
      })
      cos.putObject({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: '1.txt', /* 必须 */
        Body: '1111111',
        // onTaskReady: function (tid) {
        //   TaskId = tid;
        //   console.log('onTaskReady', tid);
        // },
        // onTaskStart: function (info) {
        //   console.log('onTaskStart', info);
        // },
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>
