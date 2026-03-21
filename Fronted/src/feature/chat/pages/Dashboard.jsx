import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hook/use.chat'
import { setCurrentChat } from '../chat.slice'

/* ─── Extracted components ──────────────────────────── */
import { TEAL, cleanTitle } from '../components/constants'
import { BoltIcon, MenuIcon, Spinner } from '../components/Icons'
import Sidebar from '../components/Sidebar'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import EmptyState from '../components/EmptyState'

/* ─── Main component ─────────────────────────────────── */
const Dashboard = () => {
  // ── Redux state ──────────────────────────────────────
  const { user } = useSelector((state) => state.auth)
  const { chats, currentChat, isLoading: chatLoading } = useSelector((state) => state.chat)

  const chatList = Object.values(chats)
  const activeMessages = currentChat ? (chats[currentChat]?.messages ?? []) : []

  // ── Hook (call once only) ────────────────────────────
  const { initializeSocketConnection, handleSendMessage, handleGetChats, handleSelectChat } = useChat()
  const dispatch = useDispatch()

  // ── Local UI state ───────────────────────────────────
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // ── Effects ──────────────────────────────────────────
  useEffect(() => {
    initializeSocketConnection()
    handleGetChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [input])

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setSidebarOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // ── Handlers ─────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim()
    if (!text || chatLoading) return
    setInput('')
    await handleSendMessage({ message: text, chatId: currentChat })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => { dispatch(setCurrentChat(null)) }

  // ── Render ───────────────────────────────────────────
  return (
    <div
      className="h-screen w-full flex overflow-hidden relative"
      style={{ background: '#0c0c0f', fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ── Mobile backdrop ─────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Desktop sidebar ────────────────────────────── */}
      <div
        className="hidden md:flex shrink-0 h-full"
        style={{ borderRight: '1px solid #27272a', width: '256px' }}
      >
        <Sidebar
          user={user}
          activeChat={currentChat}
          setActiveChat={handleSelectChat}
          onNewChat={handleNewChat}
          onClose={() => setSidebarOpen(false)}
          isMobile={false}
          chatList={chatList}
        />
      </div>

      {/* ── Mobile sidebar drawer ──────────────────────── */}
      <div
        className="fixed top-0 left-0 h-full z-40 md:hidden transition-transform duration-300 ease-in-out"
        style={{
          width: '256px',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid #27272a',
        }}
      >
        <Sidebar
          user={user}
          activeChat={currentChat}
          setActiveChat={handleSelectChat}
          onNewChat={handleNewChat}
          onClose={() => setSidebarOpen(false)}
          isMobile={true}
          chatList={chatList}
        />
      </div>

      {/* ── Main panel ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0 gap-3"
          style={{ borderBottom: '1px solid #27272a', background: '#0c0c0f' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-colors"
              style={{ background: '#1e1e22', border: '1px solid #3f3f46', color: '#a1a1aa' }}
              onClick={() => setSidebarOpen(true)}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#a1a1aa'}
            >
              <MenuIcon />
            </button>
            <div className="min-w-0">
              <h1
                className="text-sm sm:text-base font-semibold text-white truncate"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {currentChat ? (
                  <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
                    {cleanTitle(chats[currentChat]?.title)}
                  </ReactMarkdown>
                ) : 'New Conversation'}
              </h1>
              <p className="text-[11px] text-zinc-600 mt-0.5 hidden sm:block">Powered by live web search</p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0"
            style={{ background: '#1e1e22', border: '1px solid #3f3f46', color: '#a1a1aa' }}
          >
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TEAL, boxShadow: `0 0 5px ${TEAL}` }} />
            <span className="hidden sm:inline">Perplexity</span> Pro
          </div>
        </header>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 sm:py-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}
        >
          {activeMessages.length === 0 && !chatLoading && (
            <EmptyState onSuggestionClick={setInput} />
          )}

          <div className="space-y-5 max-w-3xl mx-auto">
            {activeMessages.map((msg, idx) => (
              <ChatMessage key={msg._id || idx} msg={msg} user={user} />
            ))}

            {/* Typing indicator */}
            {chatLoading && (
              <div className="flex gap-3 justify-start">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}30` }}
                >
                  <BoltIcon size={4} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e1e24 0%, #18181c 100%)', border: '1px solid #2e2e34' }}
                >
                  <p className="text-[10px] font-semibold mb-2 uppercase tracking-wider" style={{ color: TEAL }}>Perplexity</p>
                  <div className="flex items-center gap-2" style={{ color: '#71717a' }}>
                    <Spinner />
                    <span>Searching the web…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          focused={focused}
          setFocused={setFocused}
          chatLoading={chatLoading}
          textareaRef={textareaRef}
        />
      </main>
    </div>
  )
}

export default Dashboard
