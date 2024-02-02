import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import AnalysisResultsTable from "./analysis-results-table";
import { useRecoilState, useRecoilValue, useRecoilRefresher_UNSTABLE as useRecoilRefresher } from "recoil";
import {
  statusSelector,
  loadingState,
  manifestSelector,
  paramsSelector,
  resultsSelector,
  geneSetSelector,
} from "./analysis.state";

export default function AnalysisResults() {
  const id = useParams().id || "default";
  const [loading, setLoading] = useRecoilState(loadingState);
  const params = useRecoilValue(paramsSelector(id));
  const status = useRecoilValue(statusSelector(id));
  const manifest = useRecoilValue(manifestSelector(id));
  const results = useRecoilValue(resultsSelector(id));
  const geneSetResults = useRecoilValue(geneSetSelector(id));
  const refreshStatus = useRecoilRefresher(statusSelector(id));
  const refreshManifest = useRecoilRefresher(manifestSelector(id));
  const refreshResults = useRecoilRefresher(resultsSelector(id));
  const refreshGeneSetResults = useRecoilRefresher(geneSetSelector(id));
  const isDone = ["COMPLETED", "FAILED"].includes(status?.status);
  const [tab, setTab] = useState("gene_analysis");
  const data = tab === "gene_analysis" ? results.data : geneSetResults.data;
  const columns = tab === "gene_analysis" ? results.columns : geneSetResults.columns;
  const file = tab === "gene_analysis" ? manifest?.geneAnalysisFile : manifest?.geneSetAnalysisFile;

  const refreshState = useCallback(() => {
    refreshStatus();
    refreshManifest();
    refreshResults();
    refreshGeneSetResults();
  }, [refreshStatus, refreshManifest, refreshResults, refreshGeneSetResults]);

  useEffect(() => {
    const interval = setInterval(refreshState, 1000 * 60);
    if (isDone) clearInterval(interval);
    return () => clearInterval(interval);
  }, [isDone, refreshState]);

  if (!status) {
    return null;
  }

  return (
    <div>
      {status.status === "COMPLETED" && (
        <Card>
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey={tab} activeKey={tab} onSelect={(e) => setTab(e)}>
              <Nav.Item>
                <Nav.Link eventKey="gene_analysis">Gene Analysis</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="gene_set_analysis" disabled={!geneSetResults.data?.length}>
                  Gene Set Analysis
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <div className="text-end mb-3">
              <a
                href={`${process.env.PUBLIC_URL}/api/data/output/${id}/${file}`}
                download={`${params.magmaType === "enhanced" ? "F MAGMA" : "Standard Magma"}_${file}`}>
                Download Results
              </a>
            </div>
            <AnalysisResultsTable data={data} columns={columns} />
          </Card.Body>
        </Card>
      )}
      {status.status === "FAILED" && (
        <>
          <Alert variant="danger">
            <Alert.Heading className="mb-3">Analysis Failed</Alert.Heading>
            <pre>{status && status.error ? status.error : "INTERNAL ERROR"}</pre>
          </Alert>
        </>
      )}
      {status.status === "SUBMITTED" && (
        <>
          <Alert variant="info">
            <Alert.Heading className="mb-3 d-flex align-items-center">
              Analysis submitted
              {!params.sendNotification && (
                <Spinner animation="border" role="status" size="sm" className="mx-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Alert.Heading>
            <p>
              Your analysis has been submitted.
              {params.sendNotification && <span> You will receive an email once it is complete.</span>}
            </p>
          </Alert>
        </>
      )}
      {status.status === "IN_PROGRESS" && (
        <>
          <Alert variant="info">
            <Alert.Heading className="mb-3 d-flex align-items-center">
              Analysis in progress
              {!params.sendNotification && (
                <Spinner animation="border" role="status" size="sm" className="mx-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Alert.Heading>
            <p>
              Your analysis is currently in progress.
              {params.sendNotification && <span> You will receive an email once it is complete.</span>}
            </p>
          </Alert>
        </>
      )}
    </div>
  );
}
