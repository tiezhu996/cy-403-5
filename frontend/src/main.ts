import { createPinia } from 'pinia';
import Vant from 'vant';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vant/lib/index.css';
import './styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Vant);
app.config.errorHandler = (error) => {
  console.error(error);
};
app.mount('#app');

