import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import AnalysisResultsTable from "./analysis-results-table";
import { useRecoilState, useRecoilValue, useRecoilRefresher_UNSTABLE as useRecoilRefresher } from "recoil";
import { statusSelector, loadingState, manifestSelector, paramsSelector, resultsSelector } from "./analysis.state";

export default function AnalysisResults() {
  const id = useParams().id || "default";
  const [loading, setLoading] = useRecoilState(loadingState);
  const params = useRecoilValue(paramsSelector(id));
  const status = useRecoilValue(statusSelector(id));
  const manifest = useRecoilValue(manifestSelector(id));
  const results = useRecoilValue(resultsSelector(id));
  const refreshStatus = useRecoilRefresher(statusSelector(id));
  const refreshManifest = useRecoilRefresher(manifestSelector(id));
  const refreshResults = useRecoilRefresher(resultsSelector(id));
  const isDone = ["COMPLETED", "FAILED"].includes(status?.status);

  const refreshState = useCallback(() => {
    refreshStatus();
    refreshManifest();
    refreshResults();
  }, [refreshStatus, refreshManifest, refreshResults]);

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
        <>
          <div className="text-end mb-3">
            <a
              href={`${process.env.PUBLIC_URL}/api/data/output/${id}/${manifest.geneAnalysisFile}`}
              download={`${params.magmaType}_${manifest.geneAnalysisFile}`}>
              Download Results
            </a>
          </div>
          <AnalysisResultsTable results={results} />
        </>
      )}
      {status.status === "FAILED" && (
        <>
          <Alert variant="danger">
            <Alert.Heading className="mb-3">Analysis Failed</Alert.Heading>
            <p>
              Your analysis failed with the following error: {status?.error?.message || "INTERNAL ERROR"}. Please
              contact the site administrator for assistance if this issue persists.
            </p>
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
