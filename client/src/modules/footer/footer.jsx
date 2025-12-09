import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function parseVersionAndDate(versionString) {
  if (!versionString) return { version: "dev", date: new Date().toISOString().split("T")[0] };
  const versionMatch = versionString.match(/(\d+\.\d+\.\d+)(_dev)?/);
  const version = versionMatch ? versionMatch[1] + (versionMatch[2] || "") : "dev";

  // Extract 8-digit date if present
  const dateMatch = versionString.match(/(\d{8})/)?.[1];
  const date = dateMatch
    ? `${dateMatch.slice(0, 4)}-${dateMatch.slice(4, 6)}-${dateMatch.slice(6, 8)}`
    : new Date().toISOString().split("T")[0];

  return { version, date };
}

export default function Footer() {
  const { version, date } = parseVersionAndDate(process.env.REACT_APP_VERSION);

  return (
    <footer className="flex-grow-0">
      <div className="bg-primary-dark text-light py-4">
        <Container>
          <div className="mb-4">
            <a href="https://dceg.cancer.gov/" target="_blank" rel="noopener noreferrer" className="text-light h4 mb-1">
              Division of Cancer Epidemiology and Genetics
            </a>
            <div className="h6">
              at the{" "}
              <a className="text-light" target="_blank" rel="noopener noreferrer" href="https://www.cancer.gov/">
                National Cancer Institute
              </a>
            </div>
          </div>
          <Row>
            <Col lg={4} className="mb-4">
              <div className="h5 mb-1 font-weight-light">CONTACT INFORMATION</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    className="text-light"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="mailto:GWASTargetWebAdmin@mail.nih.gov">
                    Contact Us
                  </a>
                </li>
                <li>
                  <br />
                </li>
                <li>Last Updated: {date}</li>
                <li>Version: {version}</li>
              </ul>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="h5 mb-1 font-weight-light">POLICIES</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    className="text-light"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.cancer.gov/policies/accessibility">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    className="text-light"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.cancer.gov/policies/disclaimer">
                    Disclaimer
                  </a>
                </li>
                <li>
                  <a
                    className="text-light"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.cancer.gov/policies/foia">
                    FOIA
                  </a>
                </li>
                <li>
                  <a
                    className="text-light"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html">
                    HHS Vulnerability Disclosure
                  </a>
                </li>
              </ul>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="h5 mb-1 font-weight-light">MORE INFORMATION</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a className="text-light" target="_blank" rel="noopener noreferrer" href="http://www.hhs.gov/">
                    U.S. Department of Health and Human Services
                  </a>
                </li>
                <li>
                  <a className="text-light" target="_blank" rel="noopener noreferrer" href="http://www.nih.gov/">
                    National Institutes of Health
                  </a>
                </li>
                <li>
                  <a className="text-light" target="_blank" rel="noopener noreferrer" href="https://www.cancer.gov/">
                    National Cancer Institute
                  </a>
                </li>
                <li>
                  <a className="text-light" target="_blank" rel="noopener noreferrer" href="http://usa.gov/">
                    USA.gov
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        <div className="text-center">
          <div>NIH ... Turning Discovery Into Health ®</div>
        </div>
      </div>
    </footer>
  );
}
