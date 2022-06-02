const axios = require('axios');

export async function uploadFiles(params) {
    const formData = new FormData()
    formData.append('request_id', params.requestId.toString())
    if (params.snpLocFile !== '') {
        formData.append('snpLocFile', params.snpLocFile)
        formData.append('snpLocFilename', params.snpLocFilename)
    }

    formData.append('geneLocFile', params.geneLocFile)
    formData.append('geneLocFilename', params.geneLocFilename)

    formData.append('geneAnalysisFile', params.geneAnalysisFile)
    formData.append('geneAnalysisFilename', params.geneAnalysisFilename)


    formData.append('pvalFile', params.pvalFile)
    formData.append('pvalFilename', params.pvalFileName)

    formData.append('geneSetFile', params.geneSetFile)
    formData.append('geneSetFilename', params.geneSetFilename)

    formData.append('covarFile', params.covarFile)
    formData.append('covarFilename', params.covarFilename)


    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const res = await axios.post('api/file-upload', formData, config);
        return res
    } catch (error) {
        console.log(error);
    }
}