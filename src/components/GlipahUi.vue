<template>
  <div></div>
</template>

<script>
import axios from "axios";

export default {
  name: "GlipahUi",
  mounted: function() {
    const url = this.getFunctionUrl(window.location.href);
    axios.get(url).then(response => {
      console.log(response.data);
    });
  },
  methods: {
    getFunctionUrl(pageUrl) {
      const url = new URL(pageUrl);
      if (url.port == 8080) {
        url.port = 9000;
      }
      url.pathname = ".netlify/functions/ipaddress";
      return url.href;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
