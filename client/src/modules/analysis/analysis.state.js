import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";

export const loadingState = atom({
  key: "analysis.loadingState",
  default: false,
});

export const statusSelector = selectorFamily({
  key: "analysis.statusSelector",
  get:
    (id = "default") =>
    async ({ get }) => {
      try {
        const endpoint = `${process.env.PUBLIC_URL}/api/data/output/${id}/status.json`;
        const response = await axios.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
});

export const paramsSelector = selectorFamily({
  key: "analysis.paramsSelector",
  get:
    (id = "default") =>
    async ({ get }) => {
      try {
        const endpoint = `${process.env.PUBLIC_URL}/api/data/input/${id}/params.json`;
        const response = await axios.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
});

export const resultsSelector = selectorFamily({
  key: "analysis.resultsSelector",
  get:
    (id = "default") =>
    async ({ get }) => {
      try {
        const endpoint = `${process.env.PUBLIC_URL}/api/query/${id}`;
        const geneAnalysisResponse = await axios.post(endpoint, {
          table: "gene_analysis",
          orderBy: "P",
          limit: -1,
        });
        return {
          geneAnalysis: geneAnalysisResponse.data,
        };
      } catch (error) {
        console.error(error);
        return {
          geneAnalysis: [],
        };
      }
    },
});

export const manifestSelector = selectorFamily({
  key: "analysis.manifestSelector",
  get:
    (id = "default") =>
    async ({ get }) => {
      try {
        const endpoint = `${process.env.PUBLIC_URL}/api/data/output/${id}/manifest.json`;
        const response = await axios.get(endpoint);
        return response.data;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
});
