import { Suspense, useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AnalysisForm from "./analysis-form";
import AnalysisResults from "./analysis-results";
import ErrorBoundary from "../common/error-boundary";
import Loader from "../common/loader";
import { loadingState } from "./analysis.state";
import { SidebarContainer, SidebarPanel, MainPanel } from "../common/sidebar-container";
const semibold = ({ children }) => <span className="fw-semibold">{children}</span>;

export default function Analysis() {
  const loading = useRecoilValue(loadingState);
  const [_openSidebar, _setOpenSidebar] = useState(true);


  return (
    <Container className="py-5" style={{ maxWidth: "75%" }}>
      <Loader fullscreen show={loading} />
      <Row>
        <SidebarContainer collapsed={!_openSidebar} onCollapsed={() => _setOpenSidebar(!_openSidebar)}>
          <SidebarPanel>
            <Col>
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
          </SidebarPanel>
          <MainPanel>
            <Col>
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
          </MainPanel>
        </SidebarContainer>
      </Row>
    </Container>
  );
}
