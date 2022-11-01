<template>
  <div class="upload-container">
    <el-button icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :headers="headersData"
        :file-list="fileList"
        :show-file-list="true"
        :data="uploadData"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :action="api"
        class="editor-slide-upload"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击 上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/common/js/auth'
import ThConsts from '@/constants' /* constant */

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    // 上传参数
    uploadData: {
      type: Object,
      default: () => {
        return { targetPath: 'tinymce', autoname: '1' }
      }
    },
    api: {
      type: String,
      default: ThConsts.FILE_URLS.file_upload_url
    }
  },
  data() {
    return {
      dialogVisible: false,
      headersData: {}, // 上传的文件数据
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传完毕. 如是网络问题，请刷新页面!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(res, file) {
      if (res.code === '200' || res.code === 200) {
        const uid = file.uid
        const filename = file.name
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            if (filename === res.data.sourceName) {
              this.listObj[objKeyArr[i]].url = res.data.url
              this.listObj[objKeyArr[i]].filelink = res.data.url
              this.listObj[objKeyArr[i]].hasSuccess = true
              return
            }
          }
        }
      } else {
        this.$message({
          showClose: true,
          message: '上传失败' + res.message,
          type: 'error',
          duration: 3500
        })
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      // 设置token
      this.headersData = { 'Authorization': getToken() }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
