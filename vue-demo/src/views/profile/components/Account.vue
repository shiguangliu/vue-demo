<template>
  <div>
    <el-form ref="account" :model="account" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="account.gender" :label="1">男</el-radio>
        <el-radio v-model="account.gender" :label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="account.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="account.mail" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">更新</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="password" :model="password" :rules="rules">
      <el-form-item label="旧密码">
        <el-input v-model="password.oldPassword" show-password />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="password.newPassword" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePwd">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateStaff, changePwd } from '@/api/account'
import { setLocalStorage } from '@/common/js/storage'
export default {
  props: {
    account: {
      type: Object,
      default: () => {
        return {
          staffId: '',
          staffNo: '',
          name: '',
          gender: '',
          phone: '',
          mail: ''
        }
      }
    },
    password: {
      type: Object,
      default: () => {
        return {
          oldPassword: '',
          newPassword: ''
        }
      }
    }
  },
  data() {
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '姓名', value, rules: ['notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkEmail = (rule, value, callback) => {
      const check = this.$validate({ label: '邮箱', value, rules: ['notnull', 'email'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPhone = (rule, value, callback) => {
      const check = this.$validate({ label: '手机号', value, rules: ['notnull', 'mobile'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        email: [{ required: true, validator: checkEmail, trigger: 'blur' }]
      }
    }
  },

  methods: {
    submit() {
      this.$refs.account.validate((valid) => {
        if (valid) {
          const params = {
            'id': this.account.staffId,
            'staffName': this.account.name,
            'gender': this.account.gender,
            'phone': this.account.phone,
            'mail': this.account.mail
          }
          this.$handleAPI('', updateStaff, params).then(res => {
            if (res.code === '200' || res.code === 200) {
              this.$store.dispatch('staff/setMail', this.account.mail)
              this.$store.dispatch('staff/setPhone', this.account.phone)
              this.$store.dispatch('staff/setName', this.account.name)
              this.$store.dispatch('staff/setGender', this.account.gender)
              this.$message.success('修改成功')
            }
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
        }
      })
    },
    changePwd() {
      this.$refs.account.validate((valid) => {
        if (valid) {
          const params = {
            'staffId': this.account.staffId,
            'oldPwd': this.password.oldPassword,
            'newPwd': this.password.newPassword
          }
          const newPassword = this.password.newPassword
          this.$handleAPI('', changePwd, params).then(res => {
            if (res.code === '200' || res.code === 200) {
              this.password.oldPassword = ''
              this.password.newPassword = ''
              setLocalStorage('password', newPassword)
              this.$message.success('修改成功')
            }
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
        }
      })
    }
  }
}
</script>
