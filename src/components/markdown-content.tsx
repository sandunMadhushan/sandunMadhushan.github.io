import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "align", "style"],
    img: [...(defaultSchema.attributes?.img ?? []), "align", "width", "height"],
  },
};

/** Renders imported-README / case-study markdown to look like GitHub's README view. */
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="type-body markdown-content space-y-5 text-on-surface-variant [&>*:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          h1: (p) => <h2 className="type-h3 mt-12 text-on-surface first:mt-0" {...strip(p)} />,
          h2: (p) => <h2 className="type-h3 mt-12 text-on-surface first:mt-0" {...strip(p)} />,
          h3: (p) => <h3 className="mt-10 text-lg font-bold text-on-surface" {...strip(p)} />,
          h4: (p) => <h4 className="mt-8 text-base font-bold text-on-surface" {...strip(p)} />,
          h5: (p) => <h5 className="mt-6 text-sm font-bold uppercase tracking-wide text-on-surface" {...strip(p)} />,
          h6: (p) => <h6 className="mt-6 text-sm font-bold uppercase tracking-wide text-on-surface-variant" {...strip(p)} />,
          p: (p) => <p className="leading-relaxed" {...strip(p)} />,
          a: ({ href, ...rest }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              {...strip(rest)}
            />
          ),
          strong: (p) => <strong className="font-semibold text-on-surface" {...strip(p)} />,
          em: (p) => <em className="italic" {...strip(p)} />,
          del: (p) => <del className="opacity-70" {...strip(p)} />,
          ul: (p) => <ul className="list-disc space-y-2 pl-5 marker:text-primary-container" {...strip(p)} />,
          ol: (p) => (
            <ol className="list-decimal space-y-2 pl-5 marker:font-mono marker:text-sm marker:text-on-surface-variant/70" {...strip(p)} />
          ),
          li: (p) => <li className="pl-1 leading-relaxed" {...strip(p)} />,
          blockquote: (p) => (
            <blockquote className="border-l-2 border-primary/40 pl-4 italic text-on-surface-variant/90" {...strip(p)} />
          ),
          hr: () => <hr className="my-10 border-t border-outline-variant" />,
          code: ({ className, children, ...rest }) => {
            const isBlock = /language-/.test(className ?? "") || String(children).includes("\n");
            if (isBlock) {
              return (
                <code className={`font-mono text-sm ${className ?? ""}`} {...strip(rest)}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-surface-container-highest px-1.5 py-0.5 font-mono text-[0.85em] text-on-surface"
                {...strip(rest)}
              >
                {children}
              </code>
            );
          },
          pre: (p) => (
            <pre
              className="overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-lowest p-4 leading-relaxed"
              {...strip(p)}
            />
          ),
          table: (p) => (
            <div className="overflow-x-auto rounded-sm border border-outline-variant">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm" {...strip(p)} />
            </div>
          ),
          thead: (p) => <thead className="border-b border-outline-variant/40 bg-surface-container-lowest" {...strip(p)} />,
          th: (p) => <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-on-surface" {...strip(p)} />,
          td: (p) => <td className="border-t border-outline-variant/20 px-4 py-2.5" {...strip(p)} />,
          img: ({ alt, ...rest }) => (
            // eslint-disable-next-line @next/next/no-img-element -- README images come from arbitrary, unconfigured hosts
            <img alt={alt ?? ""} loading="lazy" className="my-2 inline-block max-w-full rounded-sm" {...strip(rest)} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function strip<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}
