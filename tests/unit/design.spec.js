import axios from "axios";
import cheerio from "cheerio";

describe("画面のデザインを改善する。 #11", () => {
  it.skip("タイトルがGLIPAH: Global IP Address Historyであることを確認する。", async () => {
    await axios.get("http://localhost:8080").then(response => {
      expect(
        cheerio
          .load(response.data)("title")
          .text()
      ).toBe("GLIPAH: Global IP Address History");
    });
  });
});
