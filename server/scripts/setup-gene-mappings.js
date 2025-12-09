#!/usr/bin/env node

/**
 * Script to initialize the gene mapping database from a TSV file
 * Usage: node scripts/setup-gene-mappings.js <path-to-tsv-file>
 */

import { initializeGeneMappingDatabase } from "../services/gene-mapping.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.error("Usage: node scripts/setup-gene-mappings.js <path-to-tsv-file>");
    console.error("");
    console.error("Example:");
    console.error("  node scripts/setup-gene-mappings.js ../data/ensembl-to-gene-symbols.tsv");
    process.exit(1);
  }

  const tsvFilePath = path.resolve(args[0]);
  
  console.log(`Setting up gene mapping database from: ${tsvFilePath}`);
  
  try {
    await initializeGeneMappingDatabase(tsvFilePath);
    console.log("✅ Gene mapping database setup complete!");
    console.log("");
    console.log("You can now use the gene mapping API endpoints:");
    console.log("  GET  /api/gene-mapping/:ensemblId");
    console.log("  POST /api/gene-mapping/batch");
    console.log("  GET  /api/gene-mapping/search/:query");
  } catch (error) {
    console.error("❌ Error setting up gene mapping database:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
