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
      ipHistory: []
    };
  },
  mounted: function() {
    axios.get(this.getFunctionUrl(window.location.href)).then(response => {
      this.addIpHistory(response.data, new Date());
    });
  },
  methods: {
    /**
     * ipHistory配列の先頭にIPアドレスとアクセス日時を追加する。
     * @param {string} ipAddress アクセス元のIPアドレス
     * @param {Date} date アクセスした日時
     */
    addIpHistory(ipAddress, date) {
      /**
       * @type {Object} 日時のフォーマット
       * 年は4桁、月、日、時、分、秒は2桁
       * 1桁の数字の場合は十の位に0を入れる
       */
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      /**
       * @type {string} アクセスした日時を文字列に変換した結果
       */
      const accessDate = Intl.DateTimeFormat("ja-JP", options).format(date);
      this.ipHistory.unshift({
        ipAddress: ipAddress,
        accessDate: accessDate
      });
    },
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
