import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function About() {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <article className="shadow p-4 rounded">
            <h1 className="text-primary h3 mb-4">About</h1>
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
            <span>
              Charles Breeze: <a href="mailto:c.breeze@ucl.ac.u" target="_blank">c.breeze@ucl.ac.uk</a>
            </span>
            <br/>
            <span>
              Breeze C, Park B, Chen B, Chen K, Berndt S (2022) https://analysistools-cancer.gov/gwas-target/
            </span>
          </article>
        </Col>
      </Row>
    </Container>
  );
}
