<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ systemTitle }}</h3>
      </div>

      <el-form-item prop="staffNo">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="staffNo"
          v-model="loginForm.staffNo"
          placeholder="员工号/手机号"
          name="staffNo"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="authCode">
        <span class="svg-container">
          <i class="fa fa-key fa-fw" />
        </span>
        <el-input
          ref="authCode"
          v-model="loginForm.authCode"
          placeholder="验证码"
          name="authCode"
          type="text"
          tabindex="3"
          clearable
          autocomplete="off"
        />
        <div class="identify-code">
          <valid-code
            v-model="imageAuthCode"
            :refresh="imageAuthCodeRefresh"
          />
        </div>
      </el-form-item>

      <el-row class="remember">
        <el-col :span="16" :xs="24">
          <el-checkbox
            v-model="loginForm.remember"
            style="color: rgb(100, 100, 100)"
          >
            记住密码
          </el-checkbox>
        </el-col>
        <el-col v-if="false" :span="8" :xs="24" class="link">
          <router-link
            class="forget"
            tag="a"
            target="_blank"
            to="/retrieve"
            :style="`color: ${theme}`"
          >
            忘记密码?
          </router-link>
        </el-col>
      </el-row>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validUsername } from '@/common/js/validate'
import ValidCode from '@/components/ValidCode'
import { setLocalStorage, getLocalStorage } from '@/common/js/storage'
import settings from '@/settings' // 系统设定参数

export default {
  name: 'Login',
  components: {
    ValidCode
  },
  data() {
    const validateStaffNo = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的登录账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validateAuthCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (value.toUpperCase() !== this.imageAuthCode.toUpperCase()) {
        callback(new Error('验证码不正确'))
      } else {
        callback()
      }
    }
    return {
      systemTitle: settings.title, // 系统标题
      imageAuthCode: '', // 自动生成的图片验证码
      imageAuthCodeRefresh: 0, // 刷新验证码
      loginForm: {
        staffNo: '',
        password: '',
        authCode: '',
        remember: false
      },
      loginRules: {
        staffNo: [{ required: true, trigger: 'blur', validator: validateStaffNo }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        authCode: [{ required: true, trigger: ['blur', 'change'], validator: validateAuthCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      identifyCode: '',
      otherQuery: {}
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'currentSystemId'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.reloadRemember()
  },
  mounted() {
    if (this.loginForm.staffNo === '') {
      this.$refs.staffNo.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.authCode === '') {
      this.$refs.authCode.focus()
    }
  },
  destroyed() {

  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 初始化登录信息
    reloadRemember() {
      if (getLocalStorage('remember') === 'true') {
        this.loginForm.remember = true
        this.loginForm.staffNo = getLocalStorage('staffNo')
        this.loginForm.password = getLocalStorage('password')
      }
    },
    // 记住登录信息
    saveRemember() {
      if (this.loginForm.remember === true) {
        setLocalStorage('remember', this.loginForm.remember)
        setLocalStorage('staffNo', this.loginForm.staffNo)
        setLocalStorage('password', this.loginForm.password)
      } else if (this.loginForm.remember === false) {
        setLocalStorage('remember', this.loginForm.remember)
        setLocalStorage('staffNo', '')
        setLocalStorage('password', '')
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const reqdata = {
            staffNo: this.loginForm.staffNo,
            password: this.loginForm.password,
            subSystemId: this.currentSystemId
          }
          // 记住登录
          this.saveRemember()
          this.$store.dispatch('staff/login', reqdata)
            .then(() => {
              // 登录成功，跳转指定页面
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery, replace: true })
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
              this.imageAuthCodeRefresh = Math.random() // 刷新验证码
              this.loginForm.authCode = ''
            })
        } else {
          this.imageAuthCodeRefresh = Math.random() // 刷新验证码
          this.loginForm.authCode = ''
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .identify-code {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    width: 102px; /*设置图片显示的宽*/
    height: 43px; /*图片显示的高*/
    background: #e2e2e2;
    margin: 2px;
    border-radius: 5px;
  }
  .img-identify-code{
    height: 40px;
    width: 100px;
    cursor: pointer;
  }
  .i-identify-code {
    height: 40px;
    width: 100px;
    cursor: pointer;
    font-size: 24px;
    text-align: center;
    color:#f56c6c;
    margin: 8px auto 5px auto;
  }
  .remember{
    display: flex;
    margin-bottom: 20px;
    color: #fff;
    .forget{
      flex: 1;
      width: 90px;
      font-size: 14px;
      text-align: right;
      margin-right: 5px;
      color: $light_gray;
    }
    .link{
      text-align: right;
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
