
import { formState, resultsState } from "./analysis.state";
import { useRecoilState, useRecoilValue } from "recoil";
import Table from "../components/table";
import { Row } from "react-bootstrap";
const axios = require("axios");

export default function AnalysisResults({ onDownload }) {
    const [form, setForm] = useRecoilState(formState);
    const results = useRecoilValue(resultsState)

    console.log(results)
    const geneColumns = [
        {
            accessor: "gene",
            id: "gene",
            label: "Gene",
            Header: (
                <b>Gene</b>
            ),
        },
        {
            accessor: "chr",
            id: "chr",
            label: "Chr",
            Header: (
                <b>Chr</b>
            ),
        },
        {
            accessor: "start",
            id: "start",
            label: "Start",
            Header: (
                <b>Start</b>
            ),
        },
        {
            accessor: "stop",
            id: "stop",
            label: "Stop",
            Header: (
                <b>Stop</b>
            ),
        },
        {
            accessor: "nspns",
            id: "nspns",
            label: "NSPNS",
            Header: (
                <b>NSPNS</b>
            ),
        },
        {
            accessor: "nparam",
            id: "nparam",
            label: "NPARAM",
            Header: (
                <b>NPARAM</b>
            ),
        },
        {
            accessor: "n",
            id: "n",
            label: "N",
            Header: (
                <b>n</b>
            ),
        },
        {
            accessor: "zstat",
            id: "zstat",
            label: "ZSTAT",
            Header: (
                <b>ZSTAT</b>
            ),
        },
        {
            accessor: "p",
            id: "p",
            label: "P",
            Header: (
                <b>P</b>
            ),
        },
    ]
    console.log(form)

    return (
        <>
            <Row className="mx-3">
                <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                    <a href="javascript:void(0)" onClick={onDownload}>Export Results</a>
                </div>
            </Row>
            <Table
                columns={geneColumns}
                defaultSort={[{ id: "p", asec: true }]}
                data={results ?
                    results.data
                    : []}
            />
        </>
    )
}