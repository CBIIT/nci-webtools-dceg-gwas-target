from argparse import ArgumentParser
from uuid import uuid4
from requests import post  # pip install requests

base_url = "https://analysistools.cancer.gov/gwas-target"
upload_endpoint = base_url + "/api/upload"
submit_endpoint = base_url + "/api/submit"

def upload_file(file_path):
    post(upload_endpoint, files={"file": open(file_path, "rb")})


def submit_job(params):
    post(submit_endpoint, data=params)


def submit(args):
    id = uuid4()
    print(id)
    print(args)


def parse_args():
    parser = ArgumentParser()
    parser.add_argument(
        "--endpoint",
        help="GWAS Target API Endpoint",
        default=base_url
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
    parser.add_argument("--job-name", help="Job name (required if email is set)")
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    submit(args)
