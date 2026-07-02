import type { Tag } from "@/lib/types";

export const TAGS: { value: Tag; label: string; hash: string }[] = [
  { value: "work", label: "Trabajo", hash: "#Trabajo" },
  { value: "personal", label: "Personal", hash: "#Personal" },
  { value: "ideas", label: "Ideas", hash: "#Ideas" },
  { value: "health", label: "Salud", hash: "#Salud" },
];

export function getTagMeta(tag: Tag) {
  return TAGS.find((t) => t.value === tag) ?? TAGS[0];
}
