export type PaperStatus = "preprint" | "submitted" | "published";

export type PaperReference = {
  id: string;
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi?: string;
  arxiv?: string;
  url?: string;
};

export type PaperDataset = {
  name: string;
  description: string;
  distributions: { name: string; url: string; format: string }[];
  license: string;
  licenseUrl: string;
  version: string;
  keywords: string[];
};

export type Paper = {
  slug: string;
  title: string;
  authors: string[];
  abstract: string;
  tldr?: string[];
  predictions?: string[];
  preprintUrl?: string;
  doi?: string;
  pdfPath?: string;
  codeUrl?: string;
  dataUrl?: string;
  status: PaperStatus;
  venue?: string;
  year: number;
  companionBookSlug?: string;
  license?: string;
  licenseUrl?: string;
  references?: PaperReference[];
  dataset?: PaperDataset;
};
