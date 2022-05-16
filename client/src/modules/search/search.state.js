import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    analysis: '',
    rawOnly: false,
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });