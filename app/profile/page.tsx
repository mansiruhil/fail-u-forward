"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshButton } from "@/components/ui/refresh-button";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, MapPin, Building2, GraduationCap, ThumbsDown, LogOut, User, Trash2, X, Camera } from "lucide-react";
import { doc, getDoc, collection, query, getDocs, updateDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp, db } from "@/lib/firebase";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

interface UserData {
  username: string;
  email: string;
  location?: string;
  bio?: string;
  profilepic?: string;
  failedExperience?: string[];
  misEducation?: string[];
  failureHighlights?: string[];
  followers?: string[];
  following?: string[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export default function Profile() {
  // State hooks - must be called unconditionally at the top level
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [edit, setEdit] = useState<UserData>({
    username: "",
    email: "",
    location: "",
    bio: "",
    profilepic: "",
    failedExperience: [],
    misEducation: [],
    failureHighlights: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  const handleRefresh = async () => {
    // Force a page refresh to reload all data
    window.location.reload();
  };
  
  const fetchUserData = useCallback(async (): Promise<(() => void) | undefined> => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
    
    if (!user) {
      router.push("/login");
      return undefined;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // Use real-time listener instead of one-time fetch
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const fetchedUserData = docSnap.data() as UserData;
          console.log("onSnapshot triggered - new user data:", fetchedUserData);
          setUserData(fetchedUserData);
          
          // Set follower/following counts
          setFollowerCount(fetchedUserData.followers?.length || 0);
          setFollowingCount(fetchedUserData.following?.length || 0);
          
          setEdit({
            username: fetchedUserData.username || "",
            email: fetchedUserData.email || "",
            location: fetchedUserData.location || "",
            bio: fetchedUserData.bio || "",
            profilepic: fetchedUserData.profilepic || "",
            failedExperience: (fetchedUserData.failedExperience && fetchedUserData.failedExperience.length > 0) 
              ? fetchedUserData.failedExperience 
              : [""],
            misEducation: (fetchedUserData.misEducation && fetchedUserData.misEducation.length > 0) 
              ? fetchedUserData.misEducation 
              : [""],
            failureHighlights: fetchedUserData.failureHighlights || []
          });
        } else {
          console.error("No user document found!");
          setUserData(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
        setLoading(false);
      });

      // Return cleanup function
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up user data listener:", error);
      toast.error("Failed to fetch user data");
      setLoading(false);
      return undefined;
    }
  }, [router]);

  const fetchPosts = useCallback(async () => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
    
    if (!user) return;

    try {
      const postsCollection = collection(db, "posts"); 
      const postsQuery = query(postsCollection); 
    
      const querySnapshot = await getDocs(postsQuery); 
      const fetchedPosts: Post[] = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">), 
        }))
        .filter((post) => post.userId === user.uid); 
    
      setPosts(fetchedPosts); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    let userUnsubscribe: (() => void) | undefined;
    
    const setupData = async () => {
      userUnsubscribe = await fetchUserData();
      await fetchPosts();
    };
    
    setupData();
    
    return () => {
      if (userUnsubscribe) {
        userUnsubscribe();
      }
    };
  }, [fetchUserData, fetchPosts]);

  const handleLogout = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed");
    }
  };

  const handleOpenModal = () => {
    setEdit({
      username: userData?.username || "",
      email: userData?.email || "",
      location: userData?.location || "",
      bio: userData?.bio || "",
      profilepic: userData?.profilepic || "",
      failedExperience: (userData?.failedExperience && userData.failedExperience.length > 0) ? userData.failedExperience : [""],
      misEducation: (userData?.misEducation && userData.misEducation.length > 0) ? userData.misEducation : [""],
      failureHighlights: userData?.failureHighlights || []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEdit(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleArrayEdit = (key: keyof UserData, index: number, value: string) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      const updatedArray = currentArray ? [...currentArray] : [];
      updatedArray[index] = value;
      return {
        ...prev,
        [key]: updatedArray
      };
    });
  };
  
  const handleAddArrayItem = (key: keyof UserData) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      return {
        ...prev,
        [key]: [...(currentArray || []), ""]
      };
    });
  };
  
  const handleRemoveArrayItem = (key: keyof UserData, index: number) => {
    setEdit(prev => {
      const currentArray = prev[key] as string[] | undefined;
      if (!currentArray) return prev;
  
      const updatedArray = [...currentArray];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [key]: updatedArray
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) {
      toast.error("Please select a file first.");
      return null;
    }

    // Client-side validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 5MB");
      return null;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)");
      return null;
    }

    setIsUploading(true);
    
    try {
      // Convert file to base64 for the API
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file!);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      const idToken = await user?.getIdToken();

      if (!user || !idToken) {
        toast.error("Authentication required. Please sign in again.");
        return null;
      }

      console.log("Starting secure file upload...");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ image: base64 })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Upload failed:", responseData);
        throw new Error(responseData.message || "Failed to upload file");
      }

      console.log("Upload successful, received URL:", responseData.url);
      return responseData.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
    
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsSaving(true);

    try {
      let profilePicUrl = userData?.profilepic;
      
      // Handle profile picture upload first if there's a new file
      if (file) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) {
          profilePicUrl = uploadedUrl;
          // Update the edit state with the new URL
          setEdit(prev => ({ ...prev, profilepic: uploadedUrl }));
        } else {
          // If upload failed but user still wants to save other changes
          const shouldContinue = window.confirm(
            "Profile picture upload failed. Would you like to save other changes?"
          );
          if (!shouldContinue) return;
        }
      }

      // Filter out empty strings from arrays
      const cleanedEdit = {
        ...edit,
        username: edit.username.trim(),
        bio: (edit.bio ?? '').trim(),
        location: (edit.location ?? '').trim(),
        profilepic: profilePicUrl, // Use the new URL or keep existing
        failedExperience: edit.failedExperience?.filter(item => item.trim() !== "") || [],
        misEducation: edit.misEducation?.filter(item => item.trim() !== "") || [],
        failureHighlights: edit.failureHighlights?.filter(item => item.trim() !== "") || []
      };

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, cleanedEdit);
      
      // Update local state with cleaned data
      setUserData(prev => prev ? { ...prev, ...cleanedEdit } : null);
      
      // Show success toast
      toast.success("Profile successfully updated!");
      
      // Close modal and reset states after a short delay for better UX
      setTimeout(() => {
        setIsModalOpen(false);
        setFile(null);
        setPreview(null);
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Update avatar source when userData changes
  useEffect(() => {
    if (userData?.profilepic) {
      setAvatarSrc(userData.profilepic);
      setIsImageLoading(true);
    } else {
      setAvatarSrc("");
      setIsImageLoading(false);
    }
  }, [userData?.profilepic]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <HashLoader color="white"/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-end">
          <RefreshButton onRefresh={handleRefresh} size="sm" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative bg-background text-foreground border border-gray-200/30 rounded-xl shadow-lg">
            <div className="h-24 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl border-b border-gray-200"></div>
            <div className="p-8">
              <div className="flex items-start mb-6">
                <div className="relative">
                  <div className="w-36 h-36 mr-6 ring-3 ring-gray-600 rounded-full overflow-hidden">
                    <div className="relative w-full h-full bg-gray-100 rounded-full overflow-hidden">
                      {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                          <span className="text-gray-500">Loading...</span>
                        </div>
                      )}
                      {avatarSrc ? (
                        <Image 
                          src={avatarSrc} 
                          alt={`${userData?.username || 'User'}'s avatar`} 
                          width={144}
                          height={144}
                          className={`w-full h-full object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                          loading="lazy"
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => {
                            console.error("Image failed to load:", avatarSrc);
                            setAvatarSrc("");
                            setIsImageLoading(false);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Add profile change icon */}
                  <button 
                    className="absolute -bottom-2 right-2 bg-white border-2 border-gray-300 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
                    onClick={handleOpenModal}
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0 sm:items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{userData?.username || "User"}</h1>
                      <p className="text-sm text-gray-500 mt-1">{userData?.email}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <MapPin className="h-5 w-5" />
                        <span>{userData?.location || "Unknown location"}</span>
                      </div>
                      <div className="flex items-center gap-6 mt-3 text-sm">
                        <div className="text-center">
                          <span className="font-semibold text-foreground">{followerCount}</span>
                          <p className="text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                          <span className="font-semibold text-foreground">{followingCount}</span>
                          <p className="text-gray-500">Following</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-200/50 rounded-lg text-sm font-medium text-foreground hover:bg-accent/50"
                        onClick={handleOpenModal}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-200/50 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                      

                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 leading-relaxed">{userData?.bio || "No bio available"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-background border border-gray-200/30 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Failed Experience
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {userData?.failedExperience?.map((experience, index) => (
                      <li key={index} className="text-sm text-gray-500">• {experience}</li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-background border border-gray-200/30 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Mis-Education
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {userData?.misEducation?.map((education, index) => (
                      <li key={index} className="text-sm text-gray-500">• {education}</li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5" />
                  Failure Highlights
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {userData?.failureHighlights?.map((highlight, index) => (
                    <span key={index} className="px-4 py-1.5 bg-gray-100/50 rounded-full text-sm text-gray-900">
                      {highlight}
                    </span>
                  ))}
                </div> 
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4">Your Posts</h3>
                <div className="space-y-5">
                  {posts.length === 0 ? (
                    <p className="text-sm text-gray-500">No posts yet</p>
                  ) : (
                    posts.map((post) => (
                      <Card key={post.id} className="p-6 bg-background border border-gray-200/30 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-900">{post.title}</h4>
                        <p className="text-sm text-gray-500 mt-2">{post.content}</p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card> 
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ margin: 0 }}
            >
              <motion.div
                className="bg-white border border-gray-200/30 rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>
                    <button 
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-accent/50"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-900">
                            Name
                          </label>
                          <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                            value={edit.username}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-900">
                            Location
                          </label>
                          <input
                            id="location"
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                            value={edit.location}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium mb-2 text-gray-900">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={4}
                            spellCheck="false"
                            className="w-full px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                            value={edit.bio}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900">
                            Profile Picture
                          </label>
                          <div className="flex items-center gap-4">
                            {preview ? (
                              <Image
                                src={preview}
                                alt="Profile Preview"
                                width={80}
                                height={80}
                                loading="lazy"
                                className="w-20 h-20 object-cover rounded-full border border-gray-400"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-400">
                                <User className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <label className="block text-sm px-4 py-2 border border-gray-400 rounded-lg hover:bg-accent/50 cursor-pointer text-center">
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  accept="image/*"
                                />
                                Choose File
                              </label>
                              <p className="text-xs text-gray-500 truncate">
                                {file ? file.name : "No file selected"}
                              </p>
                              {file && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-3 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                  onClick={uploadFile}
                                  disabled={isUploading}
                                >
                                  {isUploading ? "Uploading..." : "Upload Picture"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label htmlFor="failedExperience" className="block text-sm font-medium mb-2 text-gray-900">
                            Failed Experience
                          </label>
                          <div className="space-y-3">
                            {edit.failedExperience?.map((experience, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={experience}
                                  onChange={(e) => handleArrayEdit('failedExperience', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 p-2"
                                  onClick={() => handleRemoveArrayItem('failedExperience', index)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 px-4 py-2 border border-gray-200/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('failedExperience')}
                            >
                              Add Experience
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="misEducation" className="block text-sm font-medium mb-2 text-gray-900">
                            Mis-Education
                          </label>
                          <div className="space-y-3">
                            {edit.misEducation?.map((education, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={education}
                                  onChange={(e) => handleArrayEdit('misEducation', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 p-2"
                                  onClick={() => handleRemoveArrayItem('misEducation', index)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 px-4 py-2 border border-gray-200/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('misEducation')}
                            >
                              Add Education
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="failureHighlights" className="block text-sm font-medium mb-2 text-gray-900">
                            Failure Highlights
                          </label>
                          <div className="space-y-3">
                            {edit.failureHighlights?.map((highlight, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={highlight}
                                  onChange={(e) => handleArrayEdit('failureHighlights', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-0 focus:border-black outline-none"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 p-2"
                                  onClick={() => handleRemoveArrayItem('failureHighlights', index)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 px-4 py-2 border border-gray-200/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('failureHighlights')}
                            >
                              Add Highlight
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/30">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 border border-gray-400 rounded-lg text-sm font-medium text-gray-900 hover:bg-accent/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 flex items-center gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : 'Save'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
