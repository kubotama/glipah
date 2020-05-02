import axios from "axios";
import cheerio from "cheerio";

describe("画面のデザインを改善する。 #11", () => {
  it("タイトルをGLIPAH: Global IP Address Historyに変更する。", async () => {
    const response = await axios.get("http://localhost:8080");
    const body = response.data;
    const $ = cheerio.load(body);
    const title = $("title").text();
    expect(title).toBe("GLIPAH: Global IP Address History");
  });
});
