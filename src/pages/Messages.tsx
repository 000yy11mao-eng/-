import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Send, Smile, Paperclip, Reply } from 'lucide-react';

export default function Messages() {
  const { t, language } = useAppContext();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Administration', text: 'Please ensure all grades for Period 1 are entered.', time: '10:00 AM' },
    { id: 2, sender: 'Mr. Bahaa', text: 'Substitute requested for class 3/B today.', time: '09:15 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: user?.name || 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[600px] flex flex-col">
      <h2 className="text-lg font-bold mb-4">{t('messages') || 'الرسائل'}</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className="flex flex-col">
            <div className={`p-4 rounded-xl max-w-md ${m.sender === (user?.name || 'Me') ? 'bg-emerald-600 text-white self-end rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 self-start rounded-bl-none'}`}>
              <div className="flex justify-between items-center mb-1 text-xs opacity-75">
                <span className="font-bold">{m.sender}</span>
                <span>{m.time}</span>
              </div>
              <p>{m.text}</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100"><Smile className="w-3 h-3"/> 👍</button>
                <button className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100"><Reply className="w-3 h-3"/> رد</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 items-center border-t border-slate-200 dark:border-slate-700 pt-4">
        <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder={language === 'ar' ? "اكتب رسالة..." : "Type a message..."}
          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
          <Send className="w-5 h-5 rtl:scale-x-[-1]" />
        </button>
      </form>
    </div>
  );
}
