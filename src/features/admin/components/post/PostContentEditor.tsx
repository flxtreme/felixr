"use client";

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
    className="flex items-center justify-center p-1.5 rounded text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-4 bg-border mx-1 self-center shrink-0" />;

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

  // Sync both scroll axes from textarea → overlay
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
          <div key={i} className="text-emerald-500 font-mono bg-emerald-500/5 whitespace-pre">
            {line || " "}
          </div>
        );
      }

      if (inCodeBlock) {
        return (
          <div key={i} className="text-emerald-500 font-mono bg-emerald-500/5 whitespace-pre">
            {line || " "}
          </div>
        );
      }

      if (line.match(/^#{1,6}\s/)) {
        return (
          <div key={i} className="text-blue-500 font-bold whitespace-pre">
            {line || " "}
          </div>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      return (
        <div key={i} className="min-h-[1.5rem] whitespace-pre">
          {parts.map((part, j) => {
            if (part.startsWith("`")) {
              return (
                <span key={j} className="text-emerald-500 font-mono bg-emerald-500/10 px-1 rounded">
                  {part}
                </span>
              );
            }
            if (part.startsWith("**")) {
              return (
                <span key={j} className="font-bold">
                  {part}
                </span>
              );
            }
            if (part.startsWith("*")) {
              return (
                <span key={j} className="text-amber-500 font-medium">
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
            <Image className="w-3.5 h-3.5" />
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
              <PostRender content={content || ""} />
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              {/*
                Overlay — must mirror the textarea's scroll position on BOTH axes.
                - overflow: scroll (not auto) so scrollbar gutter is always reserved,
                  keeping the width identical to the textarea at all times.
                - scrollbar-width: none hides the overlay's own scrollbars; only the
                  textarea's scrollbars are shown to the user.
                - whitespace-pre on every line keeps long lines from wrapping, enabling
                  horizontal scroll to work properly.
              */}
              <div
                ref={overlayRef}
                aria-hidden="true"
                className="absolute inset-0 p-8 text-sm font-mono font-medium leading-relaxed pointer-events-none"
                style={{
                  overflow: "scroll",
                  scrollbarWidth: "none",
                  // Precise match with textarea's box model so text layers stay aligned
                  boxSizing: "border-box",
                  wordBreak: "normal",
                  overflowWrap: "normal",
                  whiteSpace: "pre",
                }}
              >
                {renderHighlighted(content)}
                {/* Spacer prevents the last line from being clipped at scroll bottom */}
                <div style={{ height: "8rem" }} />
              </div>

              {/*
                Textarea — the real input layer.
                - text-transparent + caret-foreground: text is invisible (overlay shows it),
                  but the cursor is still visible.
                - white-space: pre + overflow: scroll: enables both X and Y scrolling to
                  match what the overlay can scroll.
                - scrollbar-width: none: hides the textarea's scrollbar; we only want the
                  scrollbar from… wait, actually we DO want the user to see one scrollbar.
                  Since overlay's scrollbars are hidden, we show the textarea's scrollbar
                  here by NOT hiding it. The overlay width = textarea width because both
                  have overflow:scroll reserving the same gutter.
              */}
              <textarea
                ref={taRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                className="absolute inset-0 w-full h-full bg-transparent p-8 text-transparent caret-foreground text-sm font-mono font-medium leading-relaxed focus:outline-none resize-none placeholder:text-foreground/10"
                style={{
                  overflow: "scroll",
                  whiteSpace: "pre",
                  wordBreak: "normal",
                  overflowWrap: "normal",
                  boxSizing: "border-box",
                  paddingBottom: "8rem",
                }}
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
