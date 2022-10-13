import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="bg-primary-dark">
        <div
          className="cover-image"
          style={{ minHeight: "400px", backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home.svg)` }}>
          <Container>
            <Row>
              <Col md={6}>
                <div className="d-flex h-100 align-items-center my-5">
                  <div>
                    <h1 className="font-title text-light mb-3">GWAS TARGET</h1>
                    <hr className="border-white" />
                    <p className="lead text-light">
                      Perform gene analysis and generalized gene set analysis of GWAS data using MAGMA
                    </p>
                    <Link to="/analysis" className="btn btn-lg btn-outline-light text-decoration-none">
                      Run Analysis
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className="bg-light py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h2 className="text-primary mb-4">What is GWAS Target?</h2>
            </Col>
            <Col>
              <p>
                GWAS Target is a web tool that seamlessly takes GWAS summary statistics and incorporates a complex
                multidimensional approach to prioritize target genes involving the latest epigenome mapping data across
                hundreds of tissues and epigenomic datasets alongside issue-specific chromatin conformation capture and
                target gene prediction models.
              </p>

              <p>
                GWAS Target incorporates a state-of-the-art set of regulatory element annotations to pinpoint the
                tissue-specific regulatory context for all SNPs analyzed using the latest expansive ENCODE, Roadmap
                Epigenomics and FANTOM5 consortium data for DNase I Hypersensitive sites, histone mark broadPeaks,
                Hidden Markov model (HMM) Chromatin states and C1 CAGE-identified enhancers.
              </p>

              <p>
                Once chromatin context is integrated, GWAS Target links regulatory elements to target promoters in a
                tissue-specific manner using the latest tissue-specific promoter capture Hi-C (PCHiC) and activity by
                contact (ABC) enhancer-target promoter datasets across hundreds of tissues to link regulatory elements
                to the affected genes.
              </p>

              <p>
                This enhanced, annotated data is then incorporated into a cumulative analysis tool that takes into
                account distribution of effect sizes and p-values for all SNPs included, building a comprehensive,
                robust set of high-priority target genes. Results may be further evaluated via gene set analysis to
                prioritize systems-level pathways for further laboratory analysis.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
