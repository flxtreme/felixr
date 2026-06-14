import { JSX, ReactNode, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostRendererProps {
  content: string;
  className?: string;
}

type Align = "left" | "center" | "right";

interface ParsedTable {
  head: string[];
  body: string[][];
  aligns: Align[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTable(block: string): ParsedTable {
  const rows = block.trim().split("\n");
  const alignRow = rows.find((r) => /^\|[-| :]+\|/.test(r));

  const aligns: Align[] = alignRow
    ? alignRow
        .split("|")
        .filter(Boolean)
        .map((c): Align => {
          if (c.startsWith(":") && c.endsWith(":")) return "center";
          if (c.endsWith(":")) return "right";
          return "left";
        })
    : [];

  const dataRows = rows.filter((r) => !/^\|[-| :]+\|/.test(r));
  const cells = (r: string): string[] =>
    r
      .split("|")
      .filter((_, i, a) => i > 0 && i < a.length - 1)
      .map((c) => c.trim());

  const [head, ...body] = dataRows;
  return { head: cells(head ?? ""), body: body.map(cells), aligns };
}

// ─── Inline renderer ──────────────────────────────────────────────────────────

function parseInline(text: string, keyPrefix: string = ""): ReactNode[] {
  const pattern =
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\[\^(\w+)\]|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*\n]+)\*|~~([^~]+)~~|==([^=]+)==|\^([^^]+)\^|~([^~]+)~|\+\+([^+]+)\+\+|`([^`]+)`/g;

  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));

    const k = `${keyPrefix}-${idx++}`;

    if (m[1] !== undefined) {
      nodes.push(<img key={k} src={m[2]} alt={m[1]} title={m[3]} className="pr-img" />);
    } else if (m[4] !== undefined) {
      nodes.push(
        <a key={k} href={m[5]} title={m[6]} className="pr-link" target="_blank" rel="noopener noreferrer">
          {m[4]}
        </a>
      );
    } else if (m[7] !== undefined) {
      nodes.push(
        <sup key={k} className="pr-footnote-ref">
          <a href={`#fn-${m[7]}`}>{m[7]}</a>
        </sup>
      );
    } else if (m[8] !== undefined) {
      nodes.push(<strong key={k}><em>{m[8]}</em></strong>);
    } else if (m[9] !== undefined) {
      nodes.push(<strong key={k}>{m[9]}</strong>);
    } else if (m[10] !== undefined) {
      nodes.push(<em key={k}>{m[10]}</em>);
    } else if (m[11] !== undefined) {
      nodes.push(<del key={k}>{m[11]}</del>);
    } else if (m[12] !== undefined) {
      nodes.push(<mark key={k}>{m[12]}</mark>);
    } else if (m[13] !== undefined) {
      nodes.push(<sup key={k}>{m[13]}</sup>);
    } else if (m[14] !== undefined) {
      nodes.push(<sub key={k}>{m[14]}</sub>);
    } else if (m[15] !== undefined) {
      nodes.push(<ins key={k}>{m[15]}</ins>);
    } else if (m[16] !== undefined) {
      nodes.push(<code key={k} className="pr-inline-code">{m[16]}</code>);
    }

    last = pattern.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// ─── Unordered list renderer ──────────────────────────────────────────────────

function renderUL(lines: string[], baseIndent: number, keyBase: string): JSX.Element {
  const items: ReactNode[] = [];
  let i = 0;
  let ki = 0;

  while (i < lines.length) {
    const line = lines[i];
    const indentMatch = line.match(/^(\s*)[-*+] /);
    if (!indentMatch) { i++; continue; }

    const indent = indentMatch[1].length;
    if (indent !== baseIndent) { i++; continue; }

    const content = line.replace(/^(\s*)[-*+] /, "");
    const taskMatch = content.match(/^\[(x| )\] (.+)$/i);

    const nested: string[] = [];
    i++;
    while (i < lines.length && (lines[i].match(/^(\s*)[-*+] /)?.[1]?.length ?? 0) > baseIndent) {
      nested.push(lines[i]);
      i++;
    }

    if (taskMatch) {
      const done = taskMatch[1].toLowerCase() === "x";
      items.push(
        <li key={`${keyBase}-li-${ki++}`} className="pr-task">
          <span className={`pr-check${done ? " checked" : ""}`} aria-hidden="true">{done ? "✓" : "○"}</span>
          <span>{parseInline(taskMatch[2], `${keyBase}-t`)}</span>
          {nested.length > 0 && renderUL(nested, indent + 2, `${keyBase}-n`)}
        </li>
      );
    } else {
      items.push(
        <li key={`${keyBase}-li-${ki++}`} className="pr-li">
          {parseInline(content, `${keyBase}-li`)}
          {nested.length > 0 && renderUL(nested, indent + 2, `${keyBase}-n`)}
        </li>
      );
    }
  }

  return <ul key={keyBase} className="pr-ul">{items}</ul>;
}

// ─── Syntax highlighter ───────────────────────────────────────────────────────

type TokenType =
  | "comment"
  | "string"
  | "control"
  | "decl"
  | "fn-name"
  | "generic"
  | "number"
  | "variable"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

function highlightCode(code: string): ReactNode[] {
  const COMMENTS  = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const STRINGS   = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
  const CONTROL   = /\b(if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|of|in)\b/g;
  const DECL      = /\b(const|let|var|class|extends|implements|interface|type|enum|namespace|declare|abstract|function|async|await|new|typeof|instanceof|import|export|default|from|as|static|public|private|protected|readonly|override)\b/g;
  const GENERICS  = /<([A-Z][a-zA-Z0-9_$]*(?:\[\])?(?:,\s*[A-Z][a-zA-Z0-9_$]*(?:\[\])?)*)\s*>/g;
  const METHODS   = /\.([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g;
  const FN_NAMES  = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  const CALLS     = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*[<(])/g;
  const NUMBERS   = /\b(\d+\.?\d*)\b/g;
  const VARIABLES = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;

  const resetAll = () => {
    [COMMENTS, STRINGS, CONTROL, DECL, GENERICS, METHODS, FN_NAMES, CALLS, NUMBERS, VARIABLES].forEach(
      (r) => (r.lastIndex = 0)
    );
  };

  const DECL_WORDS = new Set([
    "const","let","var","class","extends","implements","interface","type","enum",
    "namespace","declare","abstract","function","async","await","new","typeof",
    "instanceof","import","export","default","from","as","static","public",
    "private","protected","readonly","override",
  ]);
  const CONTROL_WORDS = new Set([
    "if","else","for","while","do","switch","case","break","continue","return",
    "try","catch","finally","throw","of","in",
  ]);

  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const rest = code.slice(i);
    let matched = false;

    for (const [pat, type] of [
      [COMMENTS, "comment"],
      [STRINGS,  "string"],
    ] as [RegExp, TokenType][]) {
      pat.lastIndex = 0;
      const m = pat.exec(rest);
      if (m && m.index === 0) {
        tokens.push({ type, value: m[0] });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    FN_NAMES.lastIndex = 0;
    const fnm = FN_NAMES.exec(rest);
    if (fnm && fnm.index === 0) {
      const kwEnd = fnm[0].indexOf(fnm[1]);
      tokens.push({ type: "decl",    value: rest.slice(0, kwEnd).trimEnd() });
      tokens.push({ type: "text",    value: " " });
      tokens.push({ type: "fn-name", value: fnm[1] });
      i += fnm[0].length;
      continue;
    }

    GENERICS.lastIndex = 0;
    const gm = GENERICS.exec(rest);
    if (gm && gm.index === 0) {
      tokens.push({ type: "text",    value: "<" });
      tokens.push({ type: "generic", value: gm[1] });
      tokens.push({ type: "text",    value: ">" });
      i += gm[0].length;
      continue;
    }

    METHODS.lastIndex = 0;
    const mm = METHODS.exec(rest);
    if (mm && mm.index === 0) {
      tokens.push({ type: "text",    value: "." });
      tokens.push({ type: "fn-name", value: mm[1] });
      i += mm[0].length;
      continue;
    }

    resetAll();

    DECL.lastIndex = 0;
    const dm = DECL.exec(rest);
    if (dm && dm.index === 0) {
      tokens.push({ type: "decl", value: dm[0] });
      i += dm[0].length;
      continue;
    }

    CONTROL.lastIndex = 0;
    const cm = CONTROL.exec(rest);
    if (cm && cm.index === 0) {
      tokens.push({ type: "control", value: cm[0] });
      i += cm[0].length;
      continue;
    }

    NUMBERS.lastIndex = 0;
    const nm = NUMBERS.exec(rest);
    if (nm && nm.index === 0) {
      tokens.push({ type: "number", value: nm[0] });
      i += nm[0].length;
      continue;
    }

    CALLS.lastIndex = 0;
    const callm = CALLS.exec(rest);
    if (callm && callm.index === 0) {
      const word = callm[1];
      if (!DECL_WORDS.has(word) && !CONTROL_WORDS.has(word)) {
        tokens.push({ type: "fn-name", value: word });
        i += word.length;
        continue;
      }
    }

    VARIABLES.lastIndex = 0;
    const vm = VARIABLES.exec(rest);
    if (vm && vm.index === 0) {
      tokens.push({ type: "variable", value: vm[0] });
      i += vm[0].length;
      continue;
    }

    tokens.push({ type: "text", value: code[i] });
    i++;
  }

  return tokens.map((t, idx) =>
    t.type === "text"
      ? t.value
      : <span key={idx} className={`sh-${t.type}`}>{t.value}</span>
  );
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function renderBlocks(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let keyIdx = 0;
  const key = (prefix: string) => `${prefix}-${keyIdx++}`;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre key={key("pre")} className="pr-pre">
          <code className={`pr-code${lang ? ` language-${lang}` : ""}`}>
            {lang ? highlightCode(codeLines.join("\n")) : codeLines.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    const headMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headMatch) {
      const level = headMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      blocks.push(
        <Tag key={key("h")} className={`pr-h${level}`}>
          {parseInline(headMatch[2], key("hi"))}
        </Tag>
      );
      i++;
      continue;
    }

    if (/^(---|\*\*\*|___)(\s*)$/.test(line)) {
      blocks.push(<hr key={key("hr")} className="pr-hr" />);
      i++;
      continue;
    }

    if (/^>/.test(line)) {
      const bqLines: string[] = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        bqLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={key("bq")} className="pr-blockquote">
          {renderBlocks(bqLines.join("\n"))}
        </blockquote>
      );
      continue;
    }

    if (/^\|/.test(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      const { head, body, aligns } = parseTable(tableLines.join("\n"));
      blocks.push(
        <div key={key("tw")} className="pr-table-wrap">
          <table className="pr-table">
            <thead>
              <tr>
                {head.map((cell, ci) => (
                  <th key={ci} className="pr-th" style={{ textAlign: aligns[ci] ?? "left" }}>
                    {parseInline(cell, key("thc"))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="pr-tr">
                  {row.map((cell, ci) => (
                    <td key={ci} className="pr-td" style={{ textAlign: aligns[ci] ?? "left" }}>
                      {parseInline(cell, key("tdc"))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^(\s*)[-*+] /.test(line)) {
      const baseIndent = line.match(/^(\s*)/)?.[1].length ?? 0;
      const listLines: string[] = [];
      while (i < lines.length && (/^(\s*)[-*+] /.test(lines[i]) || /^\s{2,}/.test(lines[i]))) {
        listLines.push(lines[i]);
        i++;
      }
      blocks.push(renderUL(listLines, baseIndent, key("ul")));
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const olLines: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        olLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <ol key={key("ol")} className="pr-ol">
          {olLines.map((l, li) => (
            <li key={li} className="pr-li">
              {parseInline(l.replace(/^\d+\.\s+/, ""), key("oli"))}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const fnMatch = line.match(/^\[\^(\w+)\]:\s+(.+)$/);
    if (fnMatch) {
      blocks.push(
        <p key={key("fn")} className="pr-footnote-def" id={`fn-${fnMatch[1]}`}>
          <sup>{fnMatch[1]}</sup> {parseInline(fnMatch[2], key("fni"))}
        </p>
      );
      i++;
      continue;
    }

    if (i + 1 < lines.length && /^:\s+/.test(lines[i + 1]) && line.trim() !== "") {
      const term = line.trim();
      const defs: string[] = [];
      i++;
      while (i < lines.length && /^:\s+/.test(lines[i])) {
        defs.push(lines[i].replace(/^:\s+/, ""));
        i++;
      }
      blocks.push(
        <dl key={key("dl")} className="pr-dl">
          <dt className="pr-dt">{parseInline(term, key("dlt"))}</dt>
          {defs.map((d, di) => (
            <dd key={di} className="pr-dd">{parseInline(d, key("dld"))}</dd>
          ))}
        </dl>
      );
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push(<img key={key("img")} src={imgMatch[2]} alt={imgMatch[1]} className="pr-img" />);
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6} |>|```|\||[-*+] |\d+\. |---|\*\*\*|___)/.test(lines[i]) &&
      !/^\[\^/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length) {
      const content: ReactNode[] = [];
      paraLines.forEach((pl, pli) => {
        const hardBreak = pl.endsWith("  ");
        const trimmed = pl.replace(/  $/, "");
        content.push(...parseInline(trimmed, key("para")));
        if (hardBreak) {
          content.push(<br key={key("br")} />);
        } else if (pli < paraLines.length - 1) {
          content.push(" ");
        }
      });
      blocks.push(<p key={key("p")} className="pr-p">{content}</p>);
    }
  }

  return blocks;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
.pr-root {
  --pr-muted-bg:    color-mix(in srgb, var(--background) 94%, var(--foreground) 6%);
  --pr-muted-text:  color-mix(in srgb, var(--foreground) 60%, var(--background) 40%);
  --pr-subtle-text: color-mix(in srgb, var(--foreground) 38%, var(--background) 62%);
  --pr-primary-dim: color-mix(in srgb, var(--primary) 25%, transparent);
}

.pr-root {
  font-family: var(--font-sans, Arial, Helvetica, sans-serif);
  font-size: 16px;
  line-height: 1.75;
  color: var(--foreground);
  background: transparent;
}

.pr-h1 { font-size: 2.1rem;  font-weight: 700; line-height: 1.15; margin: 0 0 1rem;       letter-spacing: -.025em; color: var(--foreground); }
.pr-h2 { font-size: 1.55rem; font-weight: 700; line-height: 1.25; margin: 2rem 0 .75rem;  padding-bottom: .4rem; border-bottom: 1px solid var(--border); color: var(--foreground); }
.pr-h3 { font-size: 1.25rem; font-weight: 600; margin: 1.75rem 0 .6rem;  color: var(--foreground); }
.pr-h4 { font-size: 1.05rem; font-weight: 600; margin: 1.5rem 0 .5rem;   color: var(--foreground); }
.pr-h5 { font-size: .9rem;   font-weight: 600; margin: 1.25rem 0 .4rem;  text-transform: uppercase; letter-spacing: .06em; color: var(--pr-muted-text); }
.pr-h6 { font-size: .8rem;   font-weight: 600; margin: 1.25rem 0 .4rem;  text-transform: uppercase; letter-spacing: .06em; color: var(--pr-subtle-text); }

.pr-p { margin: .85rem 0; color: var(--foreground); }

.pr-blockquote {
  border-left: 3px solid var(--primary);
  margin: 1.25rem 0;
  padding: .6rem 1.1rem;
  background: var(--pr-muted-bg);
  border-radius: 0 6px 6px 0;
  font-style: italic;
  color: var(--pr-muted-text);
}
.pr-blockquote .pr-p { margin: .25rem 0; }

.pr-hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }

.pr-ul { margin: .75rem 0 .75rem 1.6rem; list-style: disc; }
.pr-ul .pr-ul { list-style: circle; margin: .2rem 0 .2rem 1.25rem; }
.pr-ul .pr-ul .pr-ul { list-style: square; }
.pr-ol { margin: .75rem 0 .75rem 1.6rem; list-style: decimal; }
.pr-ol .pr-ol { list-style: lower-alpha; margin: .2rem 0 .2rem 1.25rem; }
.pr-li { margin: .3rem 0; color: var(--foreground); }

.pr-task { list-style: none; display: flex; align-items: flex-start; gap: .55rem; margin: .35rem 0; }
.pr-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 17px; height: 17px; min-width: 17px;
  border: 1.5px solid var(--border);
  border-radius: 4px; font-size: 10px;
  color: var(--pr-subtle-text); margin-top: 3px;
}
.pr-check.checked { background: var(--primary); border-color: var(--primary); color: var(--background); }

.pr-pre {
  background: var(--pr-muted-bg);
  border: 1px solid var(--border);
  border-radius: 8px; padding: 1rem 1.1rem;
  overflow-x: auto; margin: 1.1rem 0;
}
.pr-code {
  font-family: var(--font-mono, 'Fira Code', 'Cascadia Code', Consolas, monospace);
  font-size: 13.5px; line-height: 1.65; color: var(--foreground);
}
.pr-inline-code {
  font-family: var(--font-mono, 'Fira Code', 'Cascadia Code', Consolas, monospace);
  font-size: .855em;
  background: var(--pr-muted-bg);
  border: 1px solid var(--border);
  border-radius: 4px; padding: .1em .38em;
  color: var(--foreground);
}

.sh-string   { color: #16a34a; }
.sh-decl     { color: #2563eb; }
.sh-control  { color: #7c3aed; }
.sh-fn-name  { color: #d97706; }
.sh-generic  { color: #16a34a; }
.sh-variable { color: #0284c7; }
.sh-number   { color: #ea580c; }
.sh-comment  { color: #9ca3af; font-style: italic; }

.pr-link {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid var(--pr-primary-dim);
  transition: opacity .15s;
}
.pr-link:hover { opacity: .75; }

.pr-img { max-width: 100%; border-radius: 8px; display: block; margin: 1rem 0; }

.pr-table-wrap {
  overflow-x: auto; margin: 1.1rem 0;
  border: 1px solid var(--border); border-radius: 8px;
}
.pr-table { border-collapse: collapse; width: 100%; font-size: 14.5px; }
.pr-th {
  padding: .6rem .9rem; text-align: left;
  font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em;
  color: var(--pr-muted-text);
  background: var(--pr-muted-bg);
  border-bottom: 1px solid var(--border);
}
.pr-td { padding: .55rem .9rem; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--foreground); }
.pr-tr:last-child .pr-td { border-bottom: none; }
.pr-table tbody .pr-tr:hover td { background: var(--pr-muted-bg); }

.pr-dl { margin: .75rem 0; }
.pr-dt { font-weight: 600; font-size: 15px; margin-top: .6rem; color: var(--foreground); }
.pr-dd { margin: .15rem 0 .4rem 1.5rem; color: var(--pr-muted-text); font-size: 14.5px; }

.pr-footnote-def {
  font-size: 13px; color: var(--pr-muted-text);
  border-top: 1px solid var(--border);
  padding-top: .6rem; margin-top: 2.5rem;
}
.pr-footnote-ref a { font-size: .75em; color: var(--primary); text-decoration: none; vertical-align: super; }

.pr-root mark {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  color: var(--foreground);
  border-radius: 2px; padding: 0 .15em;
}
.pr-root ins { text-decoration: underline; text-decoration-style: dotted; color: var(--foreground); }
.pr-root del { color: var(--pr-muted-text); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostRenderer({ content = "", className }: PostRendererProps): JSX.Element {
  const blocks = useMemo(() => renderBlocks(content), [content]);

  return (
    <>
      <style>{styles}</style>
      <article className={`pr-root${className ? ` ${className}` : ""}`}>{blocks}</article>
    </>
  );
}