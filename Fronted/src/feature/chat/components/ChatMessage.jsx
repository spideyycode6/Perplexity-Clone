import React from 'react'
import ReactMarkdown from 'react-markdown'
import { TEAL } from './constants'
import { BoltIcon } from './Icons'

/** Markdown component overrides for AI chat messages */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-lg font-bold text-white mb-2 mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-white mb-1.5 mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mb-1 mt-1" style={{ color: TEAL }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-zinc-300 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-2 text-sm text-zinc-300 pl-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-2 text-sm text-zinc-300 pl-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code
        className="px-1.5 py-0.5 rounded text-xs font-mono"
        style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}25` }}
      >
        {children}
      </code>
    ) : (
      <code className="block text-xs font-mono text-zinc-300 leading-relaxed">{children}</code>
    ),
  pre: ({ children }) => (
    <pre
      className="rounded-xl px-4 py-3 my-2 text-xs font-mono overflow-x-auto"
      style={{ background: '#0c0c0f', border: '1px solid #2e2e34' }}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="pl-3 my-2 text-sm text-zinc-400 italic"
      style={{ borderLeft: `3px solid ${TEAL}` }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 transition-colors"
      style={{ color: TEAL }}
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-3" style={{ borderColor: '#2e2e34' }} />
  ),
}

const ChatMessage = ({ msg, user }) => (
  <div
    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    {/* AI avatar */}
    {msg.role === 'ai' && (
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}30` }}
      >
        <BoltIcon size={4} />
      </div>
    )}

    <div
      className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'whitespace-pre-wrap break-words rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-tl-sm'
        }`}
      style={
        msg.role === 'user'
          ? {
            background: `linear-gradient(135deg, ${TEAL}22 0%, ${TEAL}10 100%)`,
            border: `1px solid ${TEAL}35`,
            color: '#e4e4e7',
            boxShadow: `0 2px 12px ${TEAL}10`,
          }
          : {
            background: 'linear-gradient(135deg, #1e1e24 0%, #18181c 100%)',
            border: '1px solid #2e2e34',
            color: '#d4d4d8',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }
      }
    >
      {/* Role label */}
      {msg.role === 'user' && (
        <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: TEAL }}>
          You
        </p>
      )}
      {msg.role === 'ai' && (
        <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: TEAL }}>
          Perplexity
        </p>
      )}

      {/* Content */}
      {msg.role === 'user'
        ? (msg.content || msg.text)
        : (
          <ReactMarkdown components={markdownComponents}>
            {msg.content || msg.text || ''}
          </ReactMarkdown>
        )
      }
    </div>

    {/* User avatar */}
    {msg.role === 'user' && user && (
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={{ background: `${TEAL}25`, color: TEAL, border: `1px solid ${TEAL}40` }}
      >
        {(user.username || user.email || 'U')[0].toUpperCase()}
      </div>
    )}
  </div>
)

export default ChatMessage
