import path from "path";
import { mkdirs, readJson, writeJson } from "./utils.js";
import { checkStatus, waitUntilComplete } from "./magma.js";
import { getSqliteConnection } from "./database.js";
import { getWorker } from "./workers.js";
import { getGeneSymbolsBatch } from "./gene-mapping.js";
import { existsSync } from "fs";
const { WORKER_TYPE } = process.env;

export async function ping(params) {
  const { verbose, type } = params;
  const status = await checkStatus(type);
  return verbose ? status : true;
}

export async function submit(params, env = process.env) {
  const id = params.id;
  const inputFolder = path.resolve(env.INPUT_FOLDER, id);
  const outputFolder = path.resolve(env.OUTPUT_FOLDER, id);
  const paramsFilePath = path.resolve(inputFolder, "params.json");
  const statusFilePath = path.resolve(outputFolder, "status.json");
  await mkdirs([inputFolder, outputFolder]);

  const worker = getWorker(WORKER_TYPE);
  const status = { id, status: "SUBMITTED" };

  await writeJson(paramsFilePath, params);
  await writeJson(statusFilePath, status);

  worker(id).catch(console.error);
  return status;
}

export async function query(params, env = process.env) {
  const { id, table, columns, conditions, orderBy, offset, limit } = params;
  const databaseFilePath = path.resolve(env.OUTPUT_FOLDER, id, "results.db");
  if (!existsSync(databaseFilePath)) return [];
  
  const results = await getSqliteConnection(databaseFilePath)
    .select(columns || "*")
    .from(table)
    .where(conditions || {})
    .offset(offset || 0)
    .limit(limit || 100000)
    .orderBy(orderBy || []);

  // Replace ENSG values with gene symbols
  if (results.length > 0) {
    // Find all ENSG values in GENE columns
    const ensemblIds = results
      .filter(row => row.GENE && typeof row.GENE === 'string' && row.GENE.startsWith('ENSG'))
      .map(row => row.GENE);

    if (ensemblIds.length > 0) {
      try {
        // Get gene symbol mappings for all ENSG IDs
        const geneMappings = await getGeneSymbolsBatch(ensemblIds);
        const mappingLookup = geneMappings.reduce((acc, mapping) => {
          acc[mapping.ensembl_id] = mapping.gene_symbol;
          return acc;
        }, {});

        // Replace ENSG values with gene symbols where mappings exist
        results.forEach(row => {
          if (row.GENE && typeof row.GENE === 'string' && row.GENE.startsWith('ENSG')) {
            const geneSymbol = mappingLookup[row.GENE.toUpperCase()];
            if (geneSymbol) {
              row.GENE = geneSymbol;
            }
          }
        });
      } catch (error) {
        console.error('Error replacing ENSG values with gene symbols:', error);
        // Continue with original results if gene mapping fails
      }
    }
  }

  return results;
}
