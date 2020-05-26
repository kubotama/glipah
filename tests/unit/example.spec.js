import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

describe("GlipahUi.vue", () => {
  it("GlipahUiがVueコンポーネントである。", () => {
    const wrapper = shallowMount(GlipahUi);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
