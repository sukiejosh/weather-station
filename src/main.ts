import ApexCharts from 'apexcharts';
import "element-plus/theme-chalk/src/message.scss";
import "uno.css";
import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import "~/styles/index.scss";
import App from "./App.vue";

const app = createApp(App);
// app.use(ElementPlus);
app.use(VueApexCharts);

app.config.globalProperties.$apexcharts = ApexCharts;

// Add this when into a TypeScript codebase
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $apexcharts: typeof ApexCharts;
    }
}
app.mount("#app");
