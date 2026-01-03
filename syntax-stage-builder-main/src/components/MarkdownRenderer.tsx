
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

    const handleCopy = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-6 text-white border-b border-white/10 pb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-3 mt-5 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-4 text-white">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-indigo-100/90">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-indigo-100/90">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-indigo-100/90">{children}</ol>,
                li: ({ children }) => <li className="pl-1">{children}</li>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-500/10 rounded-r text-indigo-200 italic">
                        {children}
                    </blockquote>
                ),
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors">
                        {children}
                    </a>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto mb-6 rounded-lg border border-white/10">
                        <table className="w-full text-left border-collapse bg-white/5">{children}</table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-white/10 text-white">{children}</thead>,
                th: ({ children }) => <th className="p-3 border-b border-white/10 font-semibold">{children}</th>,
                td: ({ children }) => <td className="p-3 border-b border-white/5 text-sm">{children}</td>,
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    const codeString = String(children).replace(/\n$/, '');

                    if (isInline) {
                        return (
                            <code className="bg-indigo-950/50 text-indigo-200 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-500/20" {...props}>
                                {children}
                            </code>
                        );
                    }

                    // Generate a semi-stable index for copy button state (using length + first char code as a simple hash substitute)
                    const codeIndex = codeString.length + (codeString.charCodeAt(0) || 0);

                    return (
                        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#1d1f21] shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {match?.[1] || 'Code'}
                                </span>
                                <button
                                    onClick={() => handleCopy(codeString, codeIndex)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    {copiedIndex === codeIndex ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <SyntaxHighlighter
                                {...props}
                                style={atomDark}
                                language={match?.[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                }}
                            >
                                {codeString}
                            </SyntaxHighlighter>
                        </div>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
