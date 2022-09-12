
import { formState, resultsState } from "./analysis.state";
import { useRecoilState, useRecoilValue } from "recoil";
import Table from "../components/table";
import { Row } from "react-bootstrap";
const axios = require("axios");

export default function AnalysisResults({ onDownload }) {
    const [form, setForm] = useRecoilState(formState);
    const results = useRecoilValue(resultsState)
    const geneColumns = [
        {
            accessor: "GENE",
            id: "gene",
            label: "Gene",
            Header: (
                <b>Gene</b>
            ),
        },
        {
            accessor: "CHR",
            id: "chr",
            label: "Chr",
            Header: (
                <b>Chr</b>
            ),
        },
        {
            accessor: "START",
            id: "start",
            label: "Start",
            Header: (
                <b>Start (hg19)</b>
            ),
        },
        {
            accessor: "STOP",
            id: "stop",
            label: "Stop",
            Header: (
                <b>Stop (hg19)</b>
            ),
        },
        {
            accessor: "NSNPS",
            id: "nsnps",
            label: "NSNPS",
            Header: (
                <b>NSNPS</b>
            ),
        },
        {
            accessor: "NPARAM",
            id: "nparam",
            label: "NPARAM",
            Header: (
                <b>NPARAM</b>
            ),
        },
        {
            accessor: "N",
            id: "n",
            label: "N",
            Header: (
                <b>n</b>
            ),
        },
        {
            accessor: "ZSTAT",
            id: "zstat",
            label: "ZSTAT",
            Header: (
                <b>ZSTAT</b>
            ),
        },
        {
            accessor: "P",
            id: "p",
            label: "P",
            Header: (
                <b>P</b>
            ),
            sort: true,
            sortType: (a, b) => {
                return a.original.P - b.original.P
            },
        },
    ]

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