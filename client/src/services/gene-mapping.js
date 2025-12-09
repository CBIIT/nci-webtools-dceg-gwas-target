import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = process.env.PUBLIC_URL || "";

/**
 * Get gene symbol for a single Ensembl ID
 * @param {string} ensemblId - The Ensembl ID to look up
 * @returns {Promise<Object|null>} Gene mapping object or null if not found
 */
export async function getGeneSymbol(ensemblId) {
  try {
    const response = await axios.get(`${API_BASE}/api/gene-mapping/${encodeURIComponent(ensemblId)}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching gene symbol:", error);
    throw error;
  }
}

/**
 * Get gene symbols for multiple Ensembl IDs
 * @param {string[]} ensemblIds - Array of Ensembl IDs to look up
 * @returns {Promise<Object[]>} Array of gene mapping objects
 */
export async function getGeneSymbolsBatch(ensemblIds) {
  try {
    const response = await axios.post(`${API_BASE}/api/gene-mapping/batch`, {
      ensemblIds
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gene symbols batch:", error);
    throw error;
  }
}

/**
 * Search gene mappings by Ensembl ID or gene symbol
 * @param {string} query - Search query (partial match)
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object[]>} Array of matching gene mapping objects
 */
export async function searchGeneMappings(query, limit = 50) {
  try {
    const response = await axios.get(
      `${API_BASE}/api/gene-mapping/search/${encodeURIComponent(query)}`,
      {
        params: { limit }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching gene mappings:", error);
    throw error;
  }
}

/**
 * React hook for gene symbol lookup with caching
 * @param {string} ensemblId - The Ensembl ID to look up
 * @returns {Object} { data, loading, error }
 */
export function useGeneSymbol(ensemblId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ensemblId) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getGeneSymbol(ensemblId)
      .then(result => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ensemblId]);

  return { data, loading, error };
}

// Cache for gene mappings to avoid repeated API calls
const geneMappingCache = new Map();

/**
 * Get gene symbol with caching
 * @param {string} ensemblId - The Ensembl ID to look up
 * @returns {Promise<Object|null>} Gene mapping object or null if not found
 */
export async function getGeneSymbolCached(ensemblId) {
  const cacheKey = ensemblId.toUpperCase();
  
  if (geneMappingCache.has(cacheKey)) {
    return geneMappingCache.get(cacheKey);
  }

  try {
    const result = await getGeneSymbol(ensemblId);
    geneMappingCache.set(cacheKey, result);
    return result;
  } catch (error) {
    // Don't cache errors
    throw error;
  }
}

/**
 * Clear the gene mapping cache
 */
export function clearGeneMappingCache() {
  geneMappingCache.clear();
}
