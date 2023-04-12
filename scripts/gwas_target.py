import logging
import sys
from argparse import ArgumentParser
from uuid import uuid4
from os import path
from requests import post  # pip install requests

def strip_path(file_path):
    """ Strips the path from a file name """
    return path.basename(file_path)

def upload_file(upload_endpoint, file_path):
    """ Uploads a file to the GWAS Target API """
    with open(file_path, "rb") as file:
        logging.info("Uploading file %s...", file_path)
        post(upload_endpoint, files={"file": file})

def submit(params):
    """ Submits a job to the GWAS Target API """

    # Set up endpoints
    job_id = uuid4()
    base_url = params["endpoint"]
    upload_endpoint = f"{base_url}/api/upload/{job_id}"
    submit_endpoint = f"{base_url}/api/submit/{job_id}"
    input_data_endpoint = f"{base_url}/api/data/input/{job_id}"
    output_data_endpoint = f"{base_url}/api/data/output/{job_id}"

    logging.debug("Generated job ID: %s", job_id)
    logging.debug("Upload endpoint: %s", upload_endpoint)
    logging.debug("Submit endpoint: %s", submit_endpoint)
    logging.debug("CLI Parameters: %s", params)

    # Upload files if they exist locally
    for key in ["gene_location_file", "snp_pvalues_file", "bed_filter_file"]:
        file_path = params[key]
        if key in params and path.exists(file_path):
            upload_file(upload_endpoint, file_path)

    # Specify parameters
    job_params = {
        "id": str(job_id),
        "magmaType": params["magma_type"],
        "snpPopulation": params["snp_population"],
        "referenceDataFiles": [
            f"{params['snp_population']}.bed",
            f"{params['snp_population']}.bim",
            f"{params['snp_population']}.fam",
            f"{params['snp_population']}.synonyms"
        ],
        "bedFileFilter": path.basename(params["bed_filter_file"]),
        "geneLocationFile": path.basename(params["gene_location_file"]),
        "genotypeDataSource": "referenceData",
        "snpPValuesFile": path.basename(params["snp_pvalues_file"]),
        "sampleSizeType": "constant",
        "sampleSize": params["sample_size"],
        "sendNotification": params["email"] is not None,
        "jobName": params["job_name"],
        "email": params["email"]
    }

    logging.info("Submitting Job: %s", job_id)
    logging.debug("Job Parameters: %s", job_params)
    post(submit_endpoint, json=job_params)
    logging.info("Job submitted successfully!")
    logging.info("Status/Results Page: %s", base_url)
    logging.info("Annotation Results Download Link: %s/annotation.genes.annot", output_data_endpoint)
    logging.info("Gene Analysis Results Download Link: %s/gene_analysis.genes.out", output_data_endpoint)

def parse_args():
    """ Parses command-line arguments """
    parser = ArgumentParser()
    parser.add_argument("--debug", help="Enable debug logging", action="store_true")
    parser.add_argument(
        "--endpoint",
        help="GWAS Target API Endpoint",
        default="https://analysistools.cancer.gov/gwas-target"
    )
    parser.add_argument(
        "--magma-type",
        help="MAGMA type",
        choices=["default", "enhanced"],
        default="default",
    )
    parser.add_argument(
        "--snp-population",
        help="SNP population (GrCh37)",
        choices=["g1000_eur", "g1000_afr", "g1000_eas", "g1000_sas", "g1000_amr"],
        default="g1000_eur",
    )
    parser.add_argument("--gene-location-file", help="Gene location file", default="NCBI37.3.gene.loc")
    parser.add_argument("--snp-pvalues-file", help="SNP p-values file", required=True)
    parser.add_argument("--sample-size", help="Sample size", type=int, required=True)
    parser.add_argument("--bed-filter-file", help="Tissue-specific BED Filter File")
    parser.add_argument("--email", help="Email address for notifications")
    parser.add_argument("--job-name",  required='--email' in sys.argv, help="Job name (required if email is set)")
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    logging.basicConfig(level=logging.DEBUG if args.debug else logging.INFO)
    submit(args)
