import React, { useState, useEffect, useRef } from 'react';
import { getChatSocket } from '../services/socket';
import { chatAPI } from '../services/api';
import { Send, MessageSquare, User, Clock, CheckCheck, Loader2 } from 'lucide-react';

export default function InAppChat({ bookingId, currentUser, receiver }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await chatAPI.getBookingMessages(bookingId);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      }
    }

    if (bookingId) {
      loadMessages();
    }

    const socket = getChatSocket();
    socket.emit('join_chat', { bookingId });

    const onReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onUserTyping = (data) => {
      if (data.isTyping) {
        setTypingUser(data.userName);
      } else {
        setTypingUser('');
      }
    };

    socket.on('receive_message', onReceiveMessage);
    socket.on('user_typing', onUserTyping);

    return () => {
      socket.off('receive_message', onReceiveMessage);
      socket.off('user_typing', onUserTyping);
    };
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentUserId = currentUser?._id || currentUser?.id || 'cust_1';
    const receiverId = receiver?._id || receiver?.id || 'prov_1';
    const text = inputText.trim();
    setInputText('');

    const socket = getChatSocket();
    socket.emit('send_message', {
      bookingId,
      senderId: currentUserId,
      receiverId,
      text,
    });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    const socket = getChatSocket();
    socket.emit('typing', {
      bookingId,
      isTyping: e.target.value.length > 0,
      userName: currentUser?.name || 'User',
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[500px] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-base">
            {receiver?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-100">{receiver?.name || 'Service Partner'}</h4>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Job Support Chat
            </span>
          </div>
        </div>

        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((msg, index) => {
          const isMe = (msg.sender?._id || msg.sender?.id || msg.sender) === (currentUser?._id || currentUser?.id);
          return (
            <div
              key={msg._id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1 text-right font-medium ${
                    isMe ? 'text-emerald-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        {typingUser && (
          <div className="text-xs text-gray-400 italic flex items-center gap-1.5 pl-2">
            <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type message to provider..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center transition disabled:opacity-40 shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
