<template>
  <div>
    <header><h1>Global IP Address History</h1></header>
    <div class="button-row">
      <v-btn
        @click.native="onButtonClick"
        id="buttonClick"
        class="button-click"
      >
        確認
      </v-btn>
    </div>
    <div>
      <table id="ipHistory">
        <thead>
          <tr>
            <th>IPアドレス</th>
            <th>IPアドレス</th>
            <th>アクセス日時</th>
            <th>アクセス日時</th>
          </tr>
        </thead>
        <tbody v-for="item in ipHistory" :key="item.id">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.ipAddress }}</td>
            <td>{{ item.accessDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="border-line" />
    <div class="text-right dialog-privacy">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn color="black" dark v-on="on" outlined class="button-privacy">
            プライバシーポリシー
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            プライバシーポリシー
          </v-card-title>

          <v-card-text>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
            この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
            この規約に関しての詳細は<a
              href="https://marketingplatform.google.com/about/analytics/terms/jp/"
              target="”_blank”"
            >
              Googleアナリティクスサービス利用規約のページ </a
            >や
            <a
              href="https://policies.google.com/technologies/ads?hl=ja"
              target="”_blank”"
              >Googleポリシーと規約ページ</a
            >をご覧ください。
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Dexie from "dexie";

export default {
  name: "GlipahUi",

  data() {
    return {
      ipHistory: [],
      dialog: false
    };
  },
  methods: {
    onButtonClick() {
      this.accessFunction();
    },
    loadHistory() {
      const db = new Dexie("Glipah");
      this.ipHistory = [];
      db.version(1).stores({ access: "++id, ipAddress" });
      return db.access.toArray().then(addresses => {
        addresses.forEach(address => {
          this.addIpHistory(address.id, address.ipAddress, address.accessDate);
        });
      });
    },
    /**
     * ファンクションにアクセスしてIPアドレスとアクセス日時をデータベースに保存する。
     */
    accessFunction() {
      return axios
        .get(this.getFunctionUrl(window.location.href))
        .then(response => {
          /**
           * @type {string} アクセス元のIPアドレス
           */
          const ipAddress = this.getIpAddress(response.data);
          /**
           * @type {string} アクセスした日時
           */
          const accessDate = this.dateToString(new Date());

          const db = new Dexie("Glipah");
          db.version(1).stores({ access: "++id, ipAddress" });
          return db.access
            .add({
              ipAddress: ipAddress,
              accessDate: accessDate
            })
            .then(() => {
              return this.loadHistory();
            });
        });
    },
    /**
     * ipHistory配列の先頭にIPアドレスとアクセス日時を追加する。
     * @param {integer} id データベース項目のid
     * @param {string} ipAddress アクセス元のIPアドレス
     * @param {string} accessDate アクセスした日時
     */
    addIpHistory(id, ipAddress, accessDate) {
      this.ipHistory.unshift({
        id: id,
        ipAddress: ipAddress,
        accessDate: accessDate
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
  margin-top: 1em;
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
.button-row {
  text-align: center;
}
.button-click {
  border-style: solid;
}
.button-privacy {
  margin-left: auto;
  margin-right: 0px;
}
.border-line {
  margin-top: 10pt;
  margin-bottom: 10pt;
}

.dialog-privacy {
  margin-right: 10pt;
  margin-bottom: 10pt;
}
</style>
