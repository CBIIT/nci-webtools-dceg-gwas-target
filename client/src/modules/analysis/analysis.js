import { Suspense } from "react";
import { useRecoilValue } from "recoil";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AnalysisForm from "./analysis-form";
import AnalysisResults from "./analysis-results";
import ErrorBoundary from "../common/error-boundary";
import Loader from "../common/loader";
import { loadingState } from "./analysis.state";
const semibold = ({ children }) => <span className="fw-semibold">{children}</span>;

export default function Analysis() {
  const loading = useRecoilValue(loadingState);

  return (
    <Container className="py-5">
      <Loader fullscreen show={loading} />
      <Row>
        <Col md={4}>
          <div className="shadow p-4 rounded" style={{ minHeight: "400px" }}>
            <ErrorBoundary
              fallback={
                <strong>
                  An internal error occured when loading form parameters. If this issue persists, please contact the
                  site administrator.
                </strong>
              }>
              <Suspense fallback={<strong>Loading</strong>}>
                <AnalysisForm />
              </Suspense>
            </ErrorBoundary>
          </div>
        </Col>

        <Col md={8}>
          <div className="shadow p-4 rounded" style={{ minHeight: "400px" }}>
            <ErrorBoundary
              fallback={
                <strong>
                  An internal error occured when loading results. If this issue persists, please contact the site
                  administrator.
                </strong>
              }>
              <Suspense fallback={<strong>Loading</strong>}>
                <AnalysisResults />
              </Suspense>
            </ErrorBoundary>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
