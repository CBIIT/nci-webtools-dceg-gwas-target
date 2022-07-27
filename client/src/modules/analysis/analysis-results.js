
import { formState } from "./analysis.state";
import { useRecoilState } from "recoil";
const axios = require("axios");

export default function AnalysisResults({ onDownload }) {
    const [form, setForm] = useRecoilState(formState);

    console.log(form)
    async function getData() {
        const results = await axios.post("api/query-results", {
            ...form,
            "table": "gene",
            "orderBy": 'P',
            "columns": "*",
            "offset": 0,
            "limit": 10000,
            "conditions": "P IS NOT NULL"
        });
        console.log(results)
        return results
    }

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={getData}>
                Download Sample Gene Analysis
            </button>
        </>
    )
}