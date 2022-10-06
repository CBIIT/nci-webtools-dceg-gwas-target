import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HomeImage from "./images/stock-banner.jpg";

export default function Home() {
  return (
    <div className="cover-image" style={{ backgroundImage: `url(${HomeImage})` }}>
      <Container className="flex-grow-1 py-5 cover-image" style={{ height: "60vh" }}>
        <Row className="h-100 justify-content-center align-items-center">
          <Col className="justify-content-center" md={8}>
            <h1 className="display-4 mb-5 text-light text-center text-uppercase">GWAS Target</h1>
            <p className="lead pt-3 text-light text-center" style={{ borderTop: "1px solid white" }}>
              Perform gene analysis and generalized gene set analysis of GWAS data using MAGMA
            </p>
            <div className="d-flex justify-content-center">
              <NavLink className=" btn btn-outline-secondary" to="/">
                Perform Analysis
              </NavLink>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="bg-white bg-gradient-main">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col>
              <p className="lead fw-normal m-0">
                Identifying target genes and pathways for cancer risk variants from genome-wide association studies
                (GWAS) is challenging. While GWAS have been extremely successful in finding loci associated with cancer
                risk, many identified variants (and correlated proxies) are intergenic with no clear functional
                significance or knowledge of which gene(s) they may be affecting, making interpretation difficult. To
                help researchers prioritize genes and identify shared biological pathways, several bioinformatic methods
                have been developed, including MAGMA1, DEPICT2, FUMA3, and FUSION4, among others. While these tools are
                increasing in sophistication, with the latest methods leveraging gene expression, linkage disequilibrium
                (LD), association and location data to link SNPs to genes in a cumulative fashion spanning the entire
                distribution of effect sizes and p-values, several challenges are yet to be overcome.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
