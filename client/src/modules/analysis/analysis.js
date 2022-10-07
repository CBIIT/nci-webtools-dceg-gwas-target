import { Suspense, useEffect, useState, useCallback } from "react";
import AnalysisForm from "./analysis-form";
import AnalysisResults from "./analysis-results";
import Container from "react-bootstrap/Container";
import { Card } from "react-bootstrap";
import { defaultFormState, formState } from "./analysis.state";
import { SidebarContainer, SidebarPanel, MainPanel } from "../components/sidebar-container";
import { useRecoilState } from "recoil";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
const axios = require("axios");


export default function Analysis() {
  const [form, setForm] = useRecoilState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  const { id } = useParams()

  const _loadResults = useCallback(loadResults, [id])
  useEffect(_ => { _loadResults(id) }, [id, _loadResults]);

  useEffect(() => {
    _setOpenSidebar(form.openSidebar);
  }, [form.openSidebar]);

  async function handleDownload() {
    const res = await axios.post("api/fetch-results", form);
    const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
    
    saveAs(blob, `GWASTarget-GeneAnalysis-${form.magmaType.label}.txt`);
  }

  function handleSubmit(event) {
    setForm({ ...event, loading: false, submitted: true });
    console.log("submit", event);
  }

  function handleReset(event){
    setForm(defaultFormState)
    console.log(form)
    console.log("reset", event);
  }

  async function loadResults(id){
    if (!id) return;
    const params = await axios.post("api/fetch-params", { request_id: id })
    console.log(params)
    mergeForm(params.data)
  }


  return (
    <Container className="my-4">
      <SidebarContainer collapsed={!_openSidebar} onCollapsed={(collapsed) => mergeForm({ openSidebar: !collapsed })}>
        <SidebarPanel>
          <Card className="shadow">
            <Card.Body>
              <AnalysisForm onSubmit={handleSubmit} onReset={handleReset}/>
            </Card.Body>
          </Card>
        </SidebarPanel>
        <MainPanel>
          <Card className="shadow h-100">
            <Card.Body className="p-0">
              <div className="m-3">
                <AnalysisResults onDownload={handleDownload} />
              </div>
            </Card.Body>
          </Card>
        </MainPanel>
      </SidebarContainer>
    </Container>
  );
}
