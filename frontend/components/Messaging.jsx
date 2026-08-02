import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { UserRole } from '../types';
import { Search, MessageCircle, Send, ArrowLeft, MoreVertical, UserCircle, X, CheckCheck, Paperclip, ExternalLink, Download, Shield } from 'lucide-react';
import { Profile } from './Profile';
import { SearchInput } from './SearchInput';
import { fetchAllUsers, fetchMessages, sendMessage, fetchConversations, markConversationRead } from '../services/api';

// Mock Directory Data (Fallback)
const MOCK_DIRECTORY = [
  {
    id: 'd1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: UserRole.GRADUATE,
    title: 'Product Manager',
    company: 'TechCorp',
    avatar: 'https://picsum.photos/id/64/100/100',
    university: 'State University',
    bio: 'Experienced PM with a background in CS.',
    skills: ['Product Management', 'Agile', 'Roadmapping']
  },
  {
    id: 'd2',
    name: 'David Chen',
    email: 'david@example.com',
    role: UserRole.GRADUATE,
    title: 'Senior Engineer',
    company: 'StartupX',
    avatar: 'https://picsum.photos/id/91/100/100',
    university: 'State University',
    bio: 'Full stack engineer loving React and Node.',
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: 's1',
    name: 'Alex Johnson',
    email: 'alex@edu.com',
    role: UserRole.UNDERGRADUATE,
    title: 'Computer Science Student',
    avatar: 'https://picsum.photos/200/200?random=1',
    university: 'State University',
    yearOfStudy: 3,
    interests: ['AI', 'Web Dev']
  }
];

export const Messaging = ({ currentUser, initialSelectedUser }) => {
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // MESSAGES STATE (Backend)
  const [messages, setMessages] = useState([]);
  const [directory, setDirectory] = useState([]);
  // Conversations with unread status from backend
  const [conversations, setConversations] = useState([]);

  // Feature States
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Directory and Conversations on Mount
  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const users = await fetchAllUsers();
        // Filter out current user from directory
        const others = users.filter((u) => u.id !== currentUser.id && u._id !== currentUser.id);
        setDirectory(others);
      } catch (error) {
        console.error("Failed to load directory", error);
        setDirectory(MOCK_DIRECTORY); // Fallback
      }
    };
    const loadConversations = async () => {
      try {
        const convos = await fetchConversations();
        setConversations(convos);
      } catch (error) {
        console.error("Failed to load conversations", error);
      }
    };
    loadDirectory();
    loadConversations();
  }, [currentUser.id]);

  // Fetch Messages when a user is selected (and poll for new ones)
  // Also re-fetch conversations on the same interval so the list re-sorts live
  useEffect(() => {
    let intervalId;

    const loadMessages = async () => {
      if (!selectedUser) return;
      try {
        const msgs = await fetchMessages(currentUser.id || currentUser._id, selectedUser.id || selectedUser._id);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    const loadConversationsLive = async () => {
      try {
        const convos = await fetchConversations();
        setConversations(convos);
      } catch (_) {}
    };

    if (selectedUser) {
      loadMessages(); // Initial load
      intervalId = setInterval(async () => {
        await loadMessages();
        await loadConversationsLive(); // Re-sort list as new messages arrive
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [selectedUser, currentUser.id]);

  // Handler: select user, mark as read, clear unread badge
  const handleSelectUser = useCallback(async (user) => {
    setSelectedUser(user);
    const otherId = user.id || user._id;
    // Optimistically clear unread badge in UI
    setConversations(prev => prev.map(c => {
      const cId = c.user?.id || c.user?._id;
      return cId === otherId ? { ...c, hasUnread: false, unreadCount: 0 } : c;
    }));
    // Persist to backend
    try { await markConversationRead(otherId); } catch (_) {}
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedUser) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser]);

  const isStudent = currentUser.role === UserRole.UNDERGRADUATE;

  // Filtered Directory based on search, sorted by most recent conversation activity
  const filteredDirectory = useMemo(() => {
    const matched = directory.filter(u =>
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // Build a lookup: userId -> lastMessage timestamp from conversations data
    const recentActivity = {};
    for (const convo of conversations) {
      const cId = convo.user?.id || convo.user?._id;
      if (cId && convo.lastMessage?.createdAt) {
        recentActivity[cId] = new Date(convo.lastMessage.createdAt).getTime();
      }
    }

    // Sort: unread first, then by most recent message, then alphabetically
    return [...matched].sort((a, b) => {
      const aId = a.id || a._id;
      const bId = b.id || b._id;
      const aConvo = conversations.find(c => (c.user?.id || c.user?._id) === aId);
      const bConvo = conversations.find(c => (c.user?.id || c.user?._id) === bId);

      const aUnread = aConvo?.hasUnread ? 1 : 0;
      const bUnread = bConvo?.hasUnread ? 1 : 0;
      if (bUnread !== aUnread) return bUnread - aUnread; // Unread first

      const aTime = recentActivity[aId] || 0;
      const bTime = recentActivity[bId] || 0;
      if (bTime !== aTime) return bTime - aTime; // Most recent first

      return a.name.localeCompare(b.name); // Alphabetical fallback
    });
  }, [directory, searchTerm, conversations]);

  // SEND MESSAGE LOGIC
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && !attachment) || !selectedUser) return;

    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      senderId: currentUser.id || currentUser._id,
      receiverId: selectedUser.id || selectedUser._id,
      text: messageInput || '',
      timestamp: new Date().toISOString(),
      read: false,
      attachmentName: attachment ? attachment.name : undefined,
      attachmentType: attachment ? attachment.type : undefined
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    setAttachment(null);

    // Optimistically bubble this conversation to the top of the list
    setConversations(prev => {
      const otherId = selectedUser.id || selectedUser._id;
      const existingIdx = prev.findIndex(c => (c.user?.id || c.user?._id) === otherId);
      const updatedConvo = existingIdx >= 0
        ? { ...prev[existingIdx], lastMessage: { text: newMessage.text, createdAt: newMessage.timestamp, sender: currentUser.id || currentUser._id } }
        : { user: selectedUser, lastMessage: { text: newMessage.text, createdAt: newMessage.timestamp, sender: currentUser.id || currentUser._id }, hasUnread: false, unreadCount: 0 };
      const filtered = prev.filter((_, i) => i !== existingIdx);
      return [updatedConvo, ...filtered]; // Move to top
    });

    try {
      await sendMessage({
        senderId: currentUser.id || currentUser._id,
        receiverId: selectedUser.id || selectedUser._id,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        attachmentName: newMessage.attachmentName,
        attachmentType: newMessage.attachmentType
      });
      // Re-fetch conversations from server to confirm canonical sort order
      const convos = await fetchConversations();
      setConversations(convos);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // Filter messages for the active conversation
  const activeConversation = useMemo(() => {
    if (!selectedUser) return [];
    return messages;
  }, [messages, selectedUser]);

  // Get last message for sidebar preview
  const getLastMessage = (userId) => {
    const chat = messages.filter(m =>
      ((m.senderId === currentUser.id || m.senderId === currentUser._id) && (m.receiverId === userId || m.receiverId === userId)) ||
      ((m.senderId === userId || m.senderId === userId) && (m.receiverId === currentUser.id || m.receiverId === currentUser._id))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    return chat;
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex text-slate-800 dark:text-slate-100 theme-transition">
      {/* Sidebar List */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-slate-200 dark:border-slate-800`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-1">
            Messages
          </h2>
          <SearchInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredDirectory.length > 0 ? (
            filteredDirectory.map(user => {
              const userId = user.id || user._id;
              const convo = conversations.find(c => {
                const cId = c.user?.id || c.user?._id;
                return cId === userId;
              });
              const hasUnread = convo?.hasUnread || false;
              const unreadCount = convo?.unreadCount || 0;
              return (
                <div
                  key={userId}
                  onClick={() => handleSelectUser(user)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/30 ${
                    selectedUser?.id === user.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-l-indigo-600'
                      : hasUnread
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/10 border-l-4 border-l-indigo-400'
                      : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`truncate ${hasUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-900 dark:text-slate-100'}`}>{user.name}</h3>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          user.role === UserRole.GRADUATE
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450'
                            : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                        }`}>
                          {user.role === UserRole.GRADUATE ? 'Alumni' : 'Student'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasUnread && (
                          <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shrink-0">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs truncate ${
                      hasUnread
                        ? 'font-semibold text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {convo?.lastMessage
                        ? ((convo.lastMessage.sender === (currentUser.id || currentUser._id)) ? `You: ${convo.lastMessage.text}` : convo.lastMessage.text)
                        : user.title
                      }
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 px-4 text-slate-500 dark:text-slate-450 text-sm">
              No contacts found matching search.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50 dark:bg-slate-950/20 min-w-0`}>
        {selectedUser ? (
          <>
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm z-10 theme-transition">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedUser(null)} className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer text-slate-600 dark:text-slate-400">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-805 dark:text-white">{selectedUser.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${selectedUser.role === UserRole.GRADUATE ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-455' : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                      }`}>
                      {selectedUser.role === UserRole.GRADUATE ? 'Alumni' : 'Student'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {selectedUser.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-indigo-650 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  title="View Profile Details Sidebar"
                  aria-label="View Profile"
                >
                  <UserCircle className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowBlockMenu(!showBlockMenu)}
                    className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer ${showBlockMenu ? 'text-indigo-600 bg-slate-50 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                    title="More options"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showBlockMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-100">
                      {blockedUsers.includes(selectedUser.id || selectedUser._id) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBlockedUsers(blockedUsers.filter(id => id !== (selectedUser.id || selectedUser._id)));
                            setShowBlockMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Shield className="w-4 h-4" /> Unblock User
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setBlockedUsers([...blockedUsers, selectedUser.id || selectedUser._id]);
                            setShowBlockMenu(false);
                          }}
                           className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-red-500 dark:text-red-400" /> Block User
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/20">
              {activeConversation.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-655" />
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-300">No messages yet</p>
                  <p className="text-sm">Break the ice! Say hello to {selectedUser.name.split(' ')[0]}.</p>
                </div>
              ) : (
                activeConversation.map(msg => {
                  const isMe = msg.senderId === currentUser.id || msg.senderId === currentUser._id;
                  return (
                    <div key={msg.id || msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm wrap-break-word leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                        }`} style={{ wordBreak: 'break-word', minWidth: '2.5rem' }}>
                          {msg.text}
                        </div>
                        {msg.attachmentName && (
                          <div className={`mt-2 flex items-center gap-3 p-3 rounded-xl border text-xs max-w-sm ${isMe
                            ? 'bg-indigo-700/50 border-indigo-500/25 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-250'
                            }`}>
                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${isMe ? 'bg-indigo-900/50 text-indigo-200' : 'bg-red-100 dark:bg-red-950/40 text-red-655 dark:text-red-400'}`}>
                              {msg.attachmentName.split('.').pop().toUpperCase() || 'FILE'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{msg.attachmentName}</p>
                              <p className="text-[10px] opacity-75">Resource Attachment</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(`Downloading attachment: ${msg.attachmentName}`)}
                              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {blockedUsers.includes(selectedUser.id || selectedUser._id) ? (
              <div className="p-6 bg-red-50 dark:bg-red-950/20 border-t border-slate-200 dark:border-slate-800 text-center text-sm font-semibold text-red-700 dark:text-red-400 flex items-center justify-center gap-3">
                <Shield className="w-5 h-5 text-red-550" />
                <span>You have blocked this user. You cannot send or receive messages.</span>
                <button
                  onClick={() => setBlockedUsers(blockedUsers.filter(id => id !== (selectedUser.id || selectedUser._id)))}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            ) : (
              <>
                {attachment && (
                  <div className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600 dark:text-slate-350">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-605 bg-red-100 dark:bg-red-950/40 px-1.5 py-0.5 rounded text-[10px] dark:text-red-400">
                        {attachment.name.split('.').pop().toUpperCase()}
                      </span>
                      <span className="font-medium truncate max-w-62.5">{attachment.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 theme-transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachment({ name: e.target.files[0].name, type: e.target.files[0].type });
                      }
                    }}
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                       className={`p-3 rounded-xl transition-all cursor-pointer ${showAttachmentMenu ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                      title="Add attachment"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    {showAttachmentMenu && (
                      <div className="absolute bottom-14 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in slide-in-from-bottom duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          📁 Upload Local File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const name = currentUser.resumeName || `${currentUser.name.split(' ')[0]}_Resume.pdf`;
                            setAttachment({ name, type: 'application/pdf' });
                            setShowAttachmentMenu(false);
                          }}
                           className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 font-medium cursor-pointer"
                        >
                          📄 Attach My Resume
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl text-sm form-input-custom"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() && !attachment}
                     className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-slate-50/50 dark:bg-slate-950/20">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-850 flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-indigo-200 dark:text-indigo-700/50" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Your Messages</h3>
            <p className="max-w-xs mx-auto mt-2 text-sm text-slate-500 dark:text-slate-400">
              Select a conversation from the left to start chatting with Alumni or Students.
            </p>
          </div>
        )}

        {/* Full-Screen Profile Modal (all screen sizes) */}
        {isProfileOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 shadow-2xl border dark:border-slate-850">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-205 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.name} &middot; {selectedUser.role === 'alumni' || selectedUser.role === 'graduate' ? 'Alumni' : 'Student'}</p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Full Profile */}
              <div className="p-6">
                <Profile user={selectedUser} readOnly={true} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
