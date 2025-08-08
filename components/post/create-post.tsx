import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { updateDoc, doc, increment } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link2, ThumbsDown, MessageCircle, Heart } from "lucide-react";
import { LikeReactionPopover } from "./LikeReactionPopover";
import { onAuthStateChanged } from "firebase/auth";
import { WordCounter } from "./WordCounter"
type User = {
  id: string;
  username: string;
  email: string;
  profilepic?: string;
};

export function CreatePost() {
  const [postContent, setPostContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [dislikedPosts, setDislikedPosts] = useState<string[]>([]);
  const dislikes = useRef(0);
  const [commentBoxStates, setCommentBoxStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState<
    string | null
  >(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [authInitialized, setAuthInitialized] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [postReactions, setPostReactions] = useState<{ [key: string]: any }>({});
  const [wordCount, setWordCount] = useState<number>(0)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/post');
      const data = await response.json();

      if (response.ok) {
        const postsList = data.posts.map((post: any) => ({
          id: post.id,
          likes: post.likes || 0,
          likedBy: post.likedBy || [],
          dislikes: post.dislikes || 0,
          dislikedBy: post.dislikedBy || [],
          comments: post.comments || [],
          ...post,
        }));

        setPosts(postsList);

        // Update local liked and disliked posts state for the current user (if logged in)
        const currentUser = auth.currentUser;
        if (currentUser) {
          const likedPostIds = postsList
            .filter((post: any) => post.likedBy.includes(currentUser.uid))
            .map((post: any) => post.id);
          setLikedPosts(likedPostIds);

          const dislikedPostIds = postsList
            .filter((post: any) => post.dislikedBy.includes(currentUser.uid))
            .map((post: any) => post.id);
          setDislikedPosts(dislikedPostIds);
        }

        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("Failed to fetch posts");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImageToFirebase = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);

      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Get auth token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please login to upload images");
        return null;
      }

      const idToken = await currentUser.getIdToken();

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ image: base64 })
      });

      const data = await response.json();

      if (response.ok) {
        return data.url;
      } else {
        toast.error(data.error || "Failed to upload image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersMap: Record<string, User> = {};
      usersSnapshot.forEach((doc) => {
        usersMap[doc.id] = { id: doc.id, ...doc.data() } as User;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchCurrentUserProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      const userDoc = await getDocs(collection(db, "users"));
      const userData = userDoc.docs
        .find((doc) => doc.id === currentUser.uid)
        ?.data();

      if (userData && userData.profilepic) {
        setCurrentUserProfilePic(userData.profilepic);
      } else {
        setCurrentUserProfilePic(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setCurrentUserProfilePic(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      );
    }
  }, [router]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {

        await fetchPosts();
        await fetchUsers();
      } catch (error) {
        console.error("Error loading initial data:", error);
        if (error instanceof Error && error.message.includes('insufficient permissions')) {
        } else {
          setErrorMessage("Failed to load posts. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthInitialized(true);
      if (user) {
        // User is signed in - fetch user profile
        try {
          await fetchCurrentUserProfile();// Refresh posts to update like/dislike states for this user
          await fetchPosts();
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setCurrentUserProfilePic(null);
        setLikedPosts([]);
        setDislikedPosts([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchCurrentUserProfile]);
  const handlePostComment = async (postId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    const commentText = commentInputs[postId];
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    const post = posts[postIndex];
    const newComment = {
      userId: currentUser.uid,
      text: commentText,
      timestamp: Date.now()
    };
    const newComments = [...(post.comments || []), newComment];

    setPosts((prevPosts) =>
      prevPosts.map((p, idx) =>
        idx === postIndex ? { ...p, comments: newComments } : p
      )
    );
    setCommentInputs((prev: any) => ({ ...prev, [postId]: "" }));

    try {
      const idToken = await currentUser.getIdToken();
      await fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ text: commentText })
      });
      toast.success("Comment posted successfully.");
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex ? { ...p, comments: post.comments } : p
        )
      );
      setCommentInputs((prev: any) => ({ ...prev, [postId]: commentText }));
      toast.error("Failed to post comment.");
    }
  };

  const handlePostSubmit = async () => {
    setLoading(true);
    if (postContent.trim()) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        let imageUrl = null;
        if (selectedImage) {
          imageUrl = await uploadImageToFirebase(selectedImage);
        }

        const idToken = await currentUser.getIdToken();
        const response = await fetch("/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({ content: postContent, imageUrl })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          await fetchPosts();
          toast.success("Your voice shall be heard");
          setPostContent("");
          setSelectedImage(null);
          setImagePreview(null);
        } else {
          toast.error(data.error || "Content not appropriate for posting");
        }
      } catch (error) {
        console.error("Error processing post:", error);
        toast.error("An error occurred while posting.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Post content is empty.");
      setLoading(false);
    }
  };


  const handleDislike = async (postId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You need to be logged in to dislike a post.");
      return;
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];
    const userId = currentUser.uid;
    const hasDisliked = post.dislikedBy?.includes(userId);
    const hasLiked = post.likedBy?.includes(userId);

    // UI update
    let newLikedBy = post.likedBy;
    let newDislikedBy = post.dislikedBy || [];
    let newLikes = post.likes;
    let newDislikes = post.dislikes || 0;

    if (hasDisliked) {
      newDislikedBy = newDislikedBy.filter((id: string) => id !== userId);
      newDislikes = Math.max(newDislikes - 1, 0);
    } else {
      newDislikedBy = [...newDislikedBy, userId];
      newDislikes = newDislikes + 1;
      if (hasLiked) {
        newLikedBy = newLikedBy.filter((id: string) => id !== userId);
        newLikes = Math.max(newLikes - 1, 0);
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      }
    }

    setPosts((prevPosts) =>
      prevPosts.map((p, idx) =>
        idx === postIndex
          ? { ...p, likes: newLikes, likedBy: newLikedBy, dislikes: newDislikes, dislikedBy: newDislikedBy }
          : p
      )
    );
    setDislikedPosts(hasDisliked ? dislikedPosts.filter((id) => id !== postId) : [...dislikedPosts, postId]);
    console.log("DislikedPosts state after update:", newDislikes);

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`/api/post/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to update dislike");

      // Parse updated post from backend
      const updatedPost = await response.json();

      // Update posts state with latest backend data for exact sync
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex
            ? {
              ...p,
              likes: updatedPost.likes,
              likedBy: updatedPost.likedBy,
              dislikes: updatedPost.dislikes,
              dislikedBy: updatedPost.dislikedBy,
              reactions: updatedPost.reactions || p.reactions, // in case backend updated reactions on dislike
            }
            : p
        )
      );

      // Also update dislikedPosts state based on backend signal
      if ((updatedPost.dislikedBy || []).includes(userId)) {
        setDislikedPosts((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
      } else {
        setDislikedPosts((prev) => prev.filter((id) => id !== postId));
      }
    } catch (error) {
      // Rollback UI update on failure
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex ? post : p
        )
      );
      setDislikedPosts(hasDisliked ? [...dislikedPosts, postId] : dislikedPosts.filter((id) => id !== postId));
      toast.error("Failed to update dislikes.");
    }
  };


  const handleShare = async (postId: string) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const post = posts[postIndex];
    const newShares = (post.shares || 0) + 1;

    setPosts((prevPosts) =>
      prevPosts.map((p, idx) =>
        idx === postIndex ? { ...p, shares: newShares } : p
      )
    );

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        await fetch(`/api/post/${postId}/share`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
      }

      const shareUrl = `${window.location.origin}/post/${postId}`;
      if (navigator.share) {
        await navigator.share({
          title: "Check out this post!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Post link copied to clipboard!");
      }
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex ? { ...p, shares: post.shares } : p
        )
      );
      toast.error("Failed to share post.");
    }
  };

  //Updated likes to reaction function
  const handleReaction = async (postId: string, reactionType: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You need to be logged in to react to a post.");
      return;
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const currentReactions = post.reactions || {};

    // UI update
    const updatedReactions = { ...currentReactions };
    const userId = currentUser.uid;

    // Remove user from all reactions first
    Object.keys(updatedReactions).forEach((key) => {
      updatedReactions[key] = {
        count: Math.max((updatedReactions[key]?.count || 0) - (updatedReactions[key]?.users.includes(userId) ? 1 : 0), 0),
        users: (updatedReactions[key]?.users || []).filter((id: string) => id !== userId),
      };
    });

    // Toggle the selected reaction
    const hasReacted = currentReactions[reactionType]?.users?.includes(userId);
    if (!hasReacted) {
      if (!updatedReactions[reactionType]) {
        updatedReactions[reactionType] = { count: 0, users: [] };
      }
      updatedReactions[reactionType] = {
        count: (updatedReactions[reactionType]?.count || 0) + 1,
        users: [...(updatedReactions[reactionType]?.users || []), userId],
      };
    }

    setPosts((prevPosts) =>
      prevPosts.map((p, idx) =>
        idx === postIndex ? { ...p, reactions: updatedReactions } : p
      )
    );

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`/api/post/${postId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ reactionType }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reaction");
      }

      const data = await response.json();

      // Update with server response
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex
            ? {
              ...p,
              reactions: data.reactions,
              dislikedBy: data.dislikedBy || [],
              dislikes: data.dislikes || 0
            }
            : p
        )
      );
      // Update dislikedPosts
      const currentUserId = currentUser.uid;
      if (currentUserId) {
        if ((data.dislikedBy || []).includes(currentUserId)) {
          setDislikedPosts((prev) =>
            prev.includes(postId) ? prev : [...prev, postId]
          );
        } else {
          setDislikedPosts((prev) => prev.filter(id => id !== postId));
        }
      }
    } catch (error) {
      // Revert update on error
      setPosts((prevPosts) =>
        prevPosts.map((p, idx) =>
          idx === postIndex ? { ...p, reactions: currentReactions } : p
        )
      );
      toast.error("Failed to update reaction.");
    }
  };

  const handlePostClick = async (postId: string) => {
    window.location.href = `${window.location.origin}/post/${postId}`;
  }

  const handleEditPost = (postId: string, content: string) => {
    setEditingPostId(postId);
    setEditContent(content);
  };

  const handleSaveEdit = async (postId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`/api/post/${postId}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ content: editContent })
      });

      if (response.ok) {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, content: editContent } : post
        ));
        setEditingPostId(null);
        setEditContent("");
        toast.success("Post updated successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update post");
      }
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  const canEditPost = (post: any) => {
    const currentUser = auth.currentUser;
    return currentUser &&
      post.userId === currentUser.uid &&
      Date.now() < post.editableUntil;
  };

  const toggleCommentBox = (postId: string) => {
    setCommentBoxStates((prev: any) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 top-0 h-[20%] flex items-center justify-center z-50">
          <HashLoader size={50} color="#ffffff" />
        </div>
      )}

      {/* Show post creation only if user is authenticated */}
      {authInitialized && auth.currentUser && (
        <>
          <Card className="p-4 ">
            <div className="flex gap-4">
              <Avatar className="w-10 h-10">
                <Image
                  loading="lazy"
                  src={currentUserProfilePic || ""}
                  width={100}
                  height={100}
                  alt={"User's avatar"}
                  className="rounded-full"
                />
              </Avatar>
              <div className="flex-1 w-[50%]">
                <Textarea
                  placeholder="Share your latest failure..."
                  className="min-h-[100px]"
                  value={postContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const text = e.target.value;
                    const words = text.split('').filter(word => word.length > 0);

                    if(words.length <= 600){
                      setPostContent(text);
                      setWordCount(words.length);
                    }
                  }}
                />

                {imagePreview && (
                  <div className="mt-4 relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      ✕
                    </Button>
                  </div>
                )}

                <div className="justify-between items-center mt-4 md:flex">
                  <div className="flex gap-2">
                  <div className="flex gap-2">
                    <label htmlFor="image-upload">
                      <Button variant="outline" size="sm" type="button" asChild>
                        <span>Upload Image</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                  <WordCounter count={wordCount} />
                  </div>
                  <Button
                    size="sm"
                    onClick={handlePostSubmit}
                    disabled={loading || uploadingImage}
                    className="my-2 bg-background text-foreground hover:bg-card border border-gray-300"
                  >
                    {loading || uploadingImage ? "Posting..." : "Confess"}
                  </Button>
                </div>
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </Card>
        </>
      )}

      {/* Show login prompt if not authenticated */}
      {authInitialized && !auth.currentUser && (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            <Button variant="link" onClick={() => router.push("/login")}>
              Login
            </Button>
            to create posts, like, and comment.
          </p>
        </Card>
      )}

      {/* Debug and refresh section - only show for authenticated users */}
      {authInitialized && auth.currentUser && (
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPosts}
            disabled={loading}
          >
            Refresh Posts
          </Button>
          <p className="text-sm text-muted-foreground">
            {posts.length} posts found
          </p>
        </div>
      )}

      {/* Error message display - only show for authenticated users */}
      {authInitialized && auth.currentUser && errorMessage && posts.length > 0 && (
        <Card className="p-4 mt-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-yellow-700 text-sm font-medium">{errorMessage}</p>
          </div>
          {errorMessage.includes('insufficient permissions') && (
            <div className="text-sm text-yellow-700 mt-2">
              <p className="font-medium">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>You don't have permission to access firebase databse</li>
              </ol>
            </div>
          )}
        </Card>
      )}

      {/* Show posts only if user is authenticated */}
      {authInitialized && auth.currentUser && (
        <div className="mt-6">
          {posts.length > 0 ? (
            posts.map((post: any) => {
              const user = users[post.userId];
              const profilePic =
                user?.profilepic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
              return (
                <Card
                  key={post.id}
                  className="p-4 mb-4"
                  onClick={() => handlePostClick(post.id)}
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <Image
                        src={profilePic}
                        height={100}
                        width={100}
                        alt={`${user?.username || "Anonymous"}'s avatar`}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{post.userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {canEditPost(post) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditPost(post.id, post.content);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="max-w-xl px-10">
                    <div className="mb-3">
                      {editingPostId === post.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px]"
                            onClick={(event) => event.stopPropagation()}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSaveEdit(post.id);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleCancelEdit();
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground leading-relaxed px-5">{post.content}</p>
                      )}
                    </div>


                    {/* Display image if exists */}
                    {post.imageUrl && (
                      <div className="mb-4 lg:mb-6">
                        <Image
                          src={post.imageUrl}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="rounded-lg object-cover w-full max-h-96 lg:max-h-[500px]"
                        />
                      </div>
                    )}
                    <div className="flex justify-around text-sm lg:text-base text-gray-500">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <LikeReactionPopover
                          reactions={post.reactions || {}}
                          currentUserId={auth.currentUser?.uid || null}
                          onReact={(reactionType) => handleReaction(post.id, reactionType)}
                        />

                      </motion.div>

                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!auth.currentUser) {
                              toast.error("Please login to dislike posts");
                              return;
                            }
                            handleDislike(post.id);
                          }}
                          className="flex items-center gap-2"
                        >
                          <ThumbsDown
                            className={`h-4 w-4 ${dislikedPosts.includes(post.id)
                              ? "text-blue-500"
                              : likedPosts.includes(post.id)
                                ? "text-red-500"
                                : "text-gray-500"
                              }`}
                          />

                          {post.dislikes || 0} Dislike
                        </Button>
                      </motion.div>



                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!auth.currentUser) {
                            toast.error("Please login to comment on posts");
                            return;
                          }
                          toggleCommentBox(post.id)
                        }}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {post.comments?.length || 0} Comments
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleShare(post.id)
                        }}
                        className="flex items-center gap-2"
                      >
                        <Link2 className="h-4 w-4" />
                        {post.shares || 0} Shares
                      </Button>
                    </div>
                  </div>
                  {commentBoxStates[post.id] && auth.currentUser && (
                    <>
                      <div className="mt-4 lg:mt-6">
                        <div className="flex items-center gap-2 lg:gap-4">
                          <Avatar className="w-8 h-8 lg:w-12 lg:h-12">
                            <Image
                              src={currentUserProfilePic || ""}
                              height={100}
                              width={100}
                              alt="User Avatar"
                              className="rounded-full"
                            />
                          </Avatar>
                          <Textarea
                            placeholder="Write a comment..."
                            className="flex-1 min-h-[40px] lg:min-h-[60px] resize-none text-sm lg:text-base"
                            value={commentInputs[post.id] || ""}
                            onChange={(e: any) =>
                              setCommentInputs((prev: any) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          />
                          <Button
                            size="sm"
                            className="ml-2 lg:px-6 lg:py-3 lg:text-base"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePostComment(post.id)
                            }}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                      {post.comments && post.comments.length > 0 && (
                        <div className="mt-4">
                          {post.comments.map((comment: any, index: any) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mt-2 p-2 rounded-md bg-background"
                            >
                              <Avatar className="w-8 h-8">
                                <Image
                                  src={
                                    users[comment.userId]?.profilepic ||
                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                  }
                                  width={100}
                                  height={100}
                                  alt="Commenter's Avatar"
                                  className="rounded-full"
                                />
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm">
                                  {users[comment.userId]?.username || "Anonymous"}
                                </p>
                                <p>{comment.text}</p>
                                <p className="text-gray-500 text-xs">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Show comments even if user is not logged in */}
                  {post.comments && post.comments.length > 0 && !auth.currentUser && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Comments:</p>
                      {post.comments.map((comment: any, index: any) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mt-2 p-2 rounded-md bg-background"
                        >
                          <Avatar className="w-8 h-8">
                            <Image
                              src={
                                users[comment.userId]?.profilepic ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                              }
                              width={100}
                              height={100}
                              alt="Commenter's Avatar"
                              className="rounded-full"
                            />
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">
                              {users[comment.userId]?.username || "Anonymous"}
                            </p>
                            <p>{comment.text}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              {errorMessage ? (
                <div className="space-y-4">
                  <div className="text-red-500 text-lg font-medium">
                    ⚠️ Failed to Load Posts
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't fetch the posts right now. This might be due to network issues or database permissions.
                  </p>
                  <Button
                    variant="outline"
                    onClick={fetchPosts}
                    disabled={loading}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : loading ? (
                <div className="space-y-4">
                  <HashLoader color="white" />
                  <p className="text-muted-foreground">Loading posts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-muted-foreground text-lg">
                    📝 No Posts Yet
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Be the first to share your story! Create a post to get the conversation started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Show login prompt for posts if not authenticated */}
      {authInitialized && !auth.currentUser && (
        <Card className="p-8 text-center mt-6">
          <div className="space-y-4">
            <div className="text-muted-foreground text-lg">
              🔒 Posts are Private
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please login to view and interact with posts from the community.
            </p>
            <Button
              variant="default"
              onClick={() => router.push("/login")}
              className="mt-4"
            >
              Login to View Posts
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
