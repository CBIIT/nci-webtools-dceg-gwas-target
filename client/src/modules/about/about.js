import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function About() {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <article className="shadow p-4 rounded">
            <h1 className="text-primary h3 mb-4">About GWASTarget</h1>
            <hr/>
            <p>
              GWAS Target is a web tool that seamlessly takes GWAS summary statistics and incorporates a complex multidimensional approach to prioritize target genes involving the latest epigenome mapping data across hundreds of tissues and epigenomic datasets alongside issue-specific chromatin conformation capture and target gene prediction models.
            </p>
            <p>
              GWAS Target incorporates a state-of-the-art set of regulatory element annotations to pinpoint the tissue-specific regulatory context for all SNPs analyzed using the latest expansive ENCODE, Roadmap Epigenomics and FANTOM5 consortium data for DNase I Hypersensitive sites, histone mark broadPeaks, Hidden Markov model (HMM) Chromatin states and C1 CAGE-identified enhancers.
            </p>
            <p>
              Once chromatin context is integrated, GWAS Target links regulatory elements to target promoters in a tissue-specific manner using the latest tissue-specific promoter capture Hi-C (PCHiC) and activity by contact (ABC) enhancer-target promoter datasets across hundreds of tissues to link regulatory elements to the affected genes.
            </p>
            <p>
              This enhanced, annotated data is then incorporated into a cumulative analysis tool that takes into account distribution of effect sizes and p-values for all SNPs included, building a comprehensive, robust set of high-priority target genes. Results may be further evaluated via gene set analysis to prioritize systems-level pathways for further laboratory analysis.
            </p>
            <b>Credits</b>
            <p>
            Charles Breeze, Sonja Berndt at 
            the <a href="https://dceg.cancer.gov/" target="_blank">Division of Cancer Epidemiology and Genetics (DCEG)</a>
            , <a href="https://www.cancer.gov/" target="_blank">National Cancer Institute (NCI)</a>
            , <a href="https://www.nih.gov/" target="_blank">National Institutes of Health (NIH)</a>; Brian Park, Ben Chen, Kai-Ling Chen and staff at NCI's Center for Biomedical Informatics and Information Technology (CBIIT).
            </p>
            <p>Questions or comments? Contact Charles Breeze via <a href="mailto:c.breeze@ucl.ac.uk" target="_blank">c.breeze@ucl.ac.uk</a></p>
          </article>
        </Col>
      </Row>
    </Container>
  );
}
