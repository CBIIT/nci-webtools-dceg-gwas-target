import { Suspense, useEffect, useState } from "react";
import AnalysisForm from "./analysis-form";
import Container from "react-bootstrap/Container";
import { Card } from "react-bootstrap";
import { defaultFormState, formState } from "./analysis.state";
import { SidebarContainer, SidebarPanel, MainPanel } from "../components/sidebar-container";
import { useRecoilState } from "recoil";
import { saveAs } from "file-saver";
const axios = require("axios");

export default function Analysis() {
  const [form, setForm] = useRecoilState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  console.log(form);
  useEffect(() => {
    _setOpenSidebar(form.openSidebar);
  }, [form.openSidebar]);

  async function handleDownload() {
    const res = await axios.post("api/fetch-results", form);
    const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "genes.txt");
  }

  function handleSubmit(event) {
    setForm({ ...event, loading: false, submitted: true });
    console.log("submit", event);
  }

  return (
    <Container className="my-4">
      <SidebarContainer collapsed={!_openSidebar} onCollapsed={(collapsed) => mergeForm({ openSidebar: !collapsed })}>
        <SidebarPanel>
          <Card className="shadow">
            <Card.Body>
              <AnalysisForm onSubmit={handleSubmit} />
            </Card.Body>
          </Card>
        </SidebarPanel>
        <MainPanel>
          <Card className="shadow h-100">
            <Card.Body className="p-0">
              <div className="m-3">
                <button type="button" className="btn btn-primary" onClick={handleDownload}>
                  {form.submitted ? 'Download Gene Analysis' : 'Download Sample Gene Analysis'}
                </button>
              </div>
            </Card.Body>
          </Card>
        </MainPanel>
      </SidebarContainer>
    </Container>
  );
}
