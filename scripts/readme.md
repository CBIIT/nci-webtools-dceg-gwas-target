### GWASTarget API Utility

The GWASTarget web application provides a public API. To simplify usage of this API, a python 3 utility `gwas_target.py` has been provided.

#### Getting Started

1. Download the `gwas_target.py` script
2. Install the requests library: `python3 -m pip install requests --user`

#### Usage

The following arguments can be passed to the script.

- \-h: Displays the help message and exits.
- \--magma\-type: Specifies the type of MAGMA to use (standard MAGMA vs. enhanced or F-MAGMA). The options are "default" and "enhanced".
- \--snp\-population: Specifies the population used to compute the allele frequencies for the SNPs in the GWAS summary statistics. The options are "g1000_eur", "g1000_afr", "g1000_eas", "g1000_sas", and "g1000_amr". No other options can currently be used.
- \--gene\-location\-file: Specifies the file containing gene location information.
- \--snp\-pvalues\-file: Specifies the file containing SNP p\-values.
- \--sample\-size: Specifies the sample size for the GWAS.
- \--bed\-filter\-file: Specifies a tissue\-specific BED filter file (for enhanced or F-MAGMA).
- \--gene\-set\-file: Specifies a gene set file (for Gene Set Analysis).
- \--covariate\-file: Specifies a covariate file (for Gene Set Analysis).
- \--email: Specifies an email address for notification.
- \--job\-name: Specifies a job name (required if email is set).

To use this script, you would run it from the command line and pass in the desired arguments. For example, to run the script with the "standard" MAGMA gene set, the "g1000_eur" SNP population, and a gene location file named "gene_loc.txt", and a snp p-values file named "snp-pvalues.tsv" you would enter the following command:

```sh
python3 gwas_target.py \
  --magma-type default \
  --snp-population g1000_eur \
  --gene-location-file gene_loc.txt \
  --snp-pvalues-file snp-pvalues.tsv \
  --sample-size 100
```

Another example for enhanced MAGMA (filtered on tissue-specific snps) would be:

```sh
python3 gwas_target.py \
  --magma-type enhanced \
  --snp-population g1000_eur \
  --gene-location-file NCBI37.3.gene.loc \
  --snp-pvalues-file snp-pvalues.tsv \
  --bed-filter-file E003_H1_Cells_ES_Cell.E003-DNase.hotspot.fdr0.01.broad.bed.hg19.bed \
  --sample-size 100 \
  --email "my_email@example.com" \
  --job-name "my custom job name"
```

For Gene Set Analysis, include either the --gene-set-file or --covariate-file argument in your command:

```sh
python3 gwas_target.py \
  --magma-type enhanced \
  --snp-population g1000_eur \
  --gene-location-file NCBI37.3.gene.loc \
  --snp-pvalues-file snp-pvalues.tsv \
  --bed-filter-file E003_H1_Cells_ES_Cell.E003-DNase.hotspot.fdr0.01.broad.bed.hg19.bed \
  --sample-size 100 \
  --gene-set-file AIZARANI_LIVER_C10_MVECS_1.v2023.2.Hs.gmt \
  --email "my_email@example.com" \
  --job-name "my custom job name"
```

```sh
python3 gwas_target.py \
  --magma-type enhanced \
  --snp-population g1000_eur \
  --gene-location-file depictAndGtexGeneIntersection_noMHC.gene.loc \
  --snp-pvalues-file snp-pvalues.tsv \
  --bed-filter-file E003_H1_Cells_ES_Cell.E003-DNase.hotspot.fdr0.01.broad.bed.hg19.bed \
  --sample-size 100 \
  --covariate-file GPL570-GPL96-GPL1261-GPL1355TermGeneZScores-MGI_MF_CC_RT_IW_BP_KEGG_z_z_GTExGenesOnly.txt \
  --email "my_email@example.com" \
  --job-name "my custom job name"
```

Files used in the examples can be found here:

- gene_loc.txt: https://analysistools.cancer.gov/gwas-target/api/data/input/default/example.zip
- depictAndGtexGeneIntersection_noMHC.gene.loc: https://raw.githubusercontent.com/RebeccaFine/benchmarker/master/data/depictAndGtexGeneIntersection_noMHC.gene.loc
- AIZARANI_LIVER_C10_MVECS_1.v2023.2.Hs.gmt https://www.gsea-msigdb.org/gsea/msigdb/human/geneset/AIZARANI_LIVER_C10_MVECS_1.html
- GPL570-GPL96-GPL1261-GPL1355TermGeneZScores-MGI_MF_CC_RT_IW_BP_KEGG_z_z_GTExGenesOnly.txt: ftp://ftp.broadinstitute.org/outgoing/benchmarker_data/GPL570-GPL96-GPL1261-GPL1355TermGeneZScores-MGI_MF_CC_RT_IW_BP_KEGG_z_z_GTExGenesOnly.txt

NB: the following bed filter files are already on the server:

- E003_H1_Cells_ES_Cell.E003-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E004_H1_BMP4_Derived_Mesendoderm_Cultured_Cells_ES_Cell.E004-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E005_H1_BMP4_Derived_Trophoblast_Cultured_Cells_ES_Cell.E005-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E006_H1_Derived_Mesenchymal_Stem_Cells_ES_Cell.E006-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E007_H1_Derived_Neuronal_Progenitor_Cultured_Cells_ES_Cell.E007-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E008_H9_Cells_ES_Cell.E008-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E017_IMR90_fetal_lung_fibroblasts_Cell_Line_Lung.E017-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E021_iPS_DF_6.9_Cells_IPS_cell.E021-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E022_iPS_DF_19.11_Cells_IPS_cell.E022-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E028_Breast_variant_Human_Mammary_Epithelial_Cells_Breast.E028-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E029_Primary_monocytes_from_peripheral_blood_Blood.E029-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E032_Primary_B_cells_from_peripheral_blood_Blood.E032-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E033_Primary_T_cells_from_cord_blood_Blood.E033-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E034_Primary_T_cells_from_peripheral_blood_Blood.E034-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E046_Primary_Natural_Killer_cells_from_peripheral_Blood.E046-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E050_Primary_hematopoietic_stem_cells_G-CSF-mobili_Blood.E050-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E051_Primary_hematopoietic_stem_cells_G-CSF-mobili_Blood.E051-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E055_Foreskin_Fibroblast_Primary_Cells_skin01_Skin.E055-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E056_Foreskin_Fibroblast_Primary_Cells_skin02_Skin.E056-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E057_Foreskin_Keratinocyte_Primary_Cells_skin02_Skin.E057-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E059_Foreskin_Melanocyte_Primary_Cells_skin01_Skin.E059-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E080_Fetal_Adrenal_Gland_Fetal_Adrenal_Gland.E080-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E081_Fetal_Brain_Male_Fetal_Brain.E081-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E082_Fetal_Brain_Female_Fetal_Brain.E082-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E083_Fetal_Heart_Fetal_Heart.E083-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E084_Fetal_Intestine_Large_Fetal_Intestine_Large.E084-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E085_Fetal_Intestine_Small_Feta_Intestine_Small.E085-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E086_Fetal_Kidney_Fetal_Kidney.E086-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E088_Fetal_Lung_Fetal_Lung.E088-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E089_Fetal_Muscle_Trunk_Fetal_Muscle_Trunk.E089-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E090_Fetal_Muscle_Leg_Fetal_Muscle_Leg.E090-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E091_Placenta_Placenta.E091-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E092_Fetal_Stomach_Fetal_Stomach.E092-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E093_Fetal_Thymus_Fetal_Thymus.E093-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E094_Gastric_Gastric.E094-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E097_Ovary_Ovary.E097-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E098_Pancreas_Pancreas.E098-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E100_Psoas_Muscle_Psoas_Muscle.E100-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
- E109_Small_Intestine_Small_Intestine.E109-DNase.hotspot.fdr0.01.broad.bed.hg19.bed
