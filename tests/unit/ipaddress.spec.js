import axios from "axios";
import flushPromises from "flush-promises";
import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

const clientIpHeader = { "client^ip": "zz.zz.zz.zz" };
// const noClientIpHeader = {};
const headerToUse = { status: 200 };
jest.mock("axios");
axios.get.mockImplementation(() => Promise.resolve(headerToUse));

const OriginalDate = Date;
const dateToUse = new Date("2020-04-30 12:34:56");
jest.spyOn(global, "Date").mockImplementation(arg => {
  return arg ? new OriginalDate(arg) : dateToUse;
});
Date.now = jest.fn(() => OriginalDate.now());

describe("ファンクションのURLを取得する。", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    headerToUse.data = clientIpHeader;
  });

  it.each`
    beforeUrl                        | afterUrl
    ${"http://localhost:8080"}       | ${"http://localhost:9000/.netlify/functions/ipaddress"}
    ${"https://glipah.netlify.app/"} | ${"https://glipah.netlify.app/.netlify/functions/ipaddress"}
  `("$beforeUrl -> $afterUrl", ({ beforeUrl, afterUrl }) => {
    expect(wrapper.vm.getFunctionUrl(beforeUrl)).toBe(afterUrl);
  });

  it("ファンクションへのアクセスを確認する", done => {
    wrapper.vm.accessFunction().then(() => {
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        "http://localhost:9000/.netlify/functions/ipaddress"
      );
      done();
    });
  });

  it("ヘッダの属性にclient-ipがない場合", done => {
    wrapper.vm.accessFunction().then(() => {
      expect(wrapper.vm.ipHistory[0].ipAddress).toBe("xx.xx.xx.xx");
      done();
    });
  });
});

describe("IPアドレスの履歴の一覧表", () => {
  let wrapper;
  let table;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    table = wrapper.find("#ipHistory");
    wrapper.vm.addIpHistory(
      1,
      "zz.zz.zz.zz",
      wrapper.vm.dateToString(new Date("2020/04/30 12:34:56"))
    );
  });

  it("#8のテストケース1", () => {
    expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
    expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
    expect(table.element.rows.length).toBe(2);
    expect(table.element.rows[1].cells[1].innerHTML).toBe("zz.zz.zz.zz");
    expect(table.element.rows[1].cells[2].innerHTML).toBe(
      "2020-04-30 12:34:56"
    );
  });
  it("#8のテストケース2", async () => {
    wrapper.vm.addIpHistory(
      2,
      "yy.yy.yy.yy",
      wrapper.vm.dateToString(new Date("2020/05/01 11:11:11"))
    );
    await flushPromises();
    expect(table.element.rows.length).toBe(3);
    expect(table.element.rows[0].cells[1].innerHTML).toBe("IPアドレス");
    expect(table.element.rows[0].cells[2].innerHTML).toBe("アクセス日時");
    expect(table.element.rows[1].cells[1].innerHTML).toBe("yy.yy.yy.yy");
    expect(table.element.rows[1].cells[2].innerHTML).toBe(
      "2020-05-01 11:11:11"
    );
    expect(table.element.rows[2].cells[1].innerHTML).toBe("zz.zz.zz.zz");
    expect(table.element.rows[2].cells[2].innerHTML).toBe(
      "2020-04-30 12:34:56"
    );
  });
});
