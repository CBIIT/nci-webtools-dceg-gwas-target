import { getSqliteConnection } from "./database.js";
import path from "path";
import { existsSync } from "fs";

const GENE_MAPPING_DB_PATH = path.resolve(process.cwd(), "gene_map_data", "gene-mappings.db");

/**
 * Get gene symbol for a single Ensembl ID
 * @param {string} ensemblId - The Ensembl ID to look up
 * @returns {Promise<Object|null>} Gene mapping object or null if not found
 */
export async function getGeneSymbol(ensemblId) {
  if (!existsSync(GENE_MAPPING_DB_PATH)) {
    throw new Error("Gene mapping database not found. Please initialize the database first.");
  }

  const connection = getSqliteConnection(GENE_MAPPING_DB_PATH);
  
  try {
    const result = await connection
      .select("*")
      .from("gene_mappings")
      .where("ensembl_id", ensemblId.toUpperCase())
      .first();
    
    return result || null;
  } catch (error) {
    console.error("Error querying gene mapping:", error);
    throw error;
  } finally {
    await connection.destroy();
  }
}

/**
 * Get gene symbols for multiple Ensembl IDs
 * @param {string[]} ensemblIds - Array of Ensembl IDs to look up
 * @returns {Promise<Object[]>} Array of gene mapping objects
 */
export async function getGeneSymbolsBatch(ensemblIds) {
  if (!existsSync(GENE_MAPPING_DB_PATH)) {
    throw new Error("Gene mapping database not found. Please initialize the database first.");
  }

  if (!Array.isArray(ensemblIds) || ensemblIds.length === 0) {
    return [];
  }

  const connection = getSqliteConnection(GENE_MAPPING_DB_PATH);
  
  try {
    const normalizedIds = ensemblIds.map(id => id.toUpperCase());
    const results = await connection
      .select("*")
      .from("gene_mappings")
      .whereIn("ensembl_id", normalizedIds);
    
    return results;
  } catch (error) {
    console.error("Error querying gene mappings:", error);
    throw error;
  } finally {
    await connection.destroy();
  }
}

/**
 * Search gene mappings by Ensembl ID or gene symbol
 * @param {string} query - Search query (partial match)
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object[]>} Array of matching gene mapping objects
 */
export async function searchGeneMappings(query, limit = 50) {
  if (!existsSync(GENE_MAPPING_DB_PATH)) {
    throw new Error("Gene mapping database not found. Please initialize the database first.");
  }

  if (!query || query.trim().length === 0) {
    return [];
  }

  const connection = getSqliteConnection(GENE_MAPPING_DB_PATH);
  
  try {
    const searchTerm = `%${query.toUpperCase()}%`;
    const results = await connection
      .select("*")
      .from("gene_mappings")
      .where(function() {
        this.where("ensembl_id", "like", searchTerm)
            .orWhere("gene_symbol", "like", searchTerm);
      })
      .limit(limit);
    
    return results;
  } catch (error) {
    console.error("Error searching gene mappings:", error);
    throw error;
  } finally {
    await connection.destroy();
  }
}

/**
 * Initialize the gene mapping database from a TSV file
 * @param {string} tsvFilePath - Path to the TSV file containing Ensembl ID to gene symbol mappings
 * @returns {Promise<void>}
 */
export async function initializeGeneMappingDatabase(tsvFilePath) {
  if (!existsSync(tsvFilePath)) {
    throw new Error(`TSV file not found: ${tsvFilePath}`);
  }

  const connection = getSqliteConnection(GENE_MAPPING_DB_PATH);
  
  try {
    // Create the table
    await connection.schema.dropTableIfExists("gene_mappings");
    await connection.schema.createTable("gene_mappings", table => {
      table.text("ensembl_id").primary();
      table.text("gene_symbol").notNullable();
      table.index("gene_symbol");
    });

    // Read and parse the TSV file
    const fs = await import("fs");
    const readline = await import("readline");
    
    const fileStream = fs.createReadStream(tsvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const batchSize = 100; // Reduced batch size to avoid SQLite UNION limit
    let batch = [];
    let lineNumber = 0;
    let isFirstLine = true;
    let inserted = 0;

    for await (const line of rl) {
      lineNumber++;
      
      // Skip header line if it exists
      if (isFirstLine && (line.toLowerCase().includes("ensembl") || line.toLowerCase().includes("gene"))) {
        isFirstLine = false;
        continue;
      }
      isFirstLine = false;

      const [ensemblId, geneSymbol] = line.split('\t');
      
      if (ensemblId && geneSymbol) {
        batch.push({
          ensembl_id: ensemblId.trim().toUpperCase(),
          gene_symbol: geneSymbol.trim()
        });

        if (batch.length >= batchSize) {
          await connection("gene_mappings").insert(batch);
          inserted += batch.length;
          console.log(`Imported ${inserted} gene mappings...`);
          batch = [];
        }
      }
    }

    // Insert remaining batch
    if (batch.length > 0) {
      await connection("gene_mappings").insert(batch);
      inserted += batch.length;
    }

    console.log(`Successfully imported ${inserted} gene mappings from ${tsvFilePath}`);
    
  } catch (error) {
    console.error("Error initializing gene mapping database:", error);
    throw error;
  } finally {
    await connection.destroy();
  }
}
