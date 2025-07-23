"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, MapPin, Building2, GraduationCap, ThumbsDown, LogOut, User, Trash2, X } from "lucide-react";
import { doc, getDoc, collection, query, getDocs, updateDoc } from "firebase/firestore";
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
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
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
  const router = useRouter();
  const fetchUserData = useCallback(async () => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
    
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);
    
      if (docSnap.exists()) {
        const fetchedUserData = docSnap.data() as UserData;
        setUserData(fetchedUserData);
        
        setEdit({
          username: fetchedUserData.username || "",
          email: fetchedUserData.email || "",
          location: fetchedUserData.location || "",
          bio: fetchedUserData.bio || "",
          profilepic: fetchedUserData.profilepic || "",
          failedExperience: fetchedUserData.failedExperience || [],
          misEducation: fetchedUserData.misEducation || [],
          failureHighlights: fetchedUserData.failureHighlights || []
        });
      } else {
        console.error("No user document found!");
        setUserData(null);
      }
    
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
      console.error("Error fetching user data or posts:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
}, [router]);
    
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
      failedExperience: userData?.failedExperience || [],
      misEducation: userData?.misEducation || [],
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

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;

        if (!user) {
          toast.error("No authenticated user found");
          return;
        }

        setEdit(prev => ({ ...prev, profilepic: data.url }));
        setPreview(null);
        setFile(null);
        toast.success("Profile picture uploaded successfully!");
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("No authenticated user found");
      return;
    }
  
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        username: edit.username,
        bio: edit.bio,
        location: edit.location,
        profilepic: edit.profilepic || userData?.profilepic,
        failedExperience: edit.failedExperience,
        misEducation: edit.misEducation,
        failureHighlights: edit.failureHighlights
      });
  
      setUserData(prev => ({
        ...prev!,
        username: edit.username,
        bio: edit.bio,
        location: edit.location,
        profilepic: edit.profilepic || prev?.profilepic,
        failedExperience: edit.failedExperience,
        misEducation: edit.misEducation,
        failureHighlights: edit.failureHighlights
      }));
  
      toast.success("Profile successfully updated!");
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white"/>
    </div>
  );

  const avatarSrc = userData?.profilepic || 
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative bg-background border border-border/30 rounded-xl shadow-lg">
            <div className="h-36 bg-gradient-to-r from-red-500 to-red-700 rounded-t-xl"></div>
            <div className="p-8">
              <div className="flex items-start mb-6">
                <Avatar className="w-36 h-36 mr-6">
                  <AvatarImage 
                    src={avatarSrc} 
                    alt={`${userData?.username || 'User'}'s avatar`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <AvatarFallback className="w-full h-full flex items-center justify-center bg-muted text-2xl font-semibold text-muted-foreground">
                    {userData?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0 sm:items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{userData?.username || "User"}</h1>
                      <p className="text-sm text-muted-foreground mt-1">{userData?.email}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{userData?.location || "Unknown location"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto px-5 py-2.5 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-accent/50"
                        onClick={handleOpenModal}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full sm:w-auto px-5 py-2.5 border border-border/50 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{userData?.bio || "No bio available"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-background border border-border/30 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Failed Experience
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {userData?.failedExperience?.map((experience, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {experience}</li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-background border border-border/30 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Mis-Education
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {userData?.misEducation?.map((education, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {education}</li>
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
                    <span key={index} className="px-4 py-1.5 bg-muted/50 rounded-full text-sm text-foreground">
                      {highlight}
                    </span>
                  ))}
                </div> 
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4">Your Posts</h3>
                <div className="space-y-5">
                  {posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No posts yet</p>
                  ) : (
                    posts.map((post) => (
                      <Card key={post.id} className="p-6 bg-background border border-border/30 rounded-lg">
                        <h4 className="font-semibold text-lg text-foreground">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-2">{post.content}</p>
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
                className="bg-background border border-border/30 rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto"
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
                      className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent/50"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium mb-2 text-foreground">
                            Name
                          </label>
                          <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            value={edit.username}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium mb-2 text-foreground">
                            Location
                          </label>
                          <input
                            id="location"
                            type="text"
                            className="w-full px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            value={edit.location}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium mb-2 text-foreground">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={4}
                            className="w-full px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            value={edit.bio}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="profilepic" className="block text-sm font-medium mb-2 text-foreground">
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
                                className="w-20 h-20 object-cover rounded-full border border-border/50"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border border-border/50">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <input
                                id="profilepic"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                              />
                              <label
                                htmlFor="profilepic"
                                className="block text-sm px-4 py-2 border border-border/50 rounded-lg hover:bg-accent/50 cursor-pointer text-center"
                              >
                                Choose File
                              </label>
                              <p className="text-xs text-muted-foreground truncate">
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
                          <label htmlFor="failedExperience" className="block text-sm font-medium mb-2 text-foreground">
                            Failed Experience
                          </label>
                          <div className="space-y-3">
                            {edit.failedExperience?.map((experience, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={experience}
                                  onChange={(e) => handleArrayEdit('failedExperience', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
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
                              className="w-full mt-3 px-4 py-2 border border-border/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('failedExperience')}
                            >
                              Add Experience
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="misEducation" className="block text-sm font-medium mb-2 text-foreground">
                            Mis-Education
                          </label>
                          <div className="space-y-3">
                            {edit.misEducation?.map((education, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={education}
                                  onChange={(e) => handleArrayEdit('misEducation', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
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
                              className="w-full mt-3 px-4 py-2 border border-border/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('misEducation')}
                            >
                              Add Education
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="failureHighlights" className="block text-sm font-medium mb-2 text-foreground">
                            Failure Highlights
                          </label>
                          <div className="space-y-3">
                            {edit.failureHighlights?.map((highlight, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  value={highlight}
                                  onChange={(e) => handleArrayEdit('failureHighlights', index, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-border/50 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
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
                              className="w-full mt-3 px-4 py-2 border border-border/50 rounded-lg hover:bg-accent/50 text-sm font-medium"
                              onClick={() => handleAddArrayItem('failureHighlights')}
                            >
                              Add Highlight
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 border-t border-border/30">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-accent/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                      >
                        Save
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