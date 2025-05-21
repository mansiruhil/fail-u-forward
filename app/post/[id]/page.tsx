"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { HashLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", id as string);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
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
  const handleDislike = (post:any)=>{
    console.log("nai kiya define")
  }
  const handleShare = (post:any)=>{
    console.log("nai kiya define")
  }
  const toggleCommentBox = (post:any)=>{
    console.log("nai kiya define")
  }
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
        <Card className="p-4 mb-4">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
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
                onClick={() => handleDislike(post.id)}
                className="flex items-center gap-2"
              >
                <ThumbsDown
                  className={`h-4 w-4 ${
                    dislikedPosts.includes(post.id)
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
                {post.dislikes} Dislike
              </Button>
            </motion.div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCommentBox(post.id)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(post.id)}
              className="flex items-center gap-2"
            >
              <Link2 className="h-4 w-4" />
              {post.shares || 0} Shares
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <Avatar className="w-10 h-10">
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
            <Textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button onClick={handlePostComment} className="mt-2">
              Post Comment
            </Button>
          </div>
        </Card>
      </div>
      <RightSidebar/>
    </div>
  );
};

export default PostPage;
