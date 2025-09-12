"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
    code: string;
    language: string;
    filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Simple syntax highlighting for common languages
    const highlightCode = (code: string, lang: string) => {
        if (lang === 'javascript' || lang === 'js') {
            return code
                .replace(/(const|let|var|function|return|if|else|for|while|try|catch|async|await|import|export|from)/g, '<span class="text-purple-400">$1</span>')
                .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
                .replace(/(\d+)/g, '<span class="text-blue-400">$1</span>')
                .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
        }
        if (lang === 'python') {
            return code
                .replace(/(def|class|import|from|return|if|else|elif|for|while|try|except|async|await|with)/g, '<span class="text-purple-400">$1</span>')
                .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
                .replace(/(\d+)/g, '<span class="text-blue-400">$1</span>')
                .replace(/(#.*$)/gm, '<span class="text-gray-500">$1</span>');
        }
        if (lang === 'php') {
            return code
                .replace(/(<\?php|\?>)/g, '<span class="text-purple-400">$1</span>')
                .replace(/(function|return|if|else|elseif|for|while|try|catch|class|public|private|protected)/g, '<span class="text-purple-400">$1</span>')
                .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
                .replace(/(\d+)/g, '<span class="text-blue-400">$1</span>')
                .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
        }
        if (lang === 'bash' || lang === 'shell') {
            return code
                .replace(/(curl|wget|npm|pip|composer|git|GET|POST|PUT|DELETE)/g, '<span class="text-purple-400">$1</span>')
                .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
                .replace(/(#.*$)/gm, '<span class="text-gray-500">$1</span>');
        }
        if (lang === 'json') {
            return code
                .replace(/(".*?")\s*:/g, '<span class="text-blue-400">$1</span>:')
                .replace(/:\s*(".*?")/g, ': <span class="text-green-400">$1</span>')
                .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>')
                .replace(/:\s*(\d+)/g, ': <span class="text-blue-400">$1</span>');
        }
        return code;
    };

    return (
        <div className="relative bg-muted/50 rounded-lg border border-border overflow-hidden">
            {filename && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">{filename}</span>
                    <span className="text-xs text-muted-foreground uppercase">{language}</span>
                </div>
            )}
            <div className="relative">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-primary/10 z-10"
                >
                    {copied ? (
                        <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </Button>
                <pre className="p-4 overflow-x-auto text-sm">
                    <code
                        className="text-foreground font-mono"
                        dangerouslySetInnerHTML={{
                            __html: highlightCode(code, language)
                        }}
                    />
                </pre>
            </div>
        </div>
    );
}