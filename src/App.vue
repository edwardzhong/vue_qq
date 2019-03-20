<template lang="pug">
	div#app
		Modal
		img(alt="Vue logo" src="./assets/logo.png")
		router-view
</template>

<script>
import Modal from "./components/common/Modal.vue";
export default {
  name: "app",
  components: { Modal }
};
</script>

<style type="text/css">
html {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
  font-size: 14px;
  box-sizing: border-box;
  color: #555;
  width: 100%;
  height: 100%;
  line-height: 1.6;
  user-select: none; /* 文本不能选择 */
  -webkit-text-size-adjust: 100%; /* 关闭字体大小自动调整功能(iPhone 和 Android 的浏览器纵向 (Portrate mode) 和橫向 (Landscape mode) 模式皆有自动调整字体大小的功能) */
  -webkit-tap-highlight-color: transparent; /* 消除ios点击后的背景 */
  font-size-adjust: 100%;
}
body {
  margin: 0;
  height: 100%;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
ul,
ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

a,
a:active,
a:hover {
  text-decoration: none;
}
select {
  appearance: none;
}
input,
textarea {
  /* appearance: none; */
  outline: none;
  resize: none;
}
#app {
  height: 100%;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
