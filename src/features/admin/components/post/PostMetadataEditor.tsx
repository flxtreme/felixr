"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Metadata } from "next";
import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";

interface MetadataConfig {
  title: string;
  titleTemplate: string;
  titleDefault: string;
  description: string;
  keywords: string[];
  authors: string;
  applicationName: string;
  generator: string;
  referrer: string;
  category: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogSiteName: string;
  ogImageUrl: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogImageAlt: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterSite: string;
  twitterCreator: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNocache: string;
  googleBotIndex: string;
  googleBotFollow: string;
  googleBotNoimageindex: string;
  googleBotMaxSnippet: string;
  canonical: string;
  manifest: string;
  themeColorLight: string;
  themeColorDark: string;
  colorScheme: string;
  viewport: string;
  verificationGoogle: string;
  verificationYandex: string;
  formatDetection: string;
}

const defaultConfig: MetadataConfig = {
  title: "",
  titleTemplate: "",
  titleDefault: "",
  description: "",
  keywords: [],
  authors: "",
  applicationName: "",
  generator: "",
  referrer: "",
  category: "",
  ogType: "website",
  ogTitle: "",
  ogDescription: "",
  ogUrl: "",
  ogSiteName: "",
  ogImageUrl: "",
  ogImageWidth: "",
  ogImageHeight: "",
  ogImageAlt: "",
  ogLocale: "",
  twitterCard: "summary",
  twitterTitle: "",
  twitterDescription: "",
  twitterSite: "",
  twitterCreator: "",
  twitterImageUrl: "",
  twitterImageAlt: "",
  robotsIndex: true,
  robotsFollow: true,
  robotsNocache: "",
  googleBotIndex: "",
  googleBotFollow: "",
  googleBotNoimageindex: "",
  googleBotMaxSnippet: "",
  canonical: "",
  manifest: "",
  themeColorLight: "",
  themeColorDark: "",
  colorScheme: "",
  viewport: "",
  verificationGoogle: "",
  verificationYandex: "",
  formatDetection: "",
};

type TabId = "basic" | "og" | "twitter" | "robots" | "advanced";

const TABS: { id: TabId; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "og", label: "Open Graph" },
  { id: "twitter", label: "Twitter" },
  { id: "robots", label: "Robots" },
  { id: "advanced", label: "Advanced" },
];

function generateMetadata(c: MetadataConfig): Metadata {
  const meta: Metadata = {};

  if (c.title) {
    if (c.titleTemplate || c.titleDefault) {
      meta.title = {
        absolute: c.title,
        template: c.titleTemplate || undefined,
        default: c.titleDefault || undefined,
      };
    } else {
      meta.title = c.title;
    }
  }

  if (c.description) meta.description = c.description;
  if (c.keywords.length) meta.keywords = c.keywords;
  if (c.authors) meta.authors = [{ name: c.authors }];
  if (c.applicationName) meta.applicationName = c.applicationName;
  if (c.generator) meta.generator = c.generator;
  if (c.referrer) meta.referrer = c.referrer as ReferrerEnum;
  if (c.category) meta.category = c.category;

  const og: any = {};
  if (c.ogType) og.type = c.ogType;
  if (c.ogTitle) og.title = c.ogTitle;
  if (c.ogDescription) og.description = c.ogDescription;
  if (c.ogUrl) og.url = c.ogUrl;
  if (c.ogSiteName) og.siteName = c.ogSiteName;
  if (c.ogLocale) og.locale = c.ogLocale;
  if (c.ogImageUrl) {
    og.images = [
      {
        url: c.ogImageUrl,
        width: c.ogImageWidth ? parseInt(c.ogImageWidth) : undefined,
        height: c.ogImageHeight ? parseInt(c.ogImageHeight) : undefined,
        alt: c.ogImageAlt || undefined,
      },
    ];
  }
  if (Object.keys(og).length) meta.openGraph = og;

  const tw: any = {};
  if (c.twitterCard) tw.card = c.twitterCard;
  if (c.twitterTitle) tw.title = c.twitterTitle;
  if (c.twitterDescription) tw.description = c.twitterDescription;
  if (c.twitterSite) tw.site = c.twitterSite;
  if (c.twitterCreator) tw.creator = c.twitterCreator;
  if (c.twitterImageUrl)
    tw.images = [
      { url: c.twitterImageUrl, ...(c.twitterImageAlt ? { alt: c.twitterImageAlt } : {}) },
    ];
  if (Object.keys(tw).length) meta.twitter = tw;

  const rob: any = { index: c.robotsIndex, follow: c.robotsFollow };
  if (c.robotsNocache) rob.nocache = c.robotsNocache === "true";
  const gb: any = {};
  if (c.googleBotIndex) gb.index = c.googleBotIndex === "true";
  if (c.googleBotFollow) gb.follow = c.googleBotFollow === "true";
  if (c.googleBotNoimageindex) gb.noimageindex = c.googleBotNoimageindex === "true";
  if (c.googleBotMaxSnippet) gb.maxSnippet = parseInt(c.googleBotMaxSnippet);
  if (Object.keys(gb).length) rob.googleBot = gb;
  meta.robots = rob;

  if (c.canonical) meta.alternates = { canonical: c.canonical };
  if (c.manifest) meta.manifest = c.manifest;

  const themes: { media: string; color: string }[] = [];
  if (c.themeColorLight)
    themes.push({ media: "(prefers-color-scheme: light)", color: c.themeColorLight });
  if (c.themeColorDark)
    themes.push({ media: "(prefers-color-scheme: dark)", color: c.themeColorDark });
  if (themes.length === 1) meta.themeColor = themes[0].color;
  else if (themes.length > 1) meta.themeColor = themes;

  // if (c.colorScheme) meta.colorScheme = c.colorScheme;
  // if (c.viewport) meta.viewport = c.viewport;

  const ver: Record<string, string> = {};
  if (c.verificationGoogle) ver.google = c.verificationGoogle;
  if (c.verificationYandex) ver.yandex = c.verificationYandex;
  if (Object.keys(ver).length) meta.verification = ver;

  if (c.formatDetection === "false") meta.formatDetection = { telephone: false };

  return meta;
}

function parseMetadata(meta?: Metadata): MetadataConfig {
  const c: MetadataConfig = { ...defaultConfig };
  if (!meta) return c;

  // Title
  if (meta.title) {
    if (typeof meta.title === "string") {
      c.title = meta.title;
    } else if (typeof meta.title === "object" && meta.title !== null) {
      const t = meta.title as any;
      if (t.absolute) c.title = t.absolute;
      if (t.template) c.titleTemplate = t.template;
      if (t.default) c.titleDefault = t.default;
    }
  }

  // Basic
  if (typeof meta.description === "string") c.description = meta.description;
  if (Array.isArray(meta.keywords)) c.keywords = [...meta.keywords];
  if (Array.isArray(meta.authors) && meta.authors.length > 0) {
    const author = meta.authors[0] as any;
    if (author?.name) c.authors = author.name;
  }
  if (typeof meta.applicationName === "string") c.applicationName = meta.applicationName;
  if (typeof meta.generator === "string") c.generator = meta.generator;
  if (typeof meta.referrer === "string") c.referrer = meta.referrer;
  if (typeof meta.category === "string") c.category = meta.category;

  // Open Graph
  if (meta.openGraph) {
    const og = meta.openGraph as any;
    if (og.type) c.ogType = og.type;
    if (typeof og.title === "string") c.ogTitle = og.title;
    if (typeof og.description === "string") c.ogDescription = og.description;
    if (og.url) c.ogUrl = String(og.url);
    if (og.siteName) c.ogSiteName = og.siteName;
    if (og.locale) c.ogLocale = og.locale;
    if (Array.isArray(og.images) && og.images.length > 0) {
      const img = og.images[0] as any;
      if (typeof img === "string") {
        c.ogImageUrl = img;
      } else if (img && typeof img === "object") {
        if (img.url) c.ogImageUrl = String(img.url);
        if (img.width) c.ogImageWidth = String(img.width);
        if (img.height) c.ogImageHeight = String(img.height);
        if (img.alt) c.ogImageAlt = img.alt;
      }
    }
  }

  // Twitter
  if (meta.twitter) {
    const tw = meta.twitter as any;
    if (tw.card) c.twitterCard = tw.card;
    if (typeof tw.title === "string") c.twitterTitle = tw.title;
    if (typeof tw.description === "string") c.twitterDescription = tw.description;
    if (tw.site) c.twitterSite = tw.site;
    if (tw.creator) c.twitterCreator = tw.creator;
    if (Array.isArray(tw.images) && tw.images.length > 0) {
      const img = tw.images[0] as any;
      if (typeof img === "string") {
        c.twitterImageUrl = img;
      } else if (img && typeof img === "object") {
        if (img.url) c.twitterImageUrl = String(img.url);
        if (img.alt) c.twitterImageAlt = img.alt;
      }
    }
  }

  // Robots
  if (meta.robots) {
    const r = meta.robots as any;
    if (typeof r === "object" && r !== null) {
      if (r.index !== undefined) c.robotsIndex = !!r.index;
      if (r.follow !== undefined) c.robotsFollow = !!r.follow;
      if (r.nocache !== undefined) c.robotsNocache = String(r.nocache);
      if (r.googleBot) {
        const gb = r.googleBot;
        if (gb.index !== undefined) c.googleBotIndex = String(gb.index);
        if (gb.follow !== undefined) c.googleBotFollow = String(gb.follow);
        if (gb.noimageindex !== undefined) c.googleBotNoimageindex = String(gb.noimageindex);
        if (gb.maxSnippet !== undefined) c.googleBotMaxSnippet = String(gb.maxSnippet);
      }
    }
  }

  // Advanced
  if (meta.alternates?.canonical) c.canonical = String(meta.alternates.canonical);
  if (meta.manifest) c.manifest = String(meta.manifest);

  if (meta.themeColor) {
    if (Array.isArray(meta.themeColor)) {
      (meta.themeColor as any[]).forEach((tc) => {
        if (tc.media === "(prefers-color-scheme: light)") c.themeColorLight = tc.color;
        if (tc.media === "(prefers-color-scheme: dark)") c.themeColorDark = tc.color;
      });
    } else if (typeof meta.themeColor === "string") {
      c.themeColorLight = meta.themeColor;
    }
  }

  if (meta.verification) {
    if (meta.verification.google) c.verificationGoogle = String(meta.verification.google);
    if (meta.verification.yandex) c.verificationYandex = String(meta.verification.yandex);
  }

  if (meta.formatDetection && typeof meta.formatDetection === "object") {
    if ((meta.formatDetection as any).telephone === false) c.formatDetection = "false";
  }

  return c;
}

// ── Shared field styles (matching PostTagsInput) ──────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-mono font-medium text-foreground/40">{label}</label>
      {children}
      {hint && <p className="text-xs font-mono text-foreground/30">{hint}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-transparent border-b border-border py-2 text-sm font-mono font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/10"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-transparent border-b border-border py-2 text-sm font-mono font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/10 resize-none"
    />
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full bg-transparent border-b border-border py-2 text-sm font-mono font-medium focus:outline-none focus:border-primary transition-colors appearance-none"
    >
      {children}
    </select>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MetadataBuilder({
  onChange,
  metadata,
}: {
  onChange?: (metadata: Metadata) => void;
  metadata?: Metadata;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [config, setConfig] = useState<MetadataConfig>(() => parseMetadata(metadata));
  const [keywordInput, setKeywordInput] = useState("");

  // Ref to track the last emitted or received config string to prevent infinite loops
  const lastSerializedConfig = useRef<string>("");

  // Handle incoming prop changes (Sync Down)
  useEffect(() => {
    if (metadata) {
      const incomingConfig = parseMetadata(metadata);
      const incomingStr = JSON.stringify(incomingConfig);

      if (incomingStr !== lastSerializedConfig.current) {
        lastSerializedConfig.current = incomingStr;
        setConfig(incomingConfig);
      }
    }
  }, [metadata]);

  // Handle internal state changes (Sync Up)
  useEffect(() => {
    const currentStr = JSON.stringify(config);
    if (currentStr !== lastSerializedConfig.current) {
      lastSerializedConfig.current = currentStr;
      onChange?.(generateMetadata(config));
    }
  }, [config, onChange]);

  const set = (key: keyof MetadataConfig, value: string | boolean | string[]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = keywordInput.trim();
    if (!val || config.keywords.includes(val)) return;
    set("keywords", [...config.keywords, val]);
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) =>
    set(
      "keywords",
      config.keywords.filter((k) => k !== kw)
    );

  return (
    <section className="space-y-8">
      <div className="flex gap-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-mono font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic */}
      {activeTab === "basic" && (
        <div className="space-y-8">
          <Field label="Title">
            <Input
              value={config.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="My App"
            />
          </Field>
          <Row>
            <Field label="Title Template" hint="e.g. %s | My App">
              <Input
                value={config.titleTemplate}
                onChange={(e) => set("titleTemplate", e.target.value)}
                placeholder="%s | My App"
              />
            </Field>
            <Field label="Title Default">
              <Input
                value={config.titleDefault}
                onChange={(e) => set("titleDefault", e.target.value)}
                placeholder="My App"
              />
            </Field>
          </Row>
          <Field label="Description">
            <Textarea
              value={config.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="A brief description of your page."
              rows={3}
            />
          </Field>
          <Field label="Keywords" hint="Press Enter to add.">
            <div
              className="flex flex-wrap gap-2 py-2 border-b border-border cursor-text min-h-[38px]"
              onClick={() => document.getElementById("kw-input")?.focus()}
            >
              {config.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary text-xs font-mono font-medium border border-primary/10 rounded"
                >
                  {kw}
                  <button
                    onClick={() => removeKeyword(kw)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <input
                id="kw-input"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
                placeholder={config.keywords.length === 0 ? "Add keyword..." : ""}
                className="bg-transparent text-sm font-mono font-medium placeholder:text-foreground/10 outline-none min-w-[80px]"
              />
            </div>
          </Field>
          <Row>
            <Field label="Authors">
              <Input
                value={config.authors}
                onChange={(e) => set("authors", e.target.value)}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Application Name">
              <Input
                value={config.applicationName}
                onChange={(e) => set("applicationName", e.target.value)}
                placeholder="My App"
              />
            </Field>
          </Row>
          <Row>
            <Field label="Generator">
              <Input
                value={config.generator}
                onChange={(e) => set("generator", e.target.value)}
                placeholder="Next.js"
              />
            </Field>
            <Field label="Category">
              <Input
                value={config.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="technology"
              />
            </Field>
          </Row>
          <Field label="Referrer">
            <Select value={config.referrer} onChange={(e) => set("referrer", e.target.value)}>
              <option value="">— none —</option>
              <option>no-referrer</option>
              <option>origin</option>
              <option>no-referrer-when-downgrade</option>
              <option>origin-when-cross-origin</option>
              <option>same-origin</option>
              <option>strict-origin</option>
              <option>strict-origin-when-cross-origin</option>
              <option>unsafe-url</option>
            </Select>
          </Field>
        </div>
      )}

      {/* Open Graph */}
      {activeTab === "og" && (
        <div className="space-y-8">
          <Field label="og:type">
            <Select value={config.ogType} onChange={(e) => set("ogType", e.target.value)}>
              <option>website</option>
              <option>article</option>
              <option>book</option>
              <option>profile</option>
              <option>music.song</option>
              <option>video.movie</option>
            </Select>
          </Field>
          <Field label="og:title">
            <Input
              value={config.ogTitle}
              onChange={(e) => set("ogTitle", e.target.value)}
              placeholder="Defaults to title"
            />
          </Field>
          <Field label="og:description">
            <Textarea
              value={config.ogDescription}
              onChange={(e) => set("ogDescription", e.target.value)}
              placeholder="Defaults to description"
              rows={3}
            />
          </Field>
          <Field label="og:url">
            <Input
              value={config.ogUrl}
              onChange={(e) => set("ogUrl", e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
          <Field label="og:site_name">
            <Input
              value={config.ogSiteName}
              onChange={(e) => set("ogSiteName", e.target.value)}
              placeholder="My App"
            />
          </Field>
          <Field label="og:image url">
            <Input
              value={config.ogImageUrl}
              onChange={(e) => set("ogImageUrl", e.target.value)}
              placeholder="https://example.com/og.png"
            />
          </Field>
          <Row>
            <Field label="og:image width">
              <Input
                type="number"
                value={config.ogImageWidth}
                onChange={(e) => set("ogImageWidth", e.target.value)}
                placeholder="1200"
              />
            </Field>
            <Field label="og:image height">
              <Input
                type="number"
                value={config.ogImageHeight}
                onChange={(e) => set("ogImageHeight", e.target.value)}
                placeholder="630"
              />
            </Field>
          </Row>
          <Field label="og:image alt">
            <Input
              value={config.ogImageAlt}
              onChange={(e) => set("ogImageAlt", e.target.value)}
              placeholder="Descriptive alt text"
            />
          </Field>
          <Field label="og:locale">
            <Input
              value={config.ogLocale}
              onChange={(e) => set("ogLocale", e.target.value)}
              placeholder="en_US"
            />
          </Field>
        </div>
      )}

      {/* Twitter */}
      {activeTab === "twitter" && (
        <div className="space-y-8">
          <Field label="twitter:card">
            <Select value={config.twitterCard} onChange={(e) => set("twitterCard", e.target.value)}>
              <option>summary</option>
              <option value="summary_large_image">summary_large_image</option>
              <option>app</option>
              <option>player</option>
            </Select>
          </Field>
          <Field label="twitter:title">
            <Input
              value={config.twitterTitle}
              onChange={(e) => set("twitterTitle", e.target.value)}
              placeholder="Defaults to og:title"
            />
          </Field>
          <Field label="twitter:description">
            <Textarea
              value={config.twitterDescription}
              onChange={(e) => set("twitterDescription", e.target.value)}
              placeholder="Defaults to og:description"
              rows={3}
            />
          </Field>
          <Row>
            <Field label="twitter:site">
              <Input
                value={config.twitterSite}
                onChange={(e) => set("twitterSite", e.target.value)}
                placeholder="@handle"
              />
            </Field>
            <Field label="twitter:creator">
              <Input
                value={config.twitterCreator}
                onChange={(e) => set("twitterCreator", e.target.value)}
                placeholder="@author"
              />
            </Field>
          </Row>
          <Field label="twitter:image url">
            <Input
              value={config.twitterImageUrl}
              onChange={(e) => set("twitterImageUrl", e.target.value)}
              placeholder="https://example.com/twitter.png"
            />
          </Field>
          <Field label="twitter:image alt">
            <Input
              value={config.twitterImageAlt}
              onChange={(e) => set("twitterImageAlt", e.target.value)}
              placeholder="Descriptive alt text"
            />
          </Field>
        </div>
      )}

      {/* Robots */}
      {activeTab === "robots" && (
        <div className="space-y-8">
          <Row>
            <Field label="index">
              <Select
                value={String(config.robotsIndex)}
                onChange={(e) => set("robotsIndex", e.target.value === "true")}
              >
                <option value="true">true (index)</option>
                <option value="false">false (noindex)</option>
              </Select>
            </Field>
            <Field label="follow">
              <Select
                value={String(config.robotsFollow)}
                onChange={(e) => set("robotsFollow", e.target.value === "true")}
              >
                <option value="true">true (follow)</option>
                <option value="false">false (nofollow)</option>
              </Select>
            </Field>
          </Row>
          <Row>
            <Field label="nocache">
              <Select
                value={config.robotsNocache}
                onChange={(e) => set("robotsNocache", e.target.value)}
              >
                <option value="">— not set —</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            </Field>
            <Field label="googleBot index">
              <Select
                value={config.googleBotIndex}
                onChange={(e) => set("googleBotIndex", e.target.value)}
              >
                <option value="">— inherit —</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            </Field>
          </Row>
          <Row>
            <Field label="googleBot follow">
              <Select
                value={config.googleBotFollow}
                onChange={(e) => set("googleBotFollow", e.target.value)}
              >
                <option value="">— inherit —</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            </Field>
            <Field label="googleBot noimageindex">
              <Select
                value={config.googleBotNoimageindex}
                onChange={(e) => set("googleBotNoimageindex", e.target.value)}
              >
                <option value="">— not set —</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            </Field>
          </Row>
          <Field label="googleBot maxSnippet">
            <Input
              type="number"
              value={config.googleBotMaxSnippet}
              onChange={(e) => set("googleBotMaxSnippet", e.target.value)}
              placeholder="-1 (unlimited)"
            />
          </Field>
        </div>
      )}

      {/* Advanced */}
      {activeTab === "advanced" && (
        <div className="space-y-8">
          <Field label="Canonical URL">
            <Input
              value={config.canonical}
              onChange={(e) => set("canonical", e.target.value)}
              placeholder="https://example.com/page"
            />
          </Field>
          <Field label="Manifest">
            <Input
              value={config.manifest}
              onChange={(e) => set("manifest", e.target.value)}
              placeholder="/manifest.json"
            />
          </Field>
          <Row>
            <Field label="Theme Color (light)">
              <Input
                value={config.themeColorLight}
                onChange={(e) => set("themeColorLight", e.target.value)}
                placeholder="#ffffff"
              />
            </Field>
            <Field label="Theme Color (dark)">
              <Input
                value={config.themeColorDark}
                onChange={(e) => set("themeColorDark", e.target.value)}
                placeholder="#000000"
              />
            </Field>
          </Row>
          <Field label="Color Scheme">
            <Select value={config.colorScheme} onChange={(e) => set("colorScheme", e.target.value)}>
              <option value="">— none —</option>
              <option>normal</option>
              <option>dark</option>
              <option>light</option>
              <option>light dark</option>
              <option>dark light</option>
              <option>only light</option>
            </Select>
          </Field>
          <Field label="Viewport" hint="Leave blank to use Next.js defaults.">
            <Input
              value={config.viewport}
              onChange={(e) => set("viewport", e.target.value)}
              placeholder="width=device-width, initial-scale=1"
            />
          </Field>
          <Row>
            <Field label="Verification — Google">
              <Input
                value={config.verificationGoogle}
                onChange={(e) => set("verificationGoogle", e.target.value)}
                placeholder="verification token"
              />
            </Field>
            <Field label="Verification — Yandex">
              <Input
                value={config.verificationYandex}
                onChange={(e) => set("verificationYandex", e.target.value)}
                placeholder="verification code"
              />
            </Field>
          </Row>
          <Field label="Format Detection">
            <Select
              value={config.formatDetection}
              onChange={(e) => set("formatDetection", e.target.value)}
            >
              <option value="">— default —</option>
              <option value="false">telephone: false</option>
            </Select>
          </Field>
        </div>
      )}
    </section>
  );
}
