import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const params = createSearchParams({ query: search });
    navigate(`/search?${params}`);
  }

  return (
    <>
      <Container className="flex-grow-1 py-5">
        <Row className="h-100 justify-content-center align-items-center">
          <Col md={8}>
            <h1 className="display-4 mb-5 text-center text-uppercase">GWAS Target</h1>
          </Col>
        </Row>
      </Container>

      <div className="bg-white bg-gradient-main">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col>
              <p className="lead fw-normal m-0">
                Accurate histological classification is important for facilitating studies of cancer epidemiology and
                etiologic heterogeneity. ICD Genie is a web-based tool that can assist epidemiologists, pathologists,
                research assistants, and data scientists to more easily access, translate and validate codes and text
                descriptions from the International Classification of Diseases (10th Edition) and International
                Classification of Diseases for Oncology, 3rd Edition (ICD-O-3). By improving accessibility and making
                existing cancer classification and coding schemes to be more readily understandable and searchable, ICD
                Genie will help accelerate descriptive and molecular epidemiological studies of cancer.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
