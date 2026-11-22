// PS5 Pro 30 FPS receipt — make.fun gta6-meme-x-01 entry.
// The judged artifact is the X post itself (its first picture + text).
// This program only hands over the post's address: it copies POST.json
// and the meme image into the output directory for the grader.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const repoDir = process.env.MAKEFUN_BOT_DIR || ".";

const raw = readFileSync(join(repoDir, "POST.json"), "utf8");
const posted = JSON.parse(raw);
const rawUrl = posted.url ?? posted.post;
// X share links often carry tracking (?s=...) — strip query and fragment
// so the stored address is the canonical post URL.
const url =
  typeof rawUrl === "string" ? rawUrl.split(/[?#]/)[0] : rawUrl;
if (typeof url !== "string" || !/^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+$/.test(url)) {
  console.error("POST.json must name a real X post URL (https://x.com/<handle>/status/<id>)");
  process.exit(1);
}
if (!existsSync(join(repoDir, "meme.png"))) {
  console.error("meme.png is missing from the repository");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), JSON.stringify({ url }, null, 2) + "\n");
copyFileSync(join(repoDir, "meme.png"), join(outDir, "meme.png"));
console.log("entry post: " + url);
