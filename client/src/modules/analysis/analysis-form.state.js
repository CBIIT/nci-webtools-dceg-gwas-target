import { atom, selector } from "recoil";
import { asFileList } from "./analysis-form.utils";

export const defaultFormState = {
  magmaType: "enhanced",
  snpPopulation: "g1000_eur",
  referenceDataFiles: ["g1000_eur.bed", "g1000_eur.bim", "g1000_eur.fam", "g1000_eur.synonyms"],
  bedFileFilter: "E003_H1_Cells_ES_Cell.E003-DNase.hotspot.fdr0.01.broad.bed.hg19.bed",
  geneLocationFile: "NCBI37.3.gene.loc",
  genotypeDataSource: "referenceData",
  rawGenotypeDataFiles: null,
  snpPValuesFile: "height.randall.jc.2013.giant.60.586.ieu-a-96.vcf.clean.tsv",
  sampleSizeType: "constant",
  sampleSize: 100,
  sampleSizeColumn: null,
  geneSetFile: null,
  covariateFile: null,
  sendNotification: false,
  jobName: null,
  email: null,
  geneSetFileType: "covariateFile",
  bedFileType: "select",
};

export const formState = atom({
  key: "analysis.formState",
  default: {},
});
