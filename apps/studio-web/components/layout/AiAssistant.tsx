"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircleIcon, XIcon, SendIcon, LoaderIcon, BotIcon } from "lucide-react"
import { Streamdown } from "streamdown"
import { cjk } from "@streamdown/cjk"
import "streamdown/styles.css"

interface Message {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    // Abort any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "", isStreaming: true }])

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages.slice(-6) }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error("Assistant error")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split("\n\n")
        buffer = parts.pop() ?? ""

        for (const part of parts) {
          const lines = part.split("\n")
          const eventLine = lines.find((l) => l.startsWith("event: "))
          const dataLine = lines.find((l) => l.startsWith("data: "))

          const eventType = eventLine?.slice(7).trim()

          if (eventType === "done") {
            continue
          }
          if (eventType === "error" && dataLine) {
            try {
              const { error } = JSON.parse(dataLine.slice(6)) as { error: string }
              setMessages((prev) => {
                const next = [...prev]
                const last = next[next.length - 1]
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: last.content || `오류: ${error}`,
                    isStreaming: false,
                  }
                }
                return next
              })
            } catch {}
            continue
          }
          if (eventType === "ping") continue

          // Regular data chunk
          if (dataLine) {
            try {
              const data = JSON.parse(dataLine.slice(6)) as { text?: string }
              if (data.text) {
                setMessages((prev) => {
                  const next = [...prev]
                  const last = next[next.length - 1]
                  if (last?.role === "assistant") {
                    next[next.length - 1] = { ...last, content: last.content + data.text }
                  }
                  return next
                })
              }
            } catch {}
          }
        }
      }

      // Mark streaming done
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === "assistant") {
          next[next.length - 1] = { ...last, isStreaming: false }
        }
        return next
      })
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === "assistant") {
          next[next.length - 1] = {
            ...last,
            content: last.content || "죄송합니다, 응답을 생성하지 못했습니다.",
            isStreaming: false,
          }
        }
        return next
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          setOpen((v) => {
            if (v) abortRef.current?.abort()
            return !v
          })
        }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="AI 도우미"
      >
        {open ? <XIcon className="size-5" /> : <MessageCircleIcon className="size-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] h-[520px] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <BotIcon className="size-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">AI 도우미</span>
            <span className="text-[10px] text-muted-foreground ml-auto">게임 업계 전문가</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BotIcon className="size-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">무엇이든 물어보세요</p>
                <p className="text-xs text-muted-foreground">
                  게임 업계 용어, 트렌드, 시장 분석 등
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                  {["CPI가 뭔가요?", "방치형 게임 코어 루프", "ARPU vs LTV 차이"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q)
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[80%] rounded-xl rounded-br-sm px-3.5 py-2.5 text-sm leading-relaxed bg-primary text-primary-foreground shadow-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[85%] rounded-xl rounded-bl-sm px-3.5 py-2.5 bg-card border border-border shadow-sm overflow-hidden">
                    {msg.content ? (
                      <div className="text-sm [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0 [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_code]:break-all [&_a]:break-all">
                        <Streamdown
                          plugins={{ cjk }}
                          isAnimating={msg.isStreaming}
                          animated={{ animation: "fadeIn", duration: 200 }}
                          caret={msg.isStreaming ? "block" : undefined}
                          mode={msg.isStreaming ? "streaming" : "static"}
                        >
                          {msg.content}
                        </Streamdown>
                      </div>
                    ) : (
                      <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void handleSend()}
                placeholder="질문을 입력하세요..."
                className="flex-1 h-10 rounded-xl border border-border bg-card px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => void handleSend()}
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:shadow-md hover:brightness-110 transition-all disabled:opacity-50"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
