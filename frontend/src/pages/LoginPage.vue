<template>
  <main class="page">
    <van-nav-bar title="登录" fixed placeholder />
    <section class="panel">
      <h1>非遗工坊预约</h1>
      <p>默认账号：13800000002 / demo123</p>
      <van-form @submit="onSubmit">
        <van-field v-model="phone" label="手机号" placeholder="请输入手机号" />
        <van-field v-model="password" label="密码" type="password" placeholder="请输入密码" />
        <div class="submit">
          <van-button block round type="primary" native-type="submit">登录</van-button>
        </div>
      </van-form>
      <div class="quick">
        <van-button size="small" plain type="primary" @click="fill('13800000001')">传承人</van-button>
        <van-button size="small" plain type="primary" @click="fill('13800000002')">学员</van-button>
        <van-button size="small" plain type="primary" @click="fill('13800000003')">管理员</van-button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';

const route = useRoute();
const router = useRouter();
const { login } = useAuth();
const phone = ref('13800000002');
const password = ref('demo123');

function fill(value: string) {
  phone.value = value;
  password.value = 'demo123';
}

async function onSubmit() {
  await login({ phone: phone.value, password: password.value });
  router.replace((route.query.redirect as string) || '/workshops');
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28px 16px;
  background: #f5f7f8;
}
.panel {
  padding: 20px 0;
}
h1 {
  margin: 0 0 8px;
  font-size: 26px;
}
p {
  margin: 0 0 20px;
  color: #7a8490;
  font-size: 13px;
}
.submit {
  padding: 18px 0;
}
.quick {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>

