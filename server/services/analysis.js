
const os = require('os')
const fs = require('fs');
const { promisify } = require('util')
const { execFile } = require('child_process')
const path = require('path');
const { INPUT_FOLDER, OUTPUT_FOLDER, MAGMA } = process.env;
const execFileAsync = promisify(execFile)

async function runMagma(req) {
    const { logger } = req.app.locals;
    logger.info(`[${req.body.request_id}] Run annotation`);

    const { request_id } = req.body;
    const platform = os.platform()

    const exec = {
        win32: path.resolve(MAGMA,'magma_win.exe'),
        linux: 'magma',
        darwin: 'magma_mac'
      }[platform];

    logger.debug(OUTPUT_FOLDER)
    const inputDir = path.resolve(INPUT_FOLDER, request_id);
    const resultDir = path.resolve(OUTPUT_FOLDER, request_id);

    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir);
    }

    var args = [
        '--annotate',
        '--snp-loc',
        path.resolve(inputDir, req.body.snpLocFile),
        '--gene-loc',
        path.resolve(inputDir, req.body.geneLocFile),
        '--out',
        path.resolve(resultDir, 'annotation')
    ]

    logger.info(args)

    try {

        await execFileAsync(exec, args)

        logger.info(`[${req.body.request_id}] Finished /annotation`);
        if (req.body.analysisInput.value === 'rawData') {

            geneAnalysis = [
                '--bfile',
                path.resolve(inputDir, req.body.geneAnalysisFile),
                '--gene-annot',
                path.resolve(resultDir, 'annotation.genes.annot'),
                '--out',
                path.resolve(resultDir, 'gene_analysis')
            ]
        }
        else {
            var sampleSizeParam;
            if (req.body.sampleSizeOption.value === 'input')
                sampleSizeParam = 'N='
            else
                sampleSizeParam = 'ncol='
            geneAnalysis = [
                '--bfile',
                path.resolve(inputDir, path.parse(req.body.geneAnalysisFile).name),
                '--pval',
                path.resolve(inputDir, req.body.pvalFile),
                `${sampleSizeParam}${req.body.sampleSize}`,
                '--gene-annot',
                path.resolve(resultDir, 'annotation.genes.annot'),
                '--out',
                path.resolve(resultDir, 'gene_analysis')
            ]
        }


        logger.info(geneAnalysis)

        logger.info(`[${req.body.request_id}] Run gene analsyis`);
        await execFileAsync(exec, geneAnalysis)
        logger.info(`[${req.body.request_id}] Finish gene analsyis`);
    } catch (error) {
        logger.info(error)
    }



}

module.exports = { runMagma }