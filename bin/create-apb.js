#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
  console.error("Usage: create-apb <project-name-or-path>");
  process.exit(1);
}

const templateDir = path.resolve(__dirname, "..", "templates");
const targetDir = path.resolve(process.cwd(), projectName);
const replacement = path.basename(targetDir);
const ignoredTemplateEntries = new Set([".DS_Store", "Thumbs.db"]);

if (!fs.existsSync(templateDir)) {
  console.error(`Template directory not found: ${templateDir}`);
  process.exit(1);
}

if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  console.error(`Target directory is not empty: ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

function copyTemplate(source, target) {
  if (ignoredTemplateEntries.has(path.basename(source))) {
    return;
  }

  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyTemplate(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  const content = fs.readFileSync(source, "utf8");
  const output = content.replaceAll("{{PROJECT_NAME}}", replacement);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
}

copyTemplate(templateDir, targetDir);
copyTemplate(
  path.resolve(__dirname, "apb-context.js"),
  path.join(targetDir, ".agent", "tools", "context-routing", "apb-context.js"),
);
copyTemplate(
  path.resolve(__dirname, "..", "lib", "context-routing", "index.js"),
  path.join(targetDir, ".agent", "tools", "context-routing", "index.js"),
);
ensureRuntimeIgnore(targetDir);

console.log(`Created APB project at ${targetDir}`);

function ensureRuntimeIgnore(projectRoot) {
  const ignoreFile = path.join(projectRoot, ".gitignore");
  const rule = ".agent/runtime/";
  const existing = fs.existsSync(ignoreFile) ? fs.readFileSync(ignoreFile, "utf8") : "";
  if (existing.split(/\r?\n/).includes(rule)) return;
  const separator = existing && !existing.endsWith("\n") ? "\n" : "";
  fs.writeFileSync(ignoreFile, `${existing}${separator}${rule}\n`);
}
