import fs from "fs";
import path from "path";

export type PostMeta = {
  title: string;
  date: string;
  category: string;
  description: string;
  slug: string;
};

export type CategoryCount = {
  name: string;
  count: number;
};

export type PostSearchItem = {
  meta: PostMeta;
  bodyText: string;
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

function comparePostMeta(a: PostMeta, b: PostMeta): number {
  const timeA = new Date(a.date).getTime();
  const timeB = new Date(b.date).getTime();
  const safeA = Number.isNaN(timeA) ? 0 : timeA;
  const safeB = Number.isNaN(timeB) ? 0 : timeB;

  if (safeA !== safeB) {
    return safeB - safeA;
  }

  return a.slug.localeCompare(b.slug);
}

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

function markdownToPlainText(markdown: string): string {
  let text = markdown;
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`[^`]*`/g, " ");
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/[#>*_~`]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
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

  return posts.sort(comparePostMeta);
}

export function getAllPostsWithBodyText(): PostSearchItem[] {
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
    const { meta, content } = parseFrontmatter(fileContents, fileSlug);

    for (const field of requiredFields) {
      if (!meta[field]) {
        meta[field] = field === "slug" ? fileSlug : "";
      }
    }

    return {
      meta,
      bodyText: markdownToPlainText(content),
    };
  });

  return posts.sort((a, b) => comparePostMeta(a.meta, b.meta));
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

export function getCategoryCounts(): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    const category = post.category.trim();
    if (!category) {
      continue;
    }
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
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
