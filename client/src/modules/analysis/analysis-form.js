import { useState } from "react";
import { Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { defaultFormState } from "./analysis.state";
import { uploadFiles } from "../../services/uploadFiles";
import Loader from '../common/loader';
const { v1: uuidv1 } = require('uuid');
const axios = require('axios');

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
        console.log(files.data.body)
        const params = {
            ...form,
            request_id: requestId.toString(),
            snpLocFile: snpLocFile.name,
            geneLocFile: geneLocFile.name,
            geneAnalysisFile: geneAnalysisFile.name,
            pvalFile: pvalFile.name,
            geneSetFile: geneSetFile.name,
            covarFile: covarFile.name,
        }

        try {
            console.log(params)
            const res = await axios.post('api/submit', params);
            console.log(res)
        } catch (error) {
            console.log(error);
        }

        mergeForm({ loading: false })
    }
    console.log(snpLocFile)
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
                    <Form.Label className='required'>SNP Population</Form.Label>
                    <Select
                        placeholder="No Population Selected"
                        name="snpType"
                        value={form.snpType}
                        options={[
                            { value: "custom", label: "User Population File" },
                            { value: "european", label: "European" },
                            { value: "african", label: "African" },
                            { value: "eastAsian", label: "East Asian" },
                            { value: "southAsian", label: "South Asian" },
                            { value: "southAmerican", label: "Middle/South American" },
                            { value: "subPopulation", label: "Sub-population definitions" },
                        ]}
                        onChange={(e) => {
                            mergeForm({ snpType: e, snpLocFile: '' })
                            setSnpLocFile('')
                        }}
                    />
                </Form.Group>

                {form.snpType.value === 'custom' && <Form.Group className="mb-3">
                    <Form.Label className='required'>SNP Population File</Form.Label>
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
                            name="sampleSize"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </Form.Group>}

                    {form.sampleSizeOption.value === 'file' && <Form.Group className="mb-3">
                        <Form.Label className="required">Column Name</Form.Label>
                        <input
                            type="text"
                            name="sampleSize"
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