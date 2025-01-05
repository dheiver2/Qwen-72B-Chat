import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, User, Bot } from 'lucide-react';

const QwenChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/qwen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userMessage,
          api_name: '/on_example'
        }),
      });

      if (!response.ok) throw new Error('Falha na comunicação com a API');
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Erro: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
            ${isUser ? 'bg-blue-600' : isError ? 'bg-red-600' : 'bg-green-600'}`}>
            {isUser ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <Bot className="h-5 w-5 text-white" />
            )}
          </div>
          <div className={`rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : isError 
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            <pre className="whitespace-pre-wrap font-sans">
              {message.content}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold text-center">Qwen-72B Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Inicie uma conversa enviando uma mensagem...
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))
          )}
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 min-h-[50px] max-h-[200px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="h-[50px] px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QwenChat;
