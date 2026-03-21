/* ─── Shared design tokens & utilities ──────────────── */

export const TEAL = '#20e3b2'

export const SUGGESTIONS = [
  'What is quantum computing?',
  'Latest AI news',
  'How does GPT-4 work?',
]

/**
 * Strip malformed markdown artifacts from AI-generated titles
 * before rendering with ReactMarkdown.
 */
export const cleanTitle = (raw) => {
  if (!raw) return 'New Chat'
  return raw
    .replace(/^[\s*#"]+/, '')
    .replace(/[\s*"]+$/, '')
    .trim() || 'New Chat'
}
