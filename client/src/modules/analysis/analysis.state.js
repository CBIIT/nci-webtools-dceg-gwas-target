import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    openSidebar: true,
    analysisInput: '',
    rawOnly: false,
    snpType: { value: "custom", label: "User Population File" },
    snpLocFile: '',
    geneLocFile: '',
    geneAnalysisFile: '',
    pvalFile: '',
    geneSetFile: '',
    covarFile: '',
    sampleSizeOption: '',
    sampleSize: '',
    queue: true,
    jobName: '',
    email: '',
    loading: false,
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });