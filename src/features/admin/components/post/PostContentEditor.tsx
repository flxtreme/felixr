"use client";

import { useModal } from "flxtheme";
import { AdminUploadPickerModal } from "@/src/features/admin/uploads/AdminUploadPickerModal";
import PostRender from "@/src/components/PostRenderer";
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
    className="flex items-center justify-center p-1.5 rounded text-foreground/70 hover:text-foreground hover:bg-foreground/15 transition-colors"
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-4 bg-border mx-1 self-center shrink-0" />;

const IMAGE_PICKER_MODAL_ID = "admin-post-content-image-picker";

// Applied to BOTH overlay and textarea — must be identical so text lines up.
// Never vary fontWeight / padding / letter-spacing inside the overlay spans.
const EDITOR_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-fira-code), monospace",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.625",
  letterSpacing: "normal",
  fontVariantLigatures: "none",
  fontKerning: "none",
  fontSynthesis: "none",
  textRendering: "optimizeSpeed",
  padding: "2rem",
  paddingBottom: "8rem",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
  boxSizing: "border-box",
  overflowX: "hidden",
  overflowY: "scroll",
  scrollbarGutter: "stable",
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
  const { openModal } = useModal();

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
    const mod = e.metaKey || e.ctrlKey;
    const ta = e.currentTarget;

    // Tab / Shift+Tab: indent / outdent
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        const start = ta.selectionStart;
        const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
        const m = ta.value.substring(lineStart).match(/^ {1,2}/);
        if (m) {
          onContentChange(
            ta.value.substring(0, lineStart) + ta.value.substring(lineStart + m[0].length)
          );
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = Math.max(lineStart, start - m[0].length);
          });
        }
      } else {
        insertAt("  ");
      }
      return;
    }

    // Enter: continue lists / quotes
    if (e.key === "Enter" && !mod && !e.shiftKey) {
      const pos = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf("\n", pos - 1) + 1;
      const line = ta.value.substring(lineStart, pos);
      const m = line.match(/^(\s*)(- \[[ x]\] |[-*] |\d+\. |> )(.*)$/);
      if (m && ta.selectionStart === ta.selectionEnd) {
        e.preventDefault();
        const [, indent, marker, rest] = m;
        if (!rest.trim()) {
          // empty item: remove the marker
          onContentChange(ta.value.substring(0, lineStart) + ta.value.substring(pos));
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = lineStart;
          });
        } else {
          let next = marker;
          if (/^\d+\. $/.test(marker)) next = `${parseInt(marker, 10) + 1}. `;
          if (marker.startsWith("- [")) next = "- [ ] ";
          insertAt("\n" + indent + next);
        }
        return;
      }
    }

    if (!mod) return;

    // Digits via e.code so Alt/Shift don't change the key value on Mac
    if (e.altKey && ["Digit1", "Digit2", "Digit3"].includes(e.code)) {
      e.preventDefault();
      prependLine("#".repeat(Number(e.code.slice(-1))) + " ");
      return;
    }

    if (e.shiftKey) {
      switch (e.code) {
        case "KeyX":
          e.preventDefault();
          wrap("~~", "~~", "strikethrough");
          return;
        case "KeyC":
          e.preventDefault();
          wrap("```\n", "\n```", "code here");
          return;
        case "KeyI":
          e.preventDefault();
          openModal(IMAGE_PICKER_MODAL_ID);
          return;
        case "Digit7":
          e.preventDefault();
          prependLine("1. ");
          return;
        case "Digit8":
          e.preventDefault();
          prependLine("- ");
          return;
        case "Digit9":
          e.preventDefault();
          prependLine("> ");
          return;
        case "Digit0":
          e.preventDefault();
          prependLine("- [ ] ");
          return;
        case "Minus":
          e.preventDefault();
          insertAt("\n\n---\n\n");
          return;
        case "KeyP":
          e.preventDefault();
          setIsPreview((v) => !v);
          return;
      }
      return;
    }

    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        wrap("**", "**", "bold text");
        break;
      case "i":
        e.preventDefault();
        wrap("_", "_", "italic text");
        break;
      case "u":
        e.preventDefault();
        wrap("<u>", "</u>", "underlined text");
        break;
      case "e":
        e.preventDefault();
        wrap("`", "`", "code");
        break;
      case "k":
        e.preventDefault();
        wrap("[", "](url)", "link text");
        break;
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
    const base: React.CSSProperties = { minHeight: "1.625em" };

    return text.split("\n").map((line, i) => {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return (
          <div key={i} style={{ ...base, color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
            {line || " "}
          </div>
        );
      }

      if (inCodeBlock) {
        return (
          <div key={i} style={{ ...base, color: "#10b981", background: "rgba(16,185,129,0.05)" }}>
            {line || " "}
          </div>
        );
      }

      if (line.match(/^#{1,6}\s/)) {
        return (
          <div key={i} style={{ ...base, color: "#3b82f6" }}>
            {line || " "}
          </div>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|(?<!\w)_[^_\n]+_(?!\w)|`.*?`)/g);
      return (
        <div key={i} style={base}>
          {parts.map((part, j) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <span key={j} style={{ color: "#10b981", background: "rgba(16,185,129,0.1)" }}>
                  {part}
                </span>
              );
            }
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <span key={j} style={{ color: "#e879f9" }}>
                  {part}
                </span>
              );
            }
            if (
              (part.startsWith("*") && part.endsWith("*")) ||
              (part.length > 2 && part.startsWith("_") && part.endsWith("_"))
            ) {
              return (
                <span key={j} style={{ color: "#f59e0b" }}>
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
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-mono font-medium text-foreground/40">Content</label>
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

      <div className="flex flex-col flex-1 border border-border rounded">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div
            className={`flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border transition-opacity ${isPreview ? "opacity-40 pointer-events-none" : ""
              }`}
          >
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
            <TbBtn title="Italic (⌘I)" onClick={() => wrap("_", "_", "italic text")}>
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
            <TbBtn title="Image" onClick={() => openModal(IMAGE_PICKER_MODAL_ID)}>
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
              <div className="relative w-full h-full">
                <div className="absolute inset-0 overflow-y-auto p-8 pb-32 bg-zinc-50/30 dark:bg-zinc-950/10">
                  <PostRender content={content} />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                {/* Overlay (highlighted text) */}
                <div
                  ref={overlayRef}
                  aria-hidden="true"
                  style={{
                    ...EDITOR_STYLE,
                    scrollbarColor: "transparent transparent",
                    pointerEvents: "none",
                    color: "var(--foreground)",
                  }}
                >
                  {renderHighlighted(content)}
                </div>

                {/* Textarea (input + caret, text itself hidden) */}
                <textarea
                  ref={taRef}
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onScroll={handleScroll}
                  style={{
                    ...EDITOR_STYLE,
                    background: "transparent",
                    color: "inherit",
                    WebkitTextFillColor: "transparent",
                    caretColor: "currentColor",
                    resize: "none",
                    outline: "none",
                  }}
                  className="placeholder:text-foreground/20"
                  placeholder="Write your story in markdown..."
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminUploadPickerModal
        id={IMAGE_PICKER_MODAL_ID}
        title="Choose image"
        imageOnly
        onSelect={(upload: any) => {
          const alt = upload.alt || upload.name || upload.filename || upload.originalName || "";
          insertAt(`![${alt}](${upload.publicPath})\n`);
        }}
      />
    </div>
  );
};