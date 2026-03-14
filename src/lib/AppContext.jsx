import { createContext, useContext, useState } from 'react';
import { format, subMinutes, subHours, subDays } from 'date-fns';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const now = new Date();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 'u1',
    username: 'Alex',
    avatar: 'A',
    xp: 2450,
    badges: ['React Novice', '10-Day Streak', 'Early Adopter'],
    skillsTracked: ['React', 'TypeScript', 'UI/UX Design'],
    totalHours: 45,
    streak: 12,
    friends: ['u2', 'u3']
  });

  const [users, setUsers] = useState([
    { id: 'u1', username: 'Alex', avatar: 'A', xp: 2450, streak: 12, weeklyHours: 15.5 },
    { id: 'u2', username: 'Aman', avatar: 'AM', xp: 3200, streak: 21, weeklyHours: 20 },
    { id: 'u3', username: 'Riya', avatar: 'R', xp: 1800, streak: 10, weeklyHours: 12 },
    { id: 'u4', username: 'Rahul', avatar: 'RH', xp: 4100, streak: 45, weeklyHours: 25 },
    { id: 'u5', username: 'Priya', avatar: 'P', xp: 950, streak: 3, weeklyHours: 6.5 },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 'p1',
      authorId: 'u2',
      authorName: 'Aman',
      authorAvatar: 'AM',
      content: 'I completed a 7 day React streak today 🔥 Finally getting the hang of useEffect.',
      timestamp: subHours(now, 2).toISOString(),
      likes: 14,
      likedByHost: false,
      comments: [
        { id: 'c1', authorName: 'Riya', authorAvatar: 'R', content: 'Awesome job! Keep it up.', timestamp: subMinutes(now, 45).toISOString() }
      ]
    },
    {
      id: 'p2',
      authorId: 'u4',
      authorName: 'Rahul',
      authorAvatar: 'RH',
      content: 'Does anyone have good DSA practice resources in Python? Mostly struggling with graphs.',
      timestamp: subDays(now, 1).toISOString(),
      likes: 8,
      likedByHost: true,
      comments: [
        { id: 'c2', authorName: 'Alex', authorAvatar: 'A', content: 'Check out NeetCode! Real lifesaver.', timestamp: subHours(now, 5).toISOString() }
      ]
    }
  ]);

  const [messages, setMessages] = useState({
    'u2': [ // Conversation with Aman
      { id: 'm1', senderId: 'u2', content: 'Hey Alex, did you finish the React tutorial?', timestamp: subHours(now, 24).toISOString() },
      { id: 'm2', senderId: 'u1', content: 'Almost! Just wrapping up the last section on context.', timestamp: subHours(now, 23).toISOString() },
      { id: 'm3', senderId: 'u2', content: 'Nice, let me know if you need help with the prop drilling stuff.', timestamp: subHours(now, 2).toISOString() },
    ],
    'u3': [ // Conversation with Riya
      { id: 'm4', senderId: 'u1', content: 'How is the new Figma layout going?', timestamp: subDays(now, 2).toISOString() },
      { id: 'm5', senderId: 'u3', content: 'Getting there. Auto-layout is a bit annoying but powerful.', timestamp: subDays(now, 2).toISOString() },
    ]
  });

  const [friendRequests, setFriendRequests] = useState([
    { id: 'fr1', fromUserId: 'u5', fromUserName: 'Priya', avatar: 'P' }
  ]);

  // Actions
  const addPost = (content) => {
    const newPost = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedByHost: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.likedByHost;
        return { ...p, likedByHost: isLiked, likes: p.likes + (isLiked ? 1 : -1) };
      }
      return p;
    }));
  };

  const addComment = (postId, content) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: `c${Date.now()}`,
            authorName: currentUser.username,
            authorAvatar: currentUser.avatar,
            content,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return p;
    }));
  };

  const sendMessage = (userId, content) => {
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMsg]
    }));
  };

  const acceptFriendRequest = (requestId, userId) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    setCurrentUser(prev => ({ ...prev, friends: [...prev.friends, userId] }));
  };

  const rejectFriendRequest = (requestId) => {
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };
  
  const sendFriendRequest = (userId) => {
    // Just a mock, in real app would send to backend
    alert(`Friend request sent to ${users.find(u => u.id === userId)?.username}!`);
  };

  const updateSettings = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
  };

  const value = {
    currentUser,
    users,
    posts,
    messages,
    friendRequests,
    addPost,
    toggleLike,
    addComment,
    sendMessage,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    updateSettings
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
