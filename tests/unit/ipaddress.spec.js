import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

describe("ファンクションのURLを取得する。", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(GlipahUi);
  });

  it.each`
    beforeUrl                                           | afterUrl
    ${"http://localhost:8080"}                          | ${"http://localhost:9000/.netlify/functions/ipaddress"}
    ${"https://kubotama-sample-functions.netlify.app/"} | ${"https://kubotama-sample-functions.netlify.app/.netlify/functions/ipaddress"}
  `("$beforeUrl -> $afterUrl", ({ beforeUrl, afterUrl }) => {
    expect(wrapper.vm.getFunctionUrl(beforeUrl)).toBe(afterUrl);
  });
});
