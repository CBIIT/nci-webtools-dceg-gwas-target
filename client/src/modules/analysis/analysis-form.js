import axios from "axios";
import mapValues from "lodash/mapValues";
import { useRecoilState, useRecoilValue } from "recoil";
import { useForm } from "react-hook-form";
import { useParams, redirect, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FileInput from "../common/file-input";
import { defaultFormState } from "./analysis-form.state";
import { isValidPlinkDataset, getFileNames, uploadFiles } from "./analysis-form.utils";
import { paramsSelector, loadingState } from "./analysis.state";
import { useEffect } from "react";

export default function AnalysisForm() {
  const { handleSubmit, register, reset, setValue, watch, formState, control } = useForm({
    mode: "onChange",
    defaultValues: defaultFormState,
  });
  const { id } = useParams();
  const [loading, setLoading] = useRecoilState(loadingState);
  const params = useRecoilValue(paramsSelector(id));
  const navigate = useNavigate();

  useEffect(() => reset(params), [reset, params]);

  const genotypeDataSource = watch("genotypeDataSource");
  const sampleSizeType = watch("sampleSizeType");
  const sendNotification = watch("sendNotification");

  function handleChange(event) {
    const { name, value, checked } = event.target;

    switch (name) {
      case "magmaType":
        const geneLocationFile = {
          standard: "NCBI37.3.gene.loc",
          enhanced: "ABC_genes_mrg_disjoint.txt",
        }[value];
        setValue("geneLocationFile", geneLocationFile);
        break;
      case "sendNotification":
        if (!checked) {
          setValue("jobName", null);
          setValue("email", null);
        }
        break;
      case "snpPopulation":
        const referenceDataFiles =
          value === "other" ? null : [`${value}.bed`, `${value}.bim`, `${value}.fam`, `${value}.synonyms`];
        setValue("referenceDataFiles", referenceDataFiles, { shouldValidate: true });
        break;
    }
  }

  async function onSubmit(data) {
    try {
      setLoading(true);
      const previousId = id;
      const newId = uuidv4();
      await uploadFiles(`${process.env.PUBLIC_URL}/api/upload/${newId}`, data);
      const params = { ...mapValues(data, getFileNames), previousId };
      await axios.post(`${process.env.PUBLIC_URL}/api/submit/${newId}`, params);
      navigate(`/analysis/${newId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function onReset(event) {
    event.preventDefault();
    reset(defaultFormState);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset} disabled={loading}>
      <div className="text-end">
        <a download href={`${process.env.PUBLIC_URL}/api/data/input/default/example.zip`}>
          Download Example Data
        </a>
      </div>

      <Form.Group className="mb-4" controlId="magmaType">
        <Form.Label className="required">Magma Model</Form.Label>
        <Form.Select required {...register("magmaType", { required: true, onChange: handleChange })}>
          <option value="" hidden>
            Select an option
          </option>
          <option value="standard">Standard MAGMA</option>
          <option value="enhanced">ABC MAGMA</option>
        </Form.Select>
      </Form.Group>

      <fieldset className="fieldset border rounded mb-4 pt-4 px-3">
        <legend className="legend fw-bold bg-light">Population</legend>

        <Form.Group className="mb-3" controlId="snpPopulation">
          <Form.Label className="required">SNP Population</Form.Label>
          <Form.Select required {...register("snpPopulation", { required: true, onChange: handleChange })}>
            <option value="" hidden>
              Select an option
            </option>
            <option value="g1000_eur">European</option>
            <option value="g1000_afr">African</option>
            <option value="g1000_eas">East Asian</option>
            <option value="g1000_sas">South Asian</option>
            <option value="g1000_amr">Middle/South American</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="referenceDataFiles">
          <Form.Label className="required">Reference Data Files</Form.Label>
          <FileInput
            control={control}
            rules={{ required: true, validate: { plink: isValidPlinkDataset } }}
            name="referenceDataFiles"
            multiple
            required
            accept=".bim,.bed,.fam,.synonyms"
          />
          <Form.Text className="text-danger">{formState.errors?.referenceDataFiles?.message}</Form.Text>
        </Form.Group>
      </fieldset>

      <fieldset className="fieldset border rounded mb-4 pt-4 px-3">
        <legend className="legend fw-bold bg-light">Gene Location</legend>

        <Form.Group className="mb-3" controlId="geneLocationFile">
          <Form.Label className="required">Gene Location File</Form.Label>
          <FileInput
            control={control}
            rules={{ required: true }}
            name="geneLocationFile"
            required
            accept=".loc,.tsv,.txt"
          />
        </Form.Group>
      </fieldset>

      <fieldset className="fieldset border rounded mb-4 pt-4 px-3">
        <legend className="legend fw-bold bg-light">Gene Analysis</legend>

        <Form.Group className="mb-3" controlId="genotypeDataSource">
          <Form.Label className="required">Genotype Data Source</Form.Label>
          <Form.Select name="genotypeDataSource" required {...register("genotypeDataSource", { required: true })}>
            <option value="" hidden>
              Select an option
            </option>
            <option value="rawData">Raw Data</option>
            <option value="referenceData">Reference Data</option>
          </Form.Select>
        </Form.Group>

        <div className={genotypeDataSource === "rawData" ? "d-block" : "d-none"}>
          <Form.Group className="mb-3" controlId="rawGenotypeDataFiles">
            <Form.Label className="required">Raw Data Files</Form.Label>
            <FileInput
              name="rawGenotypeDataFiles"
              multiple
              accept=".bim,.bed,.fam,.synonyms"
              control={control}
              rules={{ required: genotypeDataSource === "rawData", validate: { plink: isValidPlinkDataset } }}
            />
            <Form.Text className="text-danger">{formState.errors?.rawGenotypeDataFiles?.message}</Form.Text>
          </Form.Group>
        </div>

        <div className={genotypeDataSource === "referenceData" ? "d-block" : "d-none"}>
          <Form.Group className="mb-3" controlId="snpPValuesFile">
            <Form.Label className="required">SNP P-Values File</Form.Label>
            <FileInput
              name="snpPValuesFile"
              accept=".txt,.tsv"
              control={control}
              rules={{ required: genotypeDataSource === "referenceData" }}
            />
          </Form.Group>

          <Form.Group className="d-flex flex-wrap justify-content-between">
            <Form.Label className="required">Sample Size</Form.Label>
            <div>
              <Form.Check
                inline
                label="Constant"
                value="constant"
                name="sampleSizeType"
                type="radio"
                id="sample-size-constant"
                {...register("sampleSizeType")}
              />
              <Form.Check
                inline
                className="me-0"
                label="File column"
                value="fileColumn"
                name="sampleSizeType"
                type="radio"
                id="sample-size-file-column"
                {...register("sampleSizeType")}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              className={sampleSizeType === "constant" ? "d-block" : "d-none"}
              aria-label="Sample Size"
              placeholder="Sample Size"
              {...register("sampleSize", { required: sampleSizeType === "constant" })}
            />
            <Form.Control
              className={sampleSizeType === "fileColumn" ? "d-block" : "d-none"}
              aria-label="Sample Size Column"
              placeholder="Sample Size Column"
              {...register("sampleSizeColumn", { required: sampleSizeType === "fileColumn" })}
            />
          </Form.Group>
        </div>
      </fieldset>

      <fieldset className="fieldset border rounded mb-4 pt-4 px-3">
        <legend className="legend fw-bold bg-light">Gene Set Analysis</legend>

        <Form.Group className="mb-3" controlId="geneSetFile">
          <Form.Label>Gene Set File</Form.Label>
          <FileInput name="geneSetFile" control={control} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="covariateFile">
          <Form.Label>Covariate File</Form.Label>
          <FileInput name="covariateFile" control={control} />
        </Form.Group>
      </fieldset>

      <fieldset className="fieldset border rounded mb-4 pt-4 px-3">
        <legend className="legend fw-bold bg-light">Notifications</legend>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Long Running Job"
            name="sendNotification"
            id="sendNotification"
            {...register("sendNotification", { onChange: handleChange })}
          />
          <i style={{ fontSize: "14px" }}>
            Check this for a long-running job and your results will be sent to the email address specified below when ready.
          </i>
        </Form.Group>

        <div className={sendNotification ? "d-block" : "d-block"}>
          <Form.Group className="mb-3" controlId="jobName">
            <Form.Label className={sendNotification && "required"}>Job Name</Form.Label>
            <Form.Control
              name="jobName"
              required={sendNotification}
              disabled={!sendNotification}
              {...register("jobName", { required: sendNotification })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label className={sendNotification && "required"}>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              required={sendNotification}
              {...register("email", { required: sendNotification, disabled: !sendNotification })}
            />
          </Form.Group>
        </div>
      </fieldset>

      <div className="text-end">
        <Button type="reset" variant="outline-danger" className="me-1">
          Reset
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </Form>
  );
}
