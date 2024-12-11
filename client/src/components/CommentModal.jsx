import React, { useState, useEffect } from 'react';

const CommentModal = ({ listingId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [listingId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/comments`, {
        credentials: 'include'
      });
      const data = await response.json();
      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/listings/${listingId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comment_text: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {loading ? (
          <p>Loading comments...</p>
        ) : (
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-2">
                <p className="text-sm text-gray-600">
                  {comment.username ? `${comment.username}` : 'Anonymous'}
                </p>
                <p>{comment.comment_text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal; 