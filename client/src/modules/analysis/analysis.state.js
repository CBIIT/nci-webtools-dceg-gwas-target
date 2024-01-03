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
          data: geneAnalysisResponse.data,
          columns: [
            {
              header: "GENE",
              accessorKey: "GENE",
              className: "text-nowrap",
            },
            {
              header: "CHR",
              accessorKey: "CHR",
              className: "text-nowrap text-end",
            },
            {
              header: "START (hg19)",
              accessorKey: "START",
              className: "text-nowrap text-end",
            },
            {
              header: "STOP (hg19)",
              accessorKey: "STOP",
              className: "text-nowrap text-end",
            },
            {
              header: "NSNPS",
              accessorKey: "NSNPS",
              className: "text-nowrap text-end",
            },
            {
              header: "NPARAM",
              accessorKey: "NPARAM",
              className: "text-nowrap text-end",
            },
            {
              header: "N",
              accessorKey: "N",
              className: "text-nowrap text-end",
            },
            {
              header: "ZSTAT",
              accessorKey: "ZSTAT",
              className: "text-nowrap text-end",
            },
            {
              header: "P",
              accessorKey: "P",
              className: "text-nowrap text-end",
            },
          ],
        };
      } catch (error) {
        console.error(error);
        return [];
      }
    },
});

export const geneSetSelector = selectorFamily({
  key: "analysis.geneSetSelector",
  get:
    (id = "default") =>
    async ({ get }) => {
      try {
        const endpoint = `${process.env.PUBLIC_URL}/api/query/${id}`;
        const query = await axios.post(endpoint, {
          table: "gene_set_analysis",
          orderBy: "P",
          limit: -1,
        });
        return {
          data: query.data,
          columns: [
            {
              header: "VARIABLE",
              accessorKey: "VARIABLE",
              className: "text-nowrap",
            },
            {
              header: "TYPE",
              accessorKey: "TYPE",
              className: "text-nowrap text-end",
            },
            {
              header: "NGENES",
              accessorKey: "NGENES",
              className: "text-nowrap text-end",
            },
            {
              header: "BETA",
              accessorKey: "BETA",
              className: "text-nowrap text-end",
            },
            {
              header: "BETA_STD",
              accessorKey: "BETA_STD",
              className: "text-nowrap text-end",
            },
            {
              header: "SE",
              accessorKey: "SE",
              className: "text-nowrap text-end",
            },
            {
              header: "P",
              accessorKey: "P",
              className: "text-nowrap text-end",
            },
            {
              header: "FULL_NAME",
              accessorKey: "FULL_NAME",
              className: "text-nowrap text-end",
            },
          ],
        };
      } catch (error) {
        console.error(error);
        return [];
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
