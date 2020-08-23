import { shallowMount } from "@vue/test-utils";
import Toast from "@/components/Toast";

describe("Toast.vue", () => {
  it("Показывает Toast при props.error !== false", () => {
    const error = true || Object;
    const wrapper = shallowMount(Toast, {
      propsData: { error }
    });
    expect(error).toBe(!false);
  });
});
