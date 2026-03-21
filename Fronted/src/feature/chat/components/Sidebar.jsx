import React from 'react'
import ReactMarkdown from 'react-markdown'
import { TEAL, cleanTitle } from './constants'
import { BoltIcon, PlusIcon, ChatIcon, CloseIcon } from './Icons'

const Sidebar = ({ user, activeChat, setActiveChat, onNewChat, onClose, isMobile, chatList }) => (
  <aside
    className="flex flex-col h-full w-64"
    style={{ background: '#0f0f12', fontFamily: "'DM Sans', sans-serif" }}
  >
    {/* Logo row */}
    <div className="flex items-center justify-between px-5 py-5 shrink-0">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}40` }}
        >
          <BoltIcon size={4} />
        </div>
        <span className="font-bold text-white text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Perplexity
        </span>
      </div>
      {/* Mobile close button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 transition-colors"
          style={{ background: '#1e1e22' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#a1a1aa'}
        >
          <CloseIcon />
        </button>
      )}
    </div>

    {/* New chat */}
    <div className="px-3 mb-4 shrink-0">
      <button
        onClick={() => { onNewChat(); if (isMobile) onClose() }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]"
        style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL }}
        onMouseEnter={e => e.currentTarget.style.background = `${TEAL}25`}
        onMouseLeave={e => e.currentTarget.style.background = `${TEAL}15`}
      >
        <PlusIcon /> New Chat
      </button>
    </div>

    {/* Section label */}
    <div className="px-5 mb-2 shrink-0">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Recent</p>
    </div>

    {/* Chat list */}
    <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-2">
      {chatList.length === 0 && (
        <p className="text-xs text-zinc-700 px- 3 py-2 italic">No chats yet — start one!</p>
      )}
      {chatList.map(chat => (
        <button
          key={chat._id}
          onClick={() => { setActiveChat(chat._id); if (isMobile) onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150"
          style={{
            background: activeChat === chat._id ? `${TEAL}12` : 'transparent',
            border: `1px solid ${activeChat === chat._id ? `${TEAL}25` : 'transparent'}`,
            color: activeChat === chat._id ? '#e4e4e7' : '#71717a',
          }}
          onMouseEnter={e => {
            if (activeChat !== chat._id) {
              e.currentTarget.style.background = '#1e1e22'
              e.currentTarget.style.color = '#a1a1aa'
            }
          }}
          onMouseLeave={e => {
            if (activeChat !== chat._id) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#71717a'
            }
          }}
        >
          <span style={{ color: activeChat === chat._id ? TEAL : '#52525b' }}>
            <ChatIcon />
          </span>
          <span className="truncate">
            <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
              {cleanTitle(chat.title)}
            </ReactMarkdown>
          </span>
        </button>
      ))}
    </div>

    {/* User footer */}
    {user && (
      <div className="px-4 py-4 shrink-0" style={{ borderTop: '1px solid #1e1e22' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: `${TEAL}25`, color: TEAL, border: `1px solid ${TEAL}40` }}
          >
            {(user.username || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-300 truncate">{user.username || user.email || 'User'}</p>
            <p className="text-xs text-zinc-600 truncate">{user.email || ''}</p>
          </div>
        </div>
      </div>
    )}
  </aside>
)

export default Sidebar
