"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { HashLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshButton } from "@/components/ui/refresh-button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsDown, Link2 } from "lucide-react";
import { LeftSidebar } from "@/components/sidebar/leftsidebar";
import { RightSidebar } from "@/components/sidebar/rightsidebar";

const PostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dislikedPosts, setDislikedPosts] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [showComments, setShowComments] = useState(true);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);

  const handleRefresh = async () => {
    // Force a page refresh to reload all data
    window.location.reload();
  };

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", id as string);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = { id: postDoc.id, ...postDoc.data() } as any;
          setPost(postData);
          
          // Initialize state based on post data
          const currentUser = auth.currentUser;
          if (currentUser && postData.dislikedBy) {
            setIsDisliked(postData.dislikedBy.includes(currentUser.uid));
          }
          setDislikesCount(postData.dislikes || 0);
          setSharesCount(postData.shares || 0);
        } else {
          console.error("Post not found");
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  // Reset comments when navigating to different posts
  useEffect(() => {
    return () => {
      setShowComments(true);
    };
  }, [id]);
  const handleDislike = async () => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast.error("Please log in to dislike posts");
      return;
    }

    try {
      const postRef = doc(db, "posts", id as string);
      const newDislikedState = !isDisliked;
      
      // Optimistic UI update
      setIsDisliked(newDislikedState);
      setDislikesCount(prev => newDislikedState ? prev + 1 : prev - 1);

      if (newDislikedState) {
        // Add dislike
        await updateDoc(postRef, {
          dislikedBy: arrayUnion(currentUser.uid),
          dislikes: increment(1)
        });
        toast.success("Post disliked");
      } else {
        // Remove dislike
        await updateDoc(postRef, {
          dislikedBy: arrayRemove(currentUser.uid),
          dislikes: increment(-1)
        });
        toast.success("Dislike removed");
      }
    } catch (error) {
      console.error("Error updating dislike:", error);
      // Revert optimistic update on error
      setIsDisliked(!isDisliked);
      setDislikesCount(prev => isDisliked ? prev + 1 : prev - 1);
      toast.error("Failed to update dislike");
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${id}`;
      const shareData = {
        title: post?.userName ? `Post by ${post.userName}` : 'Check out this post',
        text: post?.content?.substring(0, 100) || 'Interesting post on Fail U Forward',
        url: shareUrl
      };

      // Check if Web Share API is available
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        
        // Update shares count in database
        const postRef = doc(db, "posts", id as string);
        await updateDoc(postRef, {
          shares: increment(1)
        });
        
        // Optimistic UI update
        setSharesCount(prev => prev + 1);
        toast.success("Post shared successfully!");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        
        // Update shares count in database
        const postRef = doc(db, "posts", id as string);
        await updateDoc(postRef, {
          shares: increment(1)
        });
        
        // Optimistic UI update
        setSharesCount(prev => prev + 1);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      
      // If sharing failed but we can still copy to clipboard
      try {
        const shareUrl = `${window.location.origin}/post/${id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (clipboardError) {
        toast.error("Failed to share post");
      }
    }
  };

  const toggleCommentBox = () => {
    setShowComments(prev => !prev);
  };
  const handlePostComment = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("You need to be logged in to comment.");
      return;
    }

    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const postRef = doc(db, "posts", post.id);
      const newComment = {
        userId: currentUser.uid,
        text: commentInput,
        userName: currentUser.displayName || "Anonymous",
        profilePic: currentUser.photoURL || "",
        timestamp: new Date(),
      };

      const updatedComments = post.comments
        ? [...post.comments, newComment]
        : [newComment];

      await updateDoc(postRef, {
        comments: updatedComments,
      });

      setPost((prev:any) => ({
        ...prev,
        comments: updatedComments,
      }));
      setCommentInput("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <HashLoader size={50} color="#ffffff" />
      </div>
    );
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="p-4">
      <LeftSidebar/>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <RefreshButton onRefresh={handleRefresh} size="sm" />
        </div>
        <Card className="p-4 mb-4">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 ring-1 ring-border">
              <Image
                src={
                  post.userProfilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                height={48}
                width={48}
                alt={`${post.userName || "Anonymous"}'s avatar`}
                className="rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <p className="font-bold">{post.userName || "Anonymous"}</p>
              <p className="text-sm text-gray-600">
                {post.timestamp
                  ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp available"}
              </p>
              <p className="mt-2">{post.content}</p>
            </div>
          </div>
          <hr className="my-4 border-secondary" /> 
          <div className="flex justify-around text-sm text-gray-500">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDislike}
                disabled={!auth.currentUser}
                className={`flex items-center gap-2 ${
                  isDisliked
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-muted-foreground hover:bg-gray-100"
                } ${!auth.currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                title={!auth.currentUser ? "Please log in to dislike" : isDisliked ? "Remove dislike" : "Dislike post"}
              >
                <ThumbsDown
  className={`h-4 w-4 ${
    dislikedPosts.includes(post.id) ? "text-red-500" : "text-gray-500"
  } ${isDisliked ? "fill-current" : ""}`}
/>
                {dislikesCount} Dislike
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCommentBox}
              className={`flex items-center gap-2 ${
                showComments
                  ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
                  : "text-muted-foreground hover:bg-gray-100"
              }`}
              title={showComments ? "Hide comments" : "Show comments"}
            >
              <MessageCircle className={`h-4 w-4 ${showComments ? "fill-current" : ""}`} />
              Comment
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 text-muted-foreground hover:bg-gray-100 hover:text-green-600"
              title="Share this post"
            >
              <Link2 className="h-4 w-4" />
              {sharesCount} Shares
            </Button>
          </div>
        </Card>

        {showComments && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <Avatar className="w-10 h-10 ring-1 ring-border">
                      <Image
                        src={
                          comment.profilePic ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        height={40}
                        width={40}
                        alt={`${comment.userName || "Anonymous"}'s avatar`}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div>
                      <p className="font-bold">{comment.userName || "Anonymous"}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                      <p className="mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}

            <div className="mt-4">
              {auth.currentUser ? (
                <>
                  <Textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                  />
                  <Button 
                    onClick={handlePostComment} 
                    disabled={!commentInput.trim()}
                    className="w-full sm:w-auto"
                  >
                    Post Comment
                  </Button>
                </>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">Please log in to post comments.</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
      <RightSidebar/>
    </div>
  );
};

export default PostPage;
