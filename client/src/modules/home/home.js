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
            <Col>
              <p>
                GWAS Target is a web tool that seamlessly takes GWAS summary statistics and incorporates a complex
                multidimensional approach to prioritize target genes involving the latest epigenome mapping data across
                hundreds of tissues and epigenomic datasets alongside issue-specific chromatin conformation capture and
                target gene prediction models.
              </p>
              <p>
                GWASTarget was developed by <a href="https://dceg.cancer.gov/fellowship-training/fellowship-experience/meet-fellows/oeeb/breeze-charles" target="_blank">Charles Breeze</a> in collaboration with NCI's Center for Biomedical Informatics and Information Technology (CBIIT). Support comes from the Division of Cancer Epidemiology and Genetics Informatics Tool Challenge.
              </p>
              <p>
                <p>Questions or comments? Contact Charles Breeze via <a href="mailto:c.breeze@ucl.ac.uk" target="_blank">c.breeze@ucl.ac.uk</a></p>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
