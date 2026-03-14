import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAppContext } from '../lib/AppContext';
import { cn } from '../lib/utils';

export function MessagesPage() {
  const { currentUser, users, messages, sendMessage } = useAppContext();
  const [activeUserId, setActiveUserId] = useState(currentUser.friends[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeUserId]);

  const activeUser = users.find(u => u.id === activeUserId);
  const activeMessages = activeUserId ? (messages[activeUserId] || []) : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId) return;
    sendMessage(activeUserId, newMessage);
    setNewMessage('');
  };

  // Get friends to show in sidebar
  const friendList = users.filter(u => currentUser.friends.includes(u.id));

  return (
    <div className="p-8 max-w-5xl mx-auto w-full h-[calc(100vh-2rem)] flex flex-col pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Messages</h1>
        <p className="text-zinc-400 text-sm">Chat with your learning buddies.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 flex-1 flex overflow-hidden min-h-[500px]">
        {/* Left Sidebar - Conversation List */}
        <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/50">
          <div className="p-4 border-b border-zinc-800 font-semibold text-white">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto">
            {friendList.map(friend => {
              const isActive = friend.id === activeUserId;
              const lastMsg = messages[friend.id]?.[messages[friend.id].length - 1];
              
              return (
                <button
                  key={friend.id}
                  onClick={() => setActiveUserId(friend.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-zinc-800/50 border-b border-zinc-800/50",
                    isActive && "bg-zinc-800"
                  )}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold">
                      {friend.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-sm font-medium text-white truncate">{friend.username}</h3>
                      {lastMsg && (
                        <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                          {format(new Date(lastMsg.timestamp), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {lastMsg ? lastMsg.content : "Start a conversation..."}
                    </p>
                  </div>
                </button>
              )
            })}
            {friendList.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No friends yet. Add some from the community!
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Chat Window */}
        {activeUser ? (
          <div className="flex-1 flex flex-col bg-[#0a0a0c]">
            {/* Chat header */}
            <div className="h-16 border-b border-zinc-800 flex items-center px-6 gap-3 bg-zinc-900/50">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm">
                {activeUser.avatar}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">{activeUser.username}</h2>
                <p className="text-[11px] text-zinc-400">Level {Math.floor(activeUser.xp / 1000) + 1} Learner</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3">
                  <UserIcon className="w-12 h-12 text-zinc-700" />
                  <p>Send a message to start chatting with {activeUser.username}</p>
                </div>
              ) : (
                activeMessages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                      <div 
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                          isMe 
                            ? "bg-blue-600 text-white rounded-br-sm" 
                            : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-zinc-500 px-1">
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${activeUser.username}...`}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-3">
            <MessageSquare className="w-12 h-12 text-zinc-800" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
