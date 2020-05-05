<template>
  <div>
    <header><h1>Global IP Address History</h1></header>
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
import Dexie from "dexie";

export default {
  name: "GlipahUi",
  data() {
    return {
      ipHistory: []
    };
  },
  mounted: function() {
    const db = new Dexie("Glipah");
    db.version(1).stores({ access: "++id" });
    db.open();

    axios.get(this.getFunctionUrl(window.location.href)).then(response => {
      this.addIpHistory(response.data, new Date());
    });
  },
  methods: {
    /**
     * ipHistory配列の先頭にIPアドレスとアクセス日時を追加する。
     * @param {json} headers アクセス元のIPアドレス
     * @param {Date} date アクセスした日時
     */
    addIpHistory(headers, date) {
      this.ipHistory.unshift({
        ipAddress: this.getIpAddress(headers),
        accessDate: this.dateToString(date)
      });
    },

    /**
     * Dateを文字列に変換する
     * 年は4桁、月、日、時、分、秒は2桁
     * 1桁の数字の場合は十の位に0を入れる
     * @param {Date} date アクセスした日時
     * @returns {string} 文字列に変換した日時
     */
    dateToString(date) {
      return Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(date);
    },

    /**
     * リクエストのheadersからIPアドレスを取り出す。
     * @param {json} headers ファンクションにアクセスしたときのリクエストのheaders
     * @returns {string} アクセス元のIPアドレス
     */
    getIpAddress(headers) {
      /**
       * @type {string} IPアドレス
       * リクエストのheadersのclient-ip属性から取得する
       * client-ip属性が設定されていない場合、xx.xx.xx.xx.とする
       */
      let ipAddress;
      if (headers["client-ip"]) {
        ipAddress = headers["client-ip"];
      } else {
        ipAddress = "xx.xx.xx.xx";
      }
      return ipAddress;
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
<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
  margin-top: -1em;
  border-collapse: collapse;
}
td,
th {
  border: 1px solid;
  margin: 0;
  padding: 0.2em 3em;
}
h1 {
  text-align: center;
}
</style>
