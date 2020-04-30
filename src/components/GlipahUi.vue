<template>
  <div>
    <table id="ipHistory">
      <thead>
        <tr>
          <th>IPアドレス</th>
          <th>アクセス日時</th>
        </tr>
      </thead>
      <tbody v-for="item in ipHistory" :key="item.ipAddress">
        <tr>
          <td>{{ item.ipAddress }}</td>
          <td>{{ item.accessDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GlipahUi",
  data() {
    return {
      glipahData: "",
      ipHistory: [
        { ipAddress: "zz.zz.zz.zz", accessDate: "2020/04/30 12:34:56" }
      ]
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
