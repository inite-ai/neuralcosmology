export type PaperStatus = "preprint" | "submitted" | "published";

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
};
