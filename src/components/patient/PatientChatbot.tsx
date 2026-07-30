import React, { useState, useRef, useEffect } from 'react';
import { genAI } from '../../lib/gemma';
import { Bot, User, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PatientChatbotProps {
  patientId: string;
}

export default function PatientChatbot({ patientId }: PatientChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am your NHV Health Assistant. I can securely answer questions based *only* on your medical record (like your active medications, past visits, or allergies). How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // 1. Fetch Patient Record for Context (RAG)
      const [patientRes, medsRes, visitsRes] = await Promise.all([
        supabase.from('patients').select('blood_group, allergies, date_of_birth, gender').eq('id', patientId).single(),
        supabase.from('medications').select('name, dosage, frequency, start_date, status').eq('patient_id', patientId),
        supabase.from('visits').select('diagnosis, visit_date, hospital_name, notes').eq('patient_id', patientId).order('visit_date', { ascending: false }).limit(5)
      ]);

      const contextData = {
        demographics: patientRes.data,
        medications: medsRes.data,
        recentVisits: visitsRes.data
      };

      // 2. Prepare Gemma System Instructions
      const systemInstruction = `You are a helpful assistant that answers a patient's questions about their own medical record using ONLY the data provided below. Do not give medical advice, diagnoses, or general health information beyond what is in the record. If the answer isn't in the provided data, say so and recommend the patient consult their doctor. Keep answers concise, clear, and reassuring.

      Patient record data (JSON):
      ${JSON.stringify(contextData, null, 2)}`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        systemInstruction: systemInstruction
      });

      // 3. Prepare chat history (exclude the first hardcoded greeting to avoid API validation errors)
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // We need to start a chat session to maintain conversation flow
      const chat = model.startChat({ history });

      const result = await chat.sendMessage(userMessage);
      const botResponse = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: botResponse }]);

    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting to your health records right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-nhv-blue text-white rounded-full shadow-xl hover:bg-blue-700 transition-transform hover:scale-105 z-50 flex items-center justify-center animate-bounce"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden h-[500px] animate-fade-in">
          {/* Header */}
          <div className="bg-nhv-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm">GEMMA Health Assistant</h3>
                <p className="text-[10px] text-blue-200">Powered by Gemma 4</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-nhv-blue'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-nhv-blue text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 flex-row">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-nhv-blue flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-nhv-blue animate-spin" />
                    <span className="text-xs text-slate-400">Searching your records...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your health record..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nhv-blue/50 text-sm text-slate-900 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1.5 p-2 bg-nhv-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
