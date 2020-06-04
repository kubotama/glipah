import axios from "axios";
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

  it("確認ボタンをクリックして呼び出されるメソッドを確認する", done => {
    const accessFunction = jest.fn();
    wrapper.setMethods({ accessFunction });
    wrapper.find("#buttonClick").trigger("click");
    expect(accessFunction).toHaveBeenCalledTimes(1);
    done();
  });
});

describe("IPアドレスの履歴の一覧表", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
    wrapper.vm.addIpHistory(
      1,
      "zz.zz.zz.zz",
      wrapper.vm.dateToString(new Date("2020/04/30 12:34:56"))
    );
  });
});

describe("異常系", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
  });

  it("ファンクションにアクセスできない場合", () => {
    axios.get.mockRejectedValue(new Error("Network Error."));
    expect(wrapper.vm.accessFunction()).rejects.toThrow("Network Error.");
  });

  it("#27: webページのURLを正しく取得できない場合", () => {
    expect(() => {
      wrapper.vm.getFunctionUrl("xxx");
    }).toThrow("Invalid URL:");
  });
});
