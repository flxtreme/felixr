import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  
  webpack: (config) => {
    config.module.rules.forEach((rule: any) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((one: any) => {
          if (one.use) {
            const uses = Array.isArray(one.use) ? one.use : [one.use];

            uses.forEach((u: any) => {
              if (u.loader && u.loader.includes("css-loader")) {
                if (typeof u.options === "object" && u.options !== null) {
                  const existingFilter = u.options.url?.filter;

                  u.options.url = {
                    filter: (url: string) => {
                      if (url.startsWith("data:")) return false;
                      if (url.includes("_next/static/")) return false;

                      if (typeof existingFilter === "function") {
                        return existingFilter(url);
                      }

                      return true;
                    },
                  };
                }
              }
            });
          }
        });
      }
    });

    return config;
  },
};

export default nextConfig;