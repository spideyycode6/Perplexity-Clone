import React from 'react'
import { TEAL, SUGGESTIONS } from './constants'
import { BoltIcon } from './Icons'

const EmptyState = ({ onSuggestionClick }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-5 px-4">
    {/* Icon with glow ring */}
    <div className="relative">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle, ${TEAL}30 0%, transparent 70%)`,
          filter: 'blur(18px)',
          transform: 'scale(1.4)',
        }}
      />
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30` }}
      >
        <BoltIcon size={8} />
      </div>
    </div>

    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
        Ask me anything
      </h2>
      <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
        I'll search the web in real-time and give you accurate, up-to-date answers.
      </p>
    </div>

    {/* Suggestions */}
    <div className="flex flex-wrap justify-center gap-2 max-w-md">
      {SUGGESTIONS.map(q => (
        <button
          key={q}
          onClick={() => onSuggestionClick(q)}
          className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-95"
          style={{ background: '#1e1e22', border: '1px solid #3f3f46', color: '#a1a1aa' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${TEAL}50`; e.currentTarget.style.color = TEAL }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#a1a1aa' }}
        >
          {q}
        </button>
      ))}
    </div>
  </div>
)

export default EmptyState
