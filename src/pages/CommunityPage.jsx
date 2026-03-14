import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppContext } from '../lib/AppContext';

export function CommunityPage() {
  const { posts, addPost, toggleLike, addComment, currentUser } = useAppContext();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent);
    setNewPostContent('');
  };

  const handleCommentSubmit = (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    addComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto w-full space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Community</h1>
        <p className="text-zinc-400 text-sm">See what other learners are up to.</p>
      </div>

      {/* Create Post */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4">
          <form onSubmit={handlePostSubmit} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                {currentUser.avatar}
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your learning progress..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!newPostContent.trim()}>
                Post Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shrink-0">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{post.authorName}</h3>
                  <p className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${post.likedByHost ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-300'}`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByHost ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments.length}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 ml-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400 font-bold shrink-0 mt-0.5">
                      {comment.authorAvatar}
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-2.5 flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs font-semibold text-white">{comment.authorName}</span>
                        <span className="text-[10px] text-zinc-500">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2 ml-2 mt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Write a comment..."
                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-auto py-1 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
