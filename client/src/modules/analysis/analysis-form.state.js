import { atom, selector } from "recoil";
import { asFileList } from "./analysis-form.utils";

export const defaultFormState = {
  magmaType: null,
  bedFileFilter: null,
  snpPopulation: null,
  referenceDataFiles: null,
  geneLocationFile: null,
  genotypeDataSource: null,
  rawGenotypeDataFiles: null,
  snpPValuesFile: null,
  sampleSizeType: "constant",
  sampleSize: null,
  sampleSizeColumn: null,
  geneSetFile: null,
  covariateFile: null,
  sendNotification: false,
  jobName: null,
  email: null,
};

export const formState = atom({
  key: "analysis.formState",
  default: {},
});
