import { atom, selector, selectorFamily } from "recoil";

export const defaultFormState = {
  openSidebar: true,
  analysisInput: { value: "refData", label: "Reference Data" },
  rawOnly: false,
  snpType: { value: "g1000_eur", label: "European" },
  snpLocFile: "",
  geneLocFile: "",
  geneAnalysisFile: [],
  pvalFile: "",
  geneSetFile: "",
  covarFile: "",
  sampleSizeOption: { value: "input", label: "Provide one sample size" },
  sampleSize: 100,
  queue: true,
  jobName: "",
  email: "",
  loading: false,
  submitted: false,
  requestId: "",
};

export const formState = atom({
  key: "explore.formState",
  default: defaultFormState,
});
