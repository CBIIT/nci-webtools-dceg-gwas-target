const axios = require("axios");

export async function uploadFiles(params) {
  const formData = new FormData();
  formData.append("request_id", params.requestId.toString());

  formData.append("snpLocFile", params.snpLocFile);
  formData.append("snpLocFilename", params.snpLocFilename);

  formData.append("geneLocFile", params.geneLocFile);
  formData.append("geneLocFilename", params.geneLocFilename);

  formData.append("geneAnalysisBim", params.geneAnalysisBim);
  formData.append("geneAnalysisBimName", params.geneAnalysisBimName);

  formData.append("geneAnalysisBed", params.geneAnalysisBed);
  formData.append("geneAnalysisBedName", params.geneAnalysisBedName);

  formData.append("geneAnalysisFam", params.geneAnalysisFam);
  formData.append("geneAnalysisFam", params.geneAnalysisFameName);

  formData.append("pvalFile", params.pvalFile);
  formData.append("pvalFilename", params.pvalFileName);

  formData.append("geneSetFile", params.geneSetFile);
  formData.append("geneSetFilename", params.geneSetFilename);

  formData.append("covarFile", params.covarFile);
  formData.append("covarFilename", params.covarFilename);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  console.log(params);
  try {
    const res = await axios.post("api/file-upload", formData, config);
    return res;
  } catch (error) {
    console.log(error);
  }
}
