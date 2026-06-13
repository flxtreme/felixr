"use client";

import { Breadcrumbs } from "@/src/components/BreadCrumbs";
import PostRender from "@/src/components/PostRenderer";
import SinglePageLayout from "@/src/layouts/SinglePageLayout";
import {
  Bold,
  CheckSquare,
  Code,
  Edit3,
  Eye,
  FileCode2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table,
  Underline,
  Upload,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface PostContentEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  onFileUpload: (file: File) => void;
}

const TbBtn = ({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex items-center justify-center p-1.5 rounded text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-4 bg-border mx-1 self-center shrink-0" />;

// Shared style applied to BOTH overlay and textarea — must be identical
const EDITOR_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.625",
  letterSpacing: "normal",
  padding: "2rem",
  paddingBottom: "8rem",
  whiteSpace: "pre",
  wordBreak: "normal",
  overflowWrap: "normal",
  boxSizing: "border-box",
  overflow: "scroll",
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  margin: 0,
  border: "none",
  tabSize: 2,
};

export const PostContentEditor = ({
  content,
  onContentChange,
  onFileUpload,
}: PostContentEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  const wrap = useCallback(
    (before: string, after: string, placeholder = "") => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const sel = ta.value.substring(start, end) || placeholder;
      const next = ta.value.substring(0, start) + before + sel + after + ta.value.substring(end);
      onContentChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + sel.length;
      });
    },
    [onContentChange]
  );

  const prependLine = useCallback(
    (prefix: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd =
        ta.value.indexOf("\n", start) === -1 ? ta.value.length : ta.value.indexOf("\n", start);
      const line = ta.value.substring(lineStart, lineEnd);
      const next = ta.value.substring(0, lineStart) + prefix + line + ta.value.substring(lineEnd);
      onContentChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = lineStart + prefix.length + line.length;
      });
    },
    [onContentChange]
  );

  const insertAt = useCallback(
    (text: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const next = ta.value.substring(0, start) + text + ta.value.substring(start);
      onContentChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + text.length;
      });
    },
    [onContentChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertAt("  ");
    }
    if (e.metaKey || e.ctrlKey) {
      if (e.key === "b") {
        e.preventDefault();
        wrap("**", "**", "bold text");
      }
      if (e.key === "i") {
        e.preventDefault();
        wrap("*", "*", "italic text");
      }
      if (e.key === "k") {
        e.preventDefault();
        wrap("[", "](url)", "link text");
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const renderHighlighted = (text: string) => {
    let inCodeBlock = false;
    return text.split("\n").map((line, i) => {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return (
          <div key={i} style={{ whiteSpace: "pre", minHeight: "1.625em", color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
            {line || " "}
          </div>
        );
      }

      if (inCodeBlock) {
        return (
          <div key={i} style={{ whiteSpace: "pre", minHeight: "1.625em", color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
            {line || " "}
          </div>
        );
      }

      if (line.match(/^#{1,6}\s/)) {
        return (
          <div key={i} style={{ whiteSpace: "pre", minHeight: "1.625em", color: "#3b82f6", fontWeight: 700 }}>
            {line || " "}
          </div>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      return (
        <div key={i} style={{ whiteSpace: "pre", minHeight: "1.625em" }}>
          {parts.map((part, j) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <span key={j} style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: "3px", padding: "0 3px" }}>
                  {part}
                </span>
              );
            }
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <span key={j} style={{ fontWeight: 700 }}>
                  {part}
                </span>
              );
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <span key={j} style={{ color: "#f59e0b", fontWeight: 500 }}>
                  {part}
                </span>
              );
            }
            return part || "";
          })}
        </div>
      );
    });
  };

  return (
    <section className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <label className="text-2xl font-medium text-foreground/50">Content (Markdown)</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPreview((v) => !v)}
            className="text-sm font-mono font-medium text-foreground/40 hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isPreview ? "Edit" : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-mono font-medium text-foreground/40 hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3 h-3" />
            Upload .md/.txt
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".md,.txt"
            className="hidden"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 border-t border-border overflow-hidden">
        {/* Toolbar */}
        <div
          className={`flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border transition-opacity ${
            isPreview ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <span className="text-[10px] font-mono text-foreground/30 px-1">heading</span>
          {(["h1", "h2", "h3"] as const).map((h) => (
            <TbBtn
              key={h}
              title={`Heading ${h[1]}`}
              onClick={() => prependLine(`${"#".repeat(Number(h[1]))} `)}
            >
              <span className="text-xs font-bold font-mono">{h.toUpperCase()}</span>
            </TbBtn>
          ))}
          <Sep />
          <TbBtn title="Bold (⌘B)" onClick={() => wrap("**", "**", "bold text")}>
            <Bold className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Italic (⌘I)" onClick={() => wrap("*", "*", "italic text")}>
            <Italic className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Strikethrough" onClick={() => wrap("~~", "~~", "strikethrough")}>
            <Strikethrough className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Underline" onClick={() => wrap("<u>", "</u>", "underlined text")}>
            <Underline className="w-3.5 h-3.5" />
          </TbBtn>
          <Sep />
          <TbBtn title="Bullet list" onClick={() => prependLine("- ")}>
            <List className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Numbered list" onClick={() => prependLine("1. ")}>
            <ListOrdered className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Checklist" onClick={() => prependLine("- [ ] ")}>
            <CheckSquare className="w-3.5 h-3.5" />
          </TbBtn>
          <Sep />
          <TbBtn title="Blockquote" onClick={() => prependLine("> ")}>
            <Quote className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Inline code" onClick={() => wrap("`", "`", "code")}>
            <Code className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Code block" onClick={() => wrap("```\n", "\n```", "code here")}>
            <FileCode2 className="w-3.5 h-3.5" />
          </TbBtn>
          <Sep />
          <TbBtn title="Link (⌘K)" onClick={() => wrap("[", "](url)", "link text")}>
            <Link className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Image" onClick={() => wrap("![", "](image-url)", "alt text")}>
            <Image className="w-3.5 h-3.5" aria-label="Insert image" />
          </TbBtn>
          <TbBtn
            title="Table"
            onClick={() =>
              insertAt(
                "\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n"
              )
            }
          >
            <Table className="w-3.5 h-3.5" />
          </TbBtn>
          <TbBtn title="Horizontal rule" onClick={() => insertAt("\n\n---\n\n")}>
            <Minus className="w-3.5 h-3.5" />
          </TbBtn>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {isPreview ? (
            <div className="p-8 overflow-auto h-full bg-zinc-50/30 dark:bg-zinc-950/10">
              <SinglePageLayout
                header={
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                      Preview
                    </h1>
          
                    <Breadcrumbs
                      items={[{ label: "preview", href: "#" }]}
                    />
                  </div>
                }
              >
                <PostRender content={content} />
              </SinglePageLayout>
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              {/* Overlay */}
              <div
                ref={overlayRef}
                aria-hidden="true"
                style={{
                  ...EDITOR_STYLE,
                  scrollbarWidth: "none",
                  pointerEvents: "none",
                  color: "var(--foreground)",
                }}
              >
                {renderHighlighted(content)}
                <div style={{ height: "8rem" }} />
              </div>

              {/* Textarea */}
              <textarea
                ref={taRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                style={{
                  ...EDITOR_STYLE,
                  background: "transparent",
                  color: "transparent",
                  caretColor: "var(--foreground)",
                  resize: "none",
                  outline: "none",
                }}
                className="placeholder:text-foreground/10"
                placeholder="Write your story in markdown..."
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};