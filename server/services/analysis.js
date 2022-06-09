
const os = require('node:os')
const fs = require('fs');
const { execFile } = require('node:child_process')
const path = require('path');
const config = require('../config');

const inputDir = path.resolve(config.efs.input_folder);
const magmaDir = path.resolve(config.magma.folder);

async function runMagma(req) {
    const { logger } = req.app.locals;
    logger.info(`[${req.body.request_id}] Execute /run-magma`);

    const { request_id } = req.body;
    const platform = os.platform()
    var exec;

    if (platform === 'win32') {
        exec = path.resolve(magmaDir, 'magma_win.exe')
    }
    else if (platform === 'linux') {
        exec = path.resolve(magmaDir, 'magma_linux')
    }
    else if (platform === 'darwin') {
        exec = path.resolve(magmaDir, 'magma_mac')
    }

    const resultDir = path.resolve(config.efs.output_folder, request_id);

    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir);
    }


    var args = [
        '--annotate',
        '--snp-loc',
        path.resolve(inputDir, request_id, req.body.snpLocFile),
        '--gene-loc',
        path.resolve(inputDir, request_id, req.body.geneLocFile),
        '--out',
        path.resolve(resultDir, 'annotation')
    ]

    logger.info(args)
    await execFile(exec, args, (error, stdout, stderr) => {

        if (error)
            logger.error(error)
    })

    
    var geneAnalysis;

    if (req.body.analysisInput.value === 'rawData') {

        geneAnalysis = [
            '--bfile',
            path.resolve(inputDir, request_id, req.body.geneAnalysisFile),
            '--gene-annot',
            path.resolve(resultDir, 'annotation.genes.annot.txt'),
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
            path.resolve(inputDir, request_id, path.parse(req.body.geneAnalysisFile).name),
            '--pval',
            path.resolve(inputDir, request_id, req.body.pvalFile),
            `${sampleSizeParam}${req.body.sampleSize}`,
            '--gene-annot',
            path.resolve(resultDir, 'annotation.genes.annot.txt'),
            '--out',
            path.resolve(resultDir, 'gene_analysis')
        ]
    }

    logger.info(geneAnalysis)
    await execFile(exec, geneAnalysis, (error, stdout, stderr) => {

        if (error)
            logger.error(error)
    })


    logger.info(`[${request_id}] Finished /run-magma`);
}

module.exports = { runMagma }