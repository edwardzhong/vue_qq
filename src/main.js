import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/base.min.css'
import '../public/fontello.css'

const app = createApp(App)

app.config.productionTip = false
app.directive('drag', {
	bind: function (el) {
		el.onmousedown = (e) => {
			//算出鼠标相对元素的位置
			let disX = e.clientX - el.parentNode.offsetLeft;
			let disY = e.clientY - el.parentNode.offsetTop;

			document.onmousemove = (e) => {
				//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
				let left = e.clientX - disX;
				let top = e.clientY - disY;

				//移动当前元素
				el.parentNode.style.left = left + 'px';
				el.parentNode.style.top = top + 'px';
			};
			document.onmouseup = (e) => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	}
});

app.use(router)
app.use(store)
app.mount('#app')
