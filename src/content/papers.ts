import type { Paper } from "@/types/paper";

export const papers: Paper[] = [
  {
    slug: "pointer-architecture",
    title:
      "Pointer Architecture: A Constrained Information-Geometric Model of Galactic Rotation Curves",
    authors: ["Mikhail Savchenko"],
    year: 2026,
    status: "preprint",
    venue: "arXiv pending · Zenodo DOI",
    abstract:
      "We compare three information-geometric models of galactic rotation on the 171-galaxy SPARC sample: unconstrained pointer, constrained pointer (with a physical prior on halo extent), and a standard NFW baseline. The constrained pointer wins AIC on 60 of 171 galaxies and shows a positive partial correlation between halo extent and inferred information mass (ρ = +0.19, q_FDR = 0.04). Four of six residual-structure features correlate with galactic age at FDR-controlled significance. A full reproducibility pipeline — code, data, and fit diagnostics — is released alongside the preprint.",
    tldr: [
      "3-model head-to-head on 171 SPARC galaxies",
      "Constrained Pointer wins AIC on 60/171",
      "Partial correlation on halo extent: ρ = +0.19, q_FDR = 0.04",
      "4 of 6 residual-structure features correlate with galactic age",
      "Full reproducibility pipeline released (code + data + fit diagnostics)",
    ],
    predictions: [
      "Constrained pointer fit quality improves systematically with galactic age.",
      "Residual-structure features at large radii should track halo concentration, not stellar mass.",
      "Low-surface-brightness galaxies should show larger pointer-vs-NFW AIC gaps.",
      "Independent samples (LITTLE THINGS, THINGS) should reproduce the ρ direction on halo extent.",
      "Falsifier: if the ρ sign flips on an independent age-controlled resample, the model fails.",
      "Falsifier: if AIC-preferred galaxies correlate with survey artefacts rather than age, the result is observational.",
      "Falsifier: if reproducibility pipeline yields materially different fits under reasonable re-parameterisation, results are over-fit.",
    ],
    pdfPath: "/pdfs/pointer-architecture-v2.pdf",
    codeUrl: "https://github.com/neuralcosmology/pointer-architecture",
    companionBookSlug: "celestial-code",
  },
];

export function getPaperBySlug(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}
