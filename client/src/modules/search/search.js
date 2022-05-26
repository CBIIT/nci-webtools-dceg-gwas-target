import { useState } from "react";
import { Card, Form } from 'react-bootstrap';
import Select from 'react-select';
import { useRecoilState } from 'recoil';
import { defaultFormState } from "./search.state";

export default function Search() {

    const [form, setForm] = useState(defaultFormState);
    const mergeForm = (obj) => setForm({ ...form, ...obj });

    function handleChange(event) {
        console.log(event.target)
        const { name, value } = event.target;
        mergeForm({ [name]: value });
    }
    console.log(form)
    return (
        <div className="container align-self-center row h-100">
            <div className="col-xl-4 mb-5">
                <Card className="my-3 shadow-sm h-100">
                    <Card.Body>
                        <fieldset className='border px-3 my-4'>
                            <legend className='legend font-weight-bold'>Annotation</legend>
                            <Form.Group className="mb-3">
                                <Form.Label className='required'>SNP Location</Form.Label>
                                <input
                                    type="file"
                                    name="snpLoc"
                                    className="form-control"
                                    onChange={(e) =>{
                                        mergeForm({ snpLoc: e.target.files[0]})
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className='required'>Gene Location</Form.Label>
                                <input
                                    type="file"
                                    name="geneLoc"
                                    className="form-control"
                                    onChange={(e) =>{
                                        mergeForm({ geneLoc: e.target.files[0]})
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
                                    <Form.Label className='required'>Raw Data</Form.Label>
                                    <input
                                        type="file"
                                        name="geneData"
                                        className="form-control"
                                        onChange={(e) =>{
                                            mergeForm({ rawData: e.target.files[0]})
                                        }}
                                    />
                                </Form.Group>
                            }

                            {form.analysisInput.value === 'refData' && <>
                                <Form.Group className="mb-3">
                                    <Form.Label className='required'>Reference Data</Form.Label>
                                    <input
                                        type="file"
                                        name="refData"
                                        className="form-control"
                                        onChange={(e) =>{
                                            mergeForm({ refData: e.target.files[0]})
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className='required'>SNP P-Values</Form.Label>
                                    <input
                                        type="file"
                                        name="pvalFile"
                                        className="form-control"
                                        onChange={(e) =>{
                                            mergeForm({ pvalFile: e.target.files[0]})
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
                                <Form.Label>Gene Set</Form.Label>
                                <input
                                    type="file"
                                    name="setFile"
                                    className="form-control"
                                    onChange={(e) =>{
                                        mergeForm({ setFile: e.target.files[0]})
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Covar File</Form.Label>
                                <input
                                    type="file"
                                    name="covarFile"
                                    className="form-control"
                                    onChange={(e) =>{
                                        mergeForm({ covarFile: e.target.files[0]})
                                    }}
                                />
                            </Form.Group>
                        </fieldset>
                        <fieldset className='border px-3 mb-4'>
                            <legend className='legend font-weight-bold'>Queue</legend>
                            <Form.Group className="mb-3">
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
                        </fieldset>
                        <div className="text-end">
                            <button type="reset" className="btn btn-outline-danger mx-1">
                                Reset
                            </button>

                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}