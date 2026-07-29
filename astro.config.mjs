import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { fileURLToPath } from "node:url";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypePrettyCode from "rehype-pretty-code";
import remarkBlogFeatures from "./src/plugins/remarkBlogFeatures.mjs";
import rehypeBlogFeatures from "./src/plugins/rehypeBlogFeatures.mjs";

export default defineConfig({
  site: "http://aarav2709.github.io/",
  base: "/",
  output: "static",
  compressHTML: true,
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkGfm, remarkDirective, remarkBlogFeatures],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            keepBackground: false,
          },
        ],
        rehypeBlogFeatures,
      ],
    }),
  },
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
        "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      },
    },
    build: {
      cssMinify: "lightningcss",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
