<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
    />
    <div class="bg-all">
      <div class="header-all">
        <b>马甲头像库</b>
        <el-checkbox v-model="allSelected" style="padding-left: 15px" @change="handleAllSelect">全选</el-checkbox>
      </div>
      <el-row :gutter="20">
        <el-col v-for="(avatar,index) in avatarList" :key="avatar.id" :xs="12" :sm="12" :lg="3">
          <el-card class="box-card">
            <div>
              <el-checkbox v-model="selectAvatar[index].checked">选择</el-checkbox>
            </div>
            <div>
              <el-image
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + avatar.avatarUrl"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <page-dialog
      :visible.sync="dialogUpload.visible"
      :title="dialogUpload.title"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.visible"
        :upload-data="{targetPath: 'robot-avatar',autoname: '1'}"
        :upload-nums="20"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, deleteApi, createApi } from '@/api/robot/avatar'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
export default {
  components: {
    PageFilter,
    PageDialog,
    Upload
  },
  data() {
    return {
      avatarList: [],
      selectAvatar: [],
      allSelected: false,
      curUrl: '',
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', loading: '', event: 'create', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: '', event: 'delete', show: false }
        ]
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: '头像上传',
        visible: false,
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeUpload', show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  mounted() {
    this.getList()
    this.initDataPermits()
  },
  methods: {
    initDataPermits() {
      this.$initDataPermits('robotAvatar', this.filterInfo.list) // 条件区域操作权限
    },
    getList() {
      this.$handleAPI('', getListApi, '').then(res => {
        if (res.code === 200) {
          this.avatarList = res.data.listAvatars
          this.avatarList.forEach(item => {
            this.selectAvatar.push({ id: item.id, checked: false })
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    handleAllSelect() {
      if (this.allSelected) {
        this.selectAvatar.forEach(item => {
          item.checked = true
        })
      } else {
        this.selectAvatar.forEach(item => {
          item.checked = false
        })
      }
    },
    handleClick(event, data) {
      switch (event) {
        case 'create':
          this.dialogUpload.visible = true
          break
        case 'delete':
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var arr = []
            const deleteArr = []
            var avartarNew = []
            for (var i = 0; i < this.selectAvatar.length; i++) {
              if (this.selectAvatar[i].checked) {
                deleteArr.push(this.selectAvatar[i].id)
              } else {
                arr.push(this.selectAvatar[i])
                avartarNew.push(this.avatarList[i])
              }
            }
            this.selectAvatar = arr
            this.$handleAPI('', deleteApi, { ids: deleteArr, staffId: this.$store.state.staff.staffId }).then(res => {
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success',
                  duration: 3500
                })
                this.selectAvatar = arr
                this.avatarList = avartarNew
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          })
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          break
      }
    },
    handleEvent(event, data) {
      const self = this
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.fileList) {
            data.fileList.forEach(item => { // 支持多图上传
              self.$handleAPI('', createApi, { avatarUrl: item.relativeUrl, updateBy: this.$store.state.staff.staffId }).then(res => {
                if (res.code === 200) {
                  this.avatarList.push(res.data)
                  this.selectAvatar.push({ id: res.data.id, checked: false })
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            })
          }
          this.dialogUpload.visible = false
          break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .tab-container {
    margin: 30px;
  }
  .bg-all {
    background: rgb(245, 242, 242);
    padding: 10px;
    .header-all {
      height: 50px;
      padding: 14px;
      align-items: center;
      font-size: 14px;
    }
  }
 .box-card {
    width: 80%;
    margin: 10px 10px;
    border: 1px solid #13C0C5;
    font-size: 16px;
    .el-card__header .el-button {
      font-size: 16px;
    }
    .el-card__body {
      padding: 10px;
    }
  }
</style>

