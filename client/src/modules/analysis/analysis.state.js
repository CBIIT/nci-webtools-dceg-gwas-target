import { atom, selector, selectorFamily } from "recoil";


export const defaultFormState = {
    openSidebar: true,
    analysisInput: '',
    rawOnly: false,
    snpType: { value: "g1000_eur", label: "European" },
    snpLocFile: '',
    geneLocFile: '',
    geneAnalysisFile: [],
    pvalFile: '',
    geneSetFile: '',
    covarFile: '',
    sampleSizeOption: '',
    sampleSize: '',
    queue: true,
    jobName: '',
    email: '',
    loading: false,
    submitted: false,
    requestId: '',
}

export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });