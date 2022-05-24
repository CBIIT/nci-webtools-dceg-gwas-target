import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    analysisInput: '',
    rawOnly: false,
    sampleSizeOption: '',
    sampleSizeNum: '',
    sampleSizeColumn: '',
    jobName: '',
    email: '',
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });