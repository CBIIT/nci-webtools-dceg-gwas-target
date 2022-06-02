import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    openSidebar: true,
    analysisInput: '',
    rawOnly: false,
    snpType: "",
    snpLocFile: '',
    geneLocFile: '',
    geneAnalysisFile: '',
    pvalFile: '',
    geneSetFile: '',
    covarFile: '',
    sampleSizeOption: '',
    sampleSizeNum: '',
    sampleSizeColumn: '',
    queue: true,
    jobName: '',
    email: '',
    loading: false,
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });