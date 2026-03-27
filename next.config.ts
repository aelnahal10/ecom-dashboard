import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repositoryName = repository.split("/")[1] ?? "";
const isUserOrOrgPages = repositoryName.endsWith(".github.io");
const basePath =
  isGithubPages && repositoryName && !isUserOrOrgPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
