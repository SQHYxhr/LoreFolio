import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LoreFolio · 设定档案馆",
    short_name: "LoreFolio",
    description: "本地优先的个人世界观与 OC 创作工作站",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f0e6",
    theme_color: "#7c4a2d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/maskable-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
