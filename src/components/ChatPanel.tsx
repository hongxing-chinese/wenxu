/**
 * AI 对话面板组件
 * 支持云端代理和本地直连两种模式，流式输出
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { chatApi } from '@/lib/api-client';
import { streamLocalLLM, loadLocalLLMConfig } from '@/lib/local-llm-config';
import { MessageMarkdown } from '@/components/MessageMarkdown';

export type ChatMode = 'cloud' | 'local';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPanel(props: {
  systemPrompt: string;
  defaultQuestion: string;
  mode: ChatMode;
  onConfigRequest: () => void;
  initialPrompt?: string;
  initialDisplay?: string;
  autoSend?: string;
  pendingSend?: string;
}) {
  const { systemPrompt, defaultQuestion, mode, onConfigRequest, initialPrompt, initialDisplay, autoSend, pendingSend } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(defaultQuestion);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(false);
  const initialPromptSentRef = useRef(false);
  const prevAutoSendRef = useRef<string | undefined>(undefined);
  const prevPendingSendRef = useRef<string | undefined>(undefined);

  // 核心发送函数：将指定问题发送给 AI（可自定义显示文本）
  const sendQuestionWithDisplay = useCallback(async (question: string, displayText?: string) => {
    if (!question.trim() || isStreaming) return;

    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: displayText ?? question }]);
    setInput('');
    setIsStreaming(true);
    setIsWaiting(true);
    abortRef.current = false;

    let assistantContent = '';

    try {
      const generator =
        mode === 'local'
          ? streamLocalLLM(systemPrompt, question, loadLocalLLMConfig())
          : chatApi.streamCompletion(systemPrompt, question);

      for await (const chunk of generator) {
        if (abortRef.current) break;
        if (assistantContent === '') setIsWaiting(false);
        assistantContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: assistantContent };
          } else {
            updated.push({ role: 'assistant', content: assistantContent });
          }
          return updated;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '请求失败';
      if (msg.includes('额度已用完') || msg.includes('RATE_LIMITED')) {
        setError('今日免费额度已用完，请配置本地模型继续使用');
      } else {
        setError(msg);
      }
    } finally {
      setIsStreaming(false);
      setIsWaiting(false);
    }
  }, [isStreaming, mode, systemPrompt]);

  // 简化版发送函数（显示文本与发送文本相同）
  const sendQuestion = useCallback(async (question: string) => {
    return sendQuestionWithDisplay(question);
  }, [sendQuestionWithDisplay]);

  // initialPrompt：首次进入时自动发送（占卜模式）
  useEffect(() => {
    if (!initialPrompt || initialPromptSentRef.current || !systemPrompt) {
      return;
    }
    initialPromptSentRef.current = true;
    void sendQuestionWithDisplay(initialPrompt, initialDisplay);
  }, [initialPrompt, initialDisplay, systemPrompt, sendQuestionWithDisplay]);

  // autoSend：左侧选择预设问题时自动发送
  useEffect(() => {
    if (!autoSend || autoSend === prevAutoSendRef.current || !systemPrompt) {
      prevAutoSendRef.current = autoSend;
      return;
    }
    prevAutoSendRef.current = autoSend;
    void sendQuestion(autoSend);
  }, [autoSend, systemPrompt, sendQuestion]);

  // pendingSend：问题灵感选中等一次性触发的发送
  useEffect(() => {
    if (!pendingSend || pendingSend === prevPendingSendRef.current || !systemPrompt) {
      prevPendingSendRef.current = pendingSend;
      return;
    }
    prevPendingSendRef.current = pendingSend;
    void sendQuestion(pendingSend);
  }, [pendingSend, systemPrompt, sendQuestion]);

  // 手动发送：用户在输入框输入后点击发送
  const handleSend = useCallback(() => {
    void sendQuestion(input);
  }, [input, sendQuestion]);

  function handleStop() {
    abortRef.current = true;
    setIsStreaming(false);
    setIsWaiting(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendQuestion(input);
    }
  }

  const isRateLimited = error.includes('额度已用完') || error.includes('RATE_LIMITED');

  return (
    <section className="panel chat-panel">
      <div className="panel-head">
        <h2>AI 解读</h2>
        <div className="chat-mode-actions">
          {mode === 'local' ? (
            <button type="button" className="chat-config-btn" onClick={onConfigRequest}>
              本地模型设置
            </button>
          ) : (
            <span className="chat-mode-badge">云端模式</span>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>基于排盘结果，向 AI 提问获取解读。</p>
            {mode === 'local' && <p className="chat-empty-hint">当前使用本地模型直连，提示词不会上传云端。</p>}
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message chat-message-${msg.role}`}>
            <div className="chat-message-role">{msg.role === 'user' ? '你' : 'AI'}</div>
            <div className="chat-message-content">
              {msg.role === 'assistant' ? (
                <>
                  <MessageMarkdown content={msg.content} />
                  {isStreaming && index === messages.length - 1 && <span className="chat-cursor" />}
                </>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isWaiting && (
          <div className="chat-message chat-message-assistant">
            <div className="chat-message-role">AI</div>
            <div className="chat-thinking">
              <span className="chat-thinking-dot" />
              <span className="chat-thinking-dot" />
              <span className="chat-thinking-dot" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="chat-error">
          {error}
          {isRateLimited && (
            <button type="button" className="chat-rate-limit-config-btn" onClick={onConfigRequest}>
              配置本地模型
            </button>
          )}
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          value={input}
          placeholder="输入你的问题..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <div className="chat-input-actions">
          {isStreaming ? (
            <button type="button" className="chat-send-btn chat-stop-btn" onClick={handleStop}>
              停止
            </button>
          ) : (
            <button
              type="button"
              className="chat-send-btn"
              disabled={!input.trim()}
              onClick={handleSend}
            >
              发送
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
