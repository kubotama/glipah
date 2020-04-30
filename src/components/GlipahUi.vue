<template>
  <div>{{ glipahData }}</div>
</template>

<script>
import axios from "axios";

export default {
  name: "GlipahUi",
  data() {
    return {
      glipahData: ""
    };
  },
  mounted: function() {
    const url = this.getFunctionUrl(window.location.href);
    axios.get(url).then(response => {
      this.glipahData = response.data;
    });
  },
  methods: {
    getFunctionUrl(pageUrl) {
      const url = new URL(pageUrl);
      if (url.hostname == "localhost") {
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
