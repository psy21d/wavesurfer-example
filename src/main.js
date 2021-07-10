import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import WaveSurferVue from "wavesurfer.js-vue";

createApp(App).use(WaveSurferVue).use(PrimeVue).mount('#app')
