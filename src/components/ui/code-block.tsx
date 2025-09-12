"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
    code: string;
    language: string;
    filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState(code);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    useEffect(() => {
        // Enhanced manual highlighting with better patterns
        setHighlightedCode(highlightCode(code, language));
    }, [code, language]);

    // Enhanced syntax highlighting with proper escaping
    const highlightCode = (code: string, lang: string): string => {
        // First escape HTML entities to prevent conflicts
        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        if (lang === 'javascript' || lang === 'js') {
            highlighted = highlighted
                // Comments first (to avoid conflicts)
                .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
                .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')
                // Strings (avoiding already highlighted content)
                .replace(/(?<!<[^>]*)(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>')
                // Keywords
                .replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|async|await|import|export|from|class|extends|new|this|super|static|public|private|protected|interface|type|enum|namespace)\b(?![^<]*>)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                // Numbers
                .replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="text-blue-400">$1</span>');
        }
        else if (lang === 'python') {
            highlighted = highlighted
                // Comments first
                .replace(/(#.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
                // Strings
                .replace(/(?<!<[^>]*)(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>')
                .replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, '<span class="text-green-400">$1</span>')
                // Keywords
                .replace(/\b(def|class|import|from|return|if|else|elif|for|while|try|except|async|await|with|as|in|and|or|not|is|lambda|yield|break|continue|pass|global|nonlocal)\b(?![^<]*>)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                // Numbers
                .replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="text-blue-400">$1</span>');
        }
        else if (lang === 'php') {
            highlighted = highlighted
                // Comments first
                .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
                .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')
                // PHP tags
                .replace(/(&lt;\?php|\?&gt;)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                // Strings
                .replace(/(?<!<[^>]*)(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>')
                // Variables
                .replace(/(\$\w+)(?![^<]*>)/g, '<span class="text-blue-300">$1</span>')
                // Keywords
                .replace(/\b(function|return|if|else|elseif|for|while|try|catch|class|public|private|protected|static|final|abstract|interface|extends|implements|namespace|use|require|include|echo|print)\b(?![^<]*>)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                // Numbers
                .replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="text-blue-400">$1</span>');
        }
        else if (lang === 'bash' || lang === 'shell') {
            highlighted = highlighted
                // Comments first
                .replace(/(#.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
                // Strings
                .replace(/(?<!<[^>]*)(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>')
                // URLs
                .replace(/(https?:\/\/[^\s]+)(?![^<]*>)/g, '<span class="text-blue-300 underline">$1</span>')
                // HTTP methods
                .replace(/\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\b(?![^<]*>)/g, '<span class="text-orange-400 font-semibold">$1</span>')
                // Commands
                .replace(/\b(curl|wget|npm|pip|composer|git|docker|kubectl|ssh|scp|rsync|grep|awk|sed|find|ls|cd|mkdir|rm|cp|mv|chmod|chown|sudo|su|cat|echo|which|whereis|man|ps|kill|top|htop|df|du|mount|umount|tar|zip|unzip|gzip|gunzip)\b(?![^<]*>)/g, '<span class="text-purple-400 font-semibold">$1</span>')
                // Flags
                .replace(/(--?\w+)(?![^<]*>)/g, '<span class="text-blue-400">$1</span>');
        }
        else if (lang === 'json') {
            highlighted = highlighted
                // String values first
                .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="text-green-400">$1</span>')
                // Property names
                .replace(/("[\w-]+")(\s*:)/g, '<span class="text-blue-400 font-semibold">$1</span>$2')
                // Boolean and null values
                .replace(/:\s*\b(true|false|null)\b(?![^<]*>)/g, ': <span class="text-purple-400 font-semibold">$1</span>')
                // Numbers
                .replace(/:\s*(\d+\.?\d*)(?![^<]*>)/g, ': <span class="text-blue-400">$1</span>')
                // Brackets and braces
                .replace(/([{}[\],])/g, '<span class="text-gray-300 font-semibold">$1</span>');
        }

        return highlighted;
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
                        className="text-foreground font-mono leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: highlightedCode
                        }}
                    />
                </pre>
            </div>
        </div>
    );
}