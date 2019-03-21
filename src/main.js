import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/base.min.css'
import '../public/fontello.css'

Vue.config.productionTip = false
Vue.directive('drag', {
	bind: function (el) {
		el.onmousedown = (e) => {
			//算出鼠标相对元素的位置
			let disX = e.clientX - el.offsetLeft;
			let disY = e.clientY - el.offsetTop;

			document.onmousemove = (e) => {
				//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
				let left = e.clientX - disX;
				let top = e.clientY - disY;

				//移动当前元素
				el.style.left = left + 'px';
				el.style.top = top + 'px';
			};
			document.onmouseup = (e) => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	}
});
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
