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
            GWAS Target is a web tool that seamlessly takes GWAS summary statistics and incorporates a complex multidimensional approach to prioritize target genes involving the latest epigenome mapping data across different tissues and <a href="https://forge2.altiusinstitute.org/" target="_blank">epigenomic datasets</a>.
            </p>
            <p>
            GWAS Target incorporates regulatory element annotations to pinpoint the tissue-specific functional context for all SNPs analyzed using Roadmap Epigenomics data for DNase I hotspots.
            </p>
            <p>
            This annotated dataset is then incorporated into a cumulative analysis tool that takes into account distribution of effect sizes and p-values for all SNPs included, building a comprehensive, robust set of high-priority target genes.
            </p>
            <p>
            Results may be further evaluated via gene set analysis to prioritize systems-level pathways for further analyses.
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
