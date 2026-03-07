'use client';

import { useState, useRef, useEffect } from 'react';
import { chatbotAsk } from '@/lib/api';

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const result = await chatbotAsk(question);
      setAnswer(result?.answer ?? 'Sorry, I don\'t have an answer for that. Try asking about shipping, returns, or order status.');
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-center z-50 hover:bg-gray-800"
        aria-label="Open chat"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white border rounded-lg shadow-xl z-50 flex flex-col max-h-[70vh]">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-semibold">Help</span>
            <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          <div className="p-3 overflow-y-auto flex-1 min-h-[120px]">
            {answer !== null && <p className="text-gray-700 text-sm whitespace-pre-wrap">{answer}</p>}
            {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
          </div>
          <form onSubmit={handleAsk} className="p-3 border-t flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit" disabled={loading} className="px-3 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
