import fs from "fs";
import path from "path";

export type PageMeta = {
  title: string;
  description: string;
  slug: string;
};

export type PageContent = {
  meta: PageMeta;
  content: string;
};

const pagesDirectory = path.join(process.cwd(), "content", "pages");

const requiredFields: Array<keyof PageMeta> = ["title", "description", "slug"];

function parseFrontmatter(fileContent: string, fileSlug: string): PageContent {
  const normalized = fileContent.replace(/\r\n/g, "\n");
  const emptyMeta: PageMeta = {
    title: "",
    description: "",
    slug: fileSlug,
  };

  if (!normalized.startsWith("---\n")) {
    return { meta: emptyMeta, content: normalized.trim() };
  }

  const endIndex = normalized.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { meta: emptyMeta, content: normalized.trim() };
  }

  const frontmatterRaw = normalized.slice(4, endIndex).trim();
  const content = normalized.slice(endIndex + 4).trimStart();
  const metaLines = frontmatterRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const meta: PageMeta = { ...emptyMeta };
  for (const line of metaLines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (key in meta) {
      meta[key as keyof PageMeta] = value;
    }
  }

  if (!meta.slug) {
    meta.slug = fileSlug;
  }

  for (const field of requiredFields) {
    if (!meta[field]) {
      meta[field] = field === "slug" ? fileSlug : "";
    }
  }

  return { meta, content };
}

export function getPageBySlug(slug: string): PageContent | null {
  if (!fs.existsSync(pagesDirectory)) {
    return null;
  }

  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const parsed = parseFrontmatter(fileContents, slug);
  parsed.meta.slug = slug;
  return parsed;
}
