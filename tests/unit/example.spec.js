import { shallowMount } from "@vue/test-utils";
import GlipahUi from "@/components/GlipahUi.vue";

describe("HelloWorld.vue", () => {
  it("GlipahUiがVueコンポーネントである。", () => {
    const wrapper = shallowMount(GlipahUi);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
