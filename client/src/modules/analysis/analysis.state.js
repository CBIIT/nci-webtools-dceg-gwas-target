import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    openSidebar: true,
    analysisInput: '',
    rawOnly: false,
    snpLoc: '',
    geneLoc: '',
    rawData: '',
    refData: '',
    pvalFile: '',
    setFile: '',
    covarFile: '',
    sampleSizeOption: '',
    sampleSizeNum: '',
    sampleSizeColumn: '',
    queue: true,
    jobName: '',
    email: '',
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });