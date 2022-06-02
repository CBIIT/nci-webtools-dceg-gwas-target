import { useState } from "react";
import { Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { defaultFormState } from "./analysis.state";
import { uploadFiles } from "../../services/uploadFiles";
import Loader from '../common/loader';
const { v1: uuidv1 } = require('uuid');

export default function AnalysisForm() {

    const [form, setForm] = useState(defaultFormState);
    const mergeForm = (obj) => setForm({ ...form, ...obj });

    const [snpLocFile, setSnpLocFile] = useState('');
    const [geneLocFile, setGeneLocFile] = useState('');
    const [geneAnalysisFile, setGeneAnalysisFile] = useState('');
    const [pvalFile, setPvalFile] = useState('');
    const [geneSetFile, setGeneSetFile] = useState('');
    const [covarFile, setCovarFile] = useState('')

    function handleChange(event) {
        console.log(event.target)
        const { name, value } = event.target;
        mergeForm({ [name]: value });
    }

    async function handleSubmit() {
        mergeForm({ loading: true })
        const requestId = uuidv1();

        const files = await uploadFiles({
            requestId: requestId,
            snpLocFile: snpLocFile,
            snpLocFilename: snpLocFile ? snpLocFile.name : '',
            geneLocFile: geneLocFile,
            geneLocFilename: geneLocFile ? geneLocFile.name : '',
            geneAnalysisFile: geneAnalysisFile,
            geneAnalysisFileName: geneAnalysisFile ? geneAnalysisFile.name : '',
            pvalFile: pvalFile,
            pvalFilename: pvalFile ? pvalFile.name : '',
            geneSetFile: geneSetFile,
            geneSetFileName: geneSetFile ? geneSetFile.name : '',
            covarFile: covarFile,
            covarFileName: covarFile ? covarFile.name : ''
        })

        await mergeForm({
            snpLocFile:
                files.data.body.snpLocFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.snpLocFilename
                    )[0].filename
                    : '',
            geneLocFile:
                files.data.body.geneLocFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.geneLocFilename
                    )[0].filename
                    : '',
            geneAnalysisFile:
                files.data.body.geneAnalysisFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.geneAnalysisFilename
                    )[0].filename
                    : '',
            pvalFile:
                files.data.body.pvalFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.pvalFilename
                    )[0].filename
                    : '',
            geneSetFile:
                files.data.body.geneSetFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.geneSetFilename
                    )[0].filename
                    : '',
            covarFile:
                files.data.body.covarFilename !== 'undefined'
                    ? files.data.files.filter((e) =>
                        e.filename === files.data.body.covarFilename
                    )[0].filename
                    : '',
        })

        mergeForm({ loading: false })
    }
    console.log(form)
    return (
        <Form>
            <Loader show={form.loading} fullscreen />
            <Row className="mb-2 justify-content-end">
                <Col className="d-flex justify-content-end" xl={6}>
                    <a href="javascript:void(0)">Download Sample Data</a>
                </Col>
            </Row>
            <fieldset className='border px-3 my-4'>
                <legend className='legend font-weight-bold'>Annotation</legend>

                <Form.Group className="mb-3">
                    <Form.Label className='required'>SNP Location Population</Form.Label>
                    <Select
                        placeholder="No Population Selected"
                        name="snpType"
                        value={form.snpType}
                        options={[
                            { value: "european", label: "European" },
                            { value: "african", label: "African" },
                            { value: "eastAsian", label: "East Asian" },
                            { value: "southAsian", label: "South Asian" },
                            { value: "southAmerican", label: "Middle/South American" },
                            { value: "subPopulation", label: "Sub-population definitions" },
                            { value: "custom", label: "Upload custom population file" },
                        ]}
                        onChange={(e) => {
                            mergeForm({ snpType: e })
                        }}
                    />
                </Form.Group>

                {form.snpType.value === 'custom' && <Form.Group className="mb-3">
                    <Form.Label className='required'>SNP Location File</Form.Label>
                    <input
                        type="file"
                        name="snpLoc"
                        className="form-control"
                        onChange={(e) => {
                            setSnpLocFile(e.target.files[0])
                        }}
                    />
                </Form.Group>}

                <Form.Group className="mb-3">
                    <Form.Label className='required'>Gene Location File</Form.Label>
                    <input
                        type="file"
                        name="geneLoc"
                        className="form-control"
                        onChange={(e) => {
                            setGeneLocFile(e.target.files[0])
                        }}
                    />
                </Form.Group>
            </fieldset>

            <fieldset className='border px-3 mb-4'>
                <legend className='legend font-weight-bold'>Gene Analysis</legend>
                <Form.Group className="mb-3">
                    <Form.Label className='required'>Input Data Type</Form.Label>
                    <Select
                        placeholder="No analysis selected"
                        name="analysisInput"
                        value={form.analysisInput}
                        options={[
                            { value: "rawData", label: "Raw Data" },
                            { value: "refData", label: "Reference Data" },
                        ]}
                        onChange={(e) => {
                            mergeForm({ analysisInput: e })
                        }}
                    />
                </Form.Group>

                {form.analysisInput.value === 'rawData' &&
                    <Form.Group className="mb-3">
                        <Form.Label className='required'>Raw Data File</Form.Label>
                        <input
                            type="file"
                            name="geneData"
                            className="form-control"
                            onChange={(e) => {
                                setGeneAnalysisFile(e.target.files[0])
                            }}
                        />
                    </Form.Group>
                }

                {form.analysisInput.value === 'refData' && <>
                    <Form.Group className="mb-3">
                        <Form.Label className='required'>Reference Data File</Form.Label>
                        <input
                            type="file"
                            name="refData"
                            className="form-control"
                            onChange={(e) => {
                                setGeneAnalysisFile(e.target.files[0])
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='required'>SNP P-Value File</Form.Label>
                        <input
                            type="file"
                            name="pvalFile"
                            className="form-control"
                            onChange={(e) => {
                                setPvalFile(e.target.files[0])
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='required'>Sample Size Input Type</Form.Label>
                        <Select
                            placeholder="Select method of inputting sample size"
                            name="sampleSizeOption"
                            value={form.sampleSizeOption}
                            options={[
                                { value: "input", label: "Provide one sample size" },
                                { value: "file", label: "File includes column for sample size" },
                            ]}
                            onChange={(e) => {
                                mergeForm({ sampleSizeOption: e })
                            }}
                        />
                    </Form.Group>
                    {form.sampleSizeOption.value === 'input' && <Form.Group className="mb-3">
                        <Form.Label className="required">Sample Size</Form.Label>
                        <input
                            type="number"
                            name="sampleSizeNum"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </Form.Group>}

                    {form.sampleSizeOption.value === 'file' && <Form.Group className="mb-3">
                        <Form.Label className="required">Column Name</Form.Label>
                        <input
                            type="text"
                            name="sampleSizeColumn"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </Form.Group>}

                </>}
            </fieldset>
            <fieldset className='border px-3 mb-4'>

                <legend className='legend font-weight-bold'>Gene-set Analysis</legend>
                <Form.Group className="mb-3">
                    <Form.Label>Gene Set File</Form.Label>
                    <input
                        type="file"
                        name="setFile"
                        className="form-control"
                        onChange={(e) => {
                            setGeneSetFile(e.target.files[0])
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Covar File</Form.Label>
                    <input
                        type="file"
                        name="covarFile"
                        className="form-control"
                        onChange={(e) => {
                            setCovarFile(e.target.files[0])
                        }}
                    />
                </Form.Group>
            </fieldset>
            <fieldset className='border px-3 mb-4'>
                <legend className='legend font-weight-bold'>Queue</legend>
                <Form>
                    <Form.Check
                        type="checkbox"
                        name="queue"
                        label="Submit Job to Queue"
                        checked={form.queue}
                        onChange={() => mergeForm({ queue: !form.queue })}
                    />
                </Form>
                <i style={{ fontSize: '14px' }}>Use queue for a long-running job, your request will be enqueued and results will be sent to email address specified below when ready.</i>
                {form.queue && <div>
                    <Form.Group className="my-3">
                        <Form.Label className="required">Job Name</Form.Label>
                        <input
                            type="text"
                            name="jobName"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="required">Email</Form.Label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </Form.Group>
                </div>}
            </fieldset>
            <div className="text-end">
                <button type="reset" className="btn btn-outline-danger mx-1">
                    Reset
                </button>

                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </Form>
    );
}