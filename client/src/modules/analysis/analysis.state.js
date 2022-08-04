import { atom, selector, selectorFamily } from "recoil";
const axios = require("axios");

export const defaultFormState = {
  openSidebar: true,
  magmaType: { value: "enhanced", label: "ABC MAGMA" },
  analysisInput: { value: "refData", label: "Reference Data" },
  rawOnly: false,
  snpType: { value: "g1000_eur", label: "European" },
  sampleSizeOption: { value: "input", label: "Provide one sample size" },
  sampleSize: 100,
  queue: false,
  jobName: "",
  email: "",
  loading: false,
  submitted: false,
  requestId: "",
  timestamp: "",
};

export const resultsState = selector({
  key: "results",
  get: async ({ get }) => {
    const params = get(formState);
    if (!params) return null;

    const results = await axios.post("api/query-results", {
      ...params,
      "table": "gene",
      "orderBy": 'P',
      "columns": "*",
      "offset": 0,
      "limit": 10000,
      "conditions": "P IS NOT NULL"
    });

    console.log(results)
    return results
  }
})

export const formState = atom({
  key: "explore.formState",
  default: defaultFormState,
});
