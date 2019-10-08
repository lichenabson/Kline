<template>
  <div id="app">
    <div id="kline_container"></div>
  </div>
</template>

<script>

import Kline from './test/entry'

export default {
  name: 'app',
  mounted() {
    var kline = new Kline({
        element: "#kline_container",
        width: 1200,
        height: 650,
        theme: 'light', // light/dark
        language: 'zh-cn', // zh-cn/en-us/zh-tw
        ranges: ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
        symbol: "BTC",
        symbolName: "BTC/USD",
        type: "123", // poll/socket
        url: "http://192.168.1.126:9090/examples/mock.json",
        limit: 1000,
        intervalTime: 5000,
        debug: true,
        onResize: function(width, height) {
            console.log("chart resized: " + width + " " + height);
        }
    });
     kline.draw();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#kline_container {
  margin: auto;
}

</style>
