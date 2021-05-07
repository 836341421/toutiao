<template>
  <div>
    <van-nav-bar title="黑马头条 - 登录" fixed />
    <div class="top">
      <van-form @submit="onSubmit">
        <van-field
          required
          v-model="user.mobile"
          name="mobile"
          label="手机号码"
          placeholder="请输入手机号码"
          :rules="[
            {
              required: true,
              message: '请输入正确手机号',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          required
          v-model="user.code"
          name="code"
          type="number"
          label="验证码"
          placeholder="请输入正确的验证码"
          :rules="[
            {
              required: true,
              message: '请填写6位正确验证码',
              pattern: /^\d{6}$/,
            },
          ]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :loading="isLoding"
            :disabled="isLoding"
            loading-text="登陆中..."
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import Notify from '@/ui/Notify'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      isLoding: false, // 控制登录中状态
      user: {
        // 重要: 尽量参数名直接和后端的参数名一致, 直接发这个对象咯
        mobile: '13888888888',
        code: '246810'
      }
    }
  },
  methods: {
    ...mapMutations(['setRefreshToken', 'setToken']),
    async onSubmit (values) {
      this.isLoding = true
      const [err, res] = await loginAPI(values)
      if (err) Notify({ type: 'danger', message: '手机号或验证码错误' })
      else {
        Notify({
          type: 'success',
          message: '登录成功',
          onClose: () => {
            // 通知框关闭
            this.$router.push({
              name: 'Layout'
            })
          }
        })
        this.setRefreshToken(res.data.data.refresh_token)
        this.setToken(res.data.data.token)
        // 跳转页面
      }
      this.isLoding = false
    }
  }
}
// 目标3: 把登录成功token值, 保存在SessionStorage一份, 保存在Vuex里
// 为什么: vuex比本地快
</script>

<style lang="less" scoped>
.top {
  padding-top: 46px;
}
</style>
