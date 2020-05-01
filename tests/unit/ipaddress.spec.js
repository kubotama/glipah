import axios from "axios";
import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

jest.mock("axios");
axios.get.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    data: "zz.zz.zz.zz"
  })
);

const OriginalDate = Date;
const dateToUse = new Date("2020-04-30 12:34:56");
jest.spyOn(global, "Date").mockImplementation(arg => {
  return arg ? new OriginalDate(arg) : dateToUse;
});

describe("ファンクションのURLを取得する。", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
  });

  it.each`
    beforeUrl                        | afterUrl
    ${"http://localhost:8080"}       | ${"http://localhost:9000/.netlify/functions/ipaddress"}
    ${"https://glipah.netlify.app/"} | ${"https://glipah.netlify.app/.netlify/functions/ipaddress"}
  `("$beforeUrl -> $afterUrl", ({ beforeUrl, afterUrl }) => {
    expect(wrapper.vm.getFunctionUrl(beforeUrl)).toBe(afterUrl);
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      "http://localhost:9000/.netlify/functions/ipaddress"
    );
  });
});

describe("IPアドレスの履歴の一覧表", () => {
  let wrapper;
  let table;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    table = wrapper.find("#ipHistory");
  });

  it("#8のテストケース1", () => {
    expect(table.element.rows[0].cells[0].innerHTML).toBe("IPアドレス");
    expect(table.element.rows[0].cells[1].innerHTML).toBe("アクセス日時");
    expect(table.element.rows.length).toBe(2);
    expect(table.element.rows[1].cells[0].innerHTML).toBe("zz.zz.zz.zz");
    expect(table.element.rows[1].cells[1].innerHTML).toBe(
      "2020-04-30 12:34:56"
    );
  });
});

// TODO: 履歴が複数行のテストを作成する。
