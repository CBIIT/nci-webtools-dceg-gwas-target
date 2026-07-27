export default function Instructions() {
  return (
    <div className="p-3">
      <p>
        Below are the instructions for the GWAStarget web tool, designed to help you navigate MAGMA-based gene and
        gene-set analysis of GWAS summary statistics.
      </p>
      <div>
        <h5>1. Select Analysis Model</h5>
        <p>First, determine how you want to prioritize your genes:</p>
        <ul>
          <li>
            <b>MAGMA:</b> Use this for standard MAGMA analysis to identify genes and gene sets from GWAS.
          </li>
          <li>
            <b>F-MAGMA:</b> Use this for Functional element-MAGMA. This model incorporates tissue-specific epigenomic
            data to MAGMA analysis.
          </li>
        </ul>
      </div>
      <div>
        <h5>2. Population & Reference Data</h5>
        <ul>
          <li>
            <b>SNP Population:</b> Select the ancestry that matches your GWAS study (e.g., <b>European, African</b>).
            This ensures the Linkage Disequilibrium (LD) patterns used for analysis are accurate.
          </li>
          <li>
            <b>Reference Data Files:</b> These are the genotype files for your selected population (e.g.,{" "}
            g1000_eur.bed/.bim/.fam) used for analysis.
          </li>
        </ul>
      </div>
      <div>
        <h5>3. Gene Location</h5>
        <ul>
          <li>
            <b>Gene Location File:</b> This defines the genomic coordinates (start/stop) for each gene (e.g.,{" "}
            <b>NCBI37.3</b> for hg19). This is the "map" used to determine which SNPs fall within or near a gene.
          </li>
        </ul>
      </div>
      <div>
        <h5>4. Gene Analysis (SNP-to-Gene Mapping)</h5>
        <ul>
          <li>
            <b>Genotype Data Source:</b>
            <ul>
              <li>
                <b>Raw Data:</b> Direct genotype files from your study.
              </li>
              <li>
                <b>Reference Data:</b> Uses the selected population's reference panel to estimate LD (the most common
                choice for summary statistics).
              </li>
            </ul>
          </li>
          <li>
            <b>SNP P-Values File:</b> Upload your GWAS summary statistics here (note format CHR SNP BP P).
          </li>
          <li>
            <b>Sample Size:</b>
            <ul>
              <li>
                <b>Constant:</b> Enter a single number if the sample size was the same for all SNPs.
              </li>
              <li>
                <b>File Column:</b> Select this if your input file has a specific column for N per SNP.
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <h5>5. BED File Filter (Tissue Specificity)</h5>
        <p>
          This section is crucial for <b>F-MAGMA</b>. It allows you to filter your analysis by epigenomic
          peaks/functional elements specific to particular cell types or tissues:
        </p>
        <ul>
          <li>
            <b>Select/Upload:</b> You can use pre-loaded roadmap epigenomics data (e.g.,{" "}
            <b>DNase I hotspots for E032 Primary B cells</b>) to prioritize genes or you can upload your own epigenomic
            peak/functional element BED file (make sure it is the right genome build!).
          </li>
        </ul>
      </div>
      <div>
        <h5>6. Gene Set Analysis</h5>
        <ul>
          <li>
            <b>Covariate File:</b> You can use pre-loaded data or upload your own covariate file.
          </li>
          <li>
            <b>Gene Set File:</b> You can use pre-loaded data or upload your own gene set file.
          </li>
        </ul>
      </div>
      <div>
        <h5>7. Notifications & Submission</h5>
        <ul>
          <li>
            <b>Long-running Job:</b> The system will process it in the background and email you.
          </li>
          <li>
            <b>Email/Job Name:</b> Provide these so you can be notified once the job is completed.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-decoration-underline">Quick Tips:</p>
        <ul>
          <li>
            <b>Summary statistics format (CHR SNP BP P):</b> Ensure your GWAS file uses a standard "P" or "PVAL" column
            header.
          </li>
          <li>
            <b>Genome build:</b> make sure all files are consistently on the same genome build (hg19 or hg38) as this is
            crucial for analysis.
          </li>
        </ul>
      </div>
    </div>
  );
}
