import fs from "fs";
import path from "path";

export type PostMeta = {
  title: string;
  date: string;
  category: string;
  description: string;
  slug: string;
};

type ParsedPost = {
  meta: PostMeta;
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

const requiredFields: Array<keyof PostMeta> = [
  "title",
  "date",
  "category",
  "description",
  "slug",
];

function parseFrontmatter(fileContent: string, fileSlug: string): ParsedPost {
  const normalized = fileContent.replace(/\r\n/g, "\n");
  const emptyMeta: PostMeta = {
    title: "",
    date: "",
    category: "",
    description: "",
    slug: fileSlug,
  };

  if (!normalized.startsWith("---\n")) {
    return { meta: emptyMeta, content: normalized };
  }

  const endIndex = normalized.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { meta: emptyMeta, content: normalized };
  }

  const frontmatterRaw = normalized.slice(4, endIndex).trim();
  const content = normalized.slice(endIndex + 4).trimStart();
  const metaLines = frontmatterRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const meta: PostMeta = { ...emptyMeta };
  for (const line of metaLines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (key in meta) {
      meta[key as keyof PostMeta] = value;
    }
  }

  if (!meta.slug) {
    meta.slug = fileSlug;
  }

  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const fileSlug = path.parse(fileName).name;
    const { meta } = parseFrontmatter(fileContents, fileSlug);

    for (const field of requiredFields) {
      if (!meta[field]) {
        meta[field] = field === "slug" ? fileSlug : "";
      }
    }

    return meta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): ParsedPost | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const fileSlug = path.parse(fileName).name;
    const parsed = parseFrontmatter(fileContents, fileSlug);
    const postSlug = parsed.meta.slug || fileSlug;

    if (postSlug === slug) {
      parsed.meta.slug = postSlug;
      return parsed;
    }
  }

  return null;
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
