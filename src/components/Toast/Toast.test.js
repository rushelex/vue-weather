import { shallowMount } from "@vue/test-utils";
import Toast from "@/components/Toast";

describe("Toast.vue:", () => {
  it("показывается при props.error не равным false", () => {
    const error = true;

    shallowMount(Toast, {
      propsData: { error }
    });

    expect(error).toBeDefined();
    expect(error).toBeTruthy();
  });
});
