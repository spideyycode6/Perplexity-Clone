import React from 'react'
import { TEAL } from './constants'
import { SendIcon, Spinner } from './Icons'

const ChatInput = ({ input, setInput, onSend, onKeyDown, focused, setFocused, chatLoading, textareaRef }) => (
  <div
    className="shrink-0 px-3 sm:px-6 pb-4 sm:pb-6 pt-3"
    style={{ background: '#0c0c0f' }}
  >
    <div className="max-w-3xl mx-auto">
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
        style={{
          background: '#18181b',
          border: `1px solid ${focused ? TEAL : '#3f3f46'}`,
          boxShadow: focused ? `0 0 0 3px ${TEAL}18, 0 4px 24px rgba(0,0,0,0.3)` : '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything…"
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 resize-none outline-none leading-relaxed"
          style={{ maxHeight: '140px', overflowY: 'auto' }}
        />
        <button
          id="send-btn"
          onClick={onSend}
          disabled={!input.trim() || chatLoading}
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: input.trim() && !chatLoading
              ? `linear-gradient(135deg, ${TEAL} 0%, #16c99e 100%)`
              : '#27272a',
            color: input.trim() && !chatLoading ? '#051a14' : '#52525b',
            boxShadow: input.trim() && !chatLoading ? `0 4px 16px ${TEAL}35` : 'none',
          }}
        >
          {chatLoading ? <Spinner /> : <SendIcon />}
        </button>
      </div>
      <p className="text-center text-[11px] text-zinc-700 mt-2">
        Perplexity searches the live web — answers may vary.
      </p>
    </div>
  </div>
)

export default ChatInput
