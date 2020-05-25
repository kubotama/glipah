<template>
  <div>
    <header><h1>Global IP Address History</h1></header>
    <div class="button-row">
      <button @click="onButtonClick" id="buttonClick">確認</button>
    </div>
    <div>
      <table id="ipHistory">
        <thead>
          <tr>
            <th>id</th>
            <th>IPアドレス</th>
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
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="black" dark v-on="on" outlined="true">
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
          >
            Googleアナリティクスサービス利用規約のページ </a
          >や
          <a href="https://policies.google.com/technologies/ads?hl=ja"
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
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    ecosystem: [
      {
        text: "vuetify-loader",
        href: "https://github.com/vuetifyjs/vuetify-loader"
      },
      {
        text: "github",
        href: "https://github.com/vuetifyjs/vuetify"
      },
      {
        text: "awesome-vuetify",
        href: "https://github.com/vuetifyjs/awesome-vuetify"
      }
    ],
    importantLinks: [
      {
        text: "Documentation",
        href: "https://vuetifyjs.com"
      },
      {
        text: "Chat",
        href: "https://community.vuetifyjs.com"
      },
      {
        text: "Made with Vuetify",
        href: "https://madewithvuejs.com/vuetify"
      },
      {
        text: "Twitter",
        href: "https://twitter.com/vuetifyjs"
      },
      {
        text: "Articles",
        href: "https://medium.com/vuetify"
      }
    ],
    whatsNext: [
      {
        text: "Explore components",
        href: "https://vuetifyjs.com/components/api-explorer"
      },
      {
        text: "Select a layout",
        href: "https://vuetifyjs.com/layout/pre-defined"
      },
      {
        text: "Frequently Asked Questions",
        href: "https://vuetifyjs.com/getting-started/frequently-asked-questions"
      }
    ]
  })
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
  margin-top: -1em;
}
</style>
