"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Bell, User, Briefcase, LogOut, Settings, HelpCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { motion } from "framer-motion";
import { MdLogin } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (pathname === "/") return null;

  return (
    <nav className="border-b bg-background text-foreground relative z-50">
      <div className="container flex h-14 justify-between mx-[10%] items-center md:mx-auto">
        <div className="flex md:mr-4">
          <Link href="/" className="flex items-center space-x-2 md:mr-4">
            <span className="font-bold text-xl ml-4 text-foreground">Fail U Forward</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center space-x-2 md:justify-end">
          <div className="hidden items-center space-x-4 md:flex">
            {loggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" title="Menu">
                      <Home className="h-[1.2rem] w-[1.2rem] text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                 <DropdownMenuContent
  align="end"
  className="w-56 rounded-lg border bg-card text-card-foreground backdrop-blur-2xl"
>

                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/feed">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <Home className="mr-2 h-4 w-4 text-foreground" />
                        <span>Feed</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/network">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <Briefcase className="mr-2 h-4 w-4 text-foreground" />
                        <span>Network</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/create-post">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <Plus className="mr-2 h-4 w-4 text-foreground" />
                        <span>Create Post</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" title="User">
                      <User className="h-[1.2rem] w-[1.2rem] text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 rounded-lg border bg-card text-card-foreground backdrop-blur-2xl">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <User className="mr-2 h-4 w-4 text-foreground" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <Settings className="mr-2 h-4 w-4 text-foreground" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/help">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <HelpCircle className="mr-2 h-4 w-4 text-foreground" />
                        <span>Help</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4 text-foreground" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ThemeToggle />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" className="bg-foreground text-background hover:bg-muted">
                    <MdLogin className="mr-1" /> Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-foreground text-background hover:bg-muted mr-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {loggedIn ? (
            <div className="inline-flex items-center justify-center w-screen md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 h-10 text-foreground rounded-lg"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </motion.button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 justify-center w-[70vw] md:hidden">
              <Link href="/login">
                <Button size="sm" className="bg-foreground text-background hover:bg-muted">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-foreground text-background hover:bg-muted">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div
        className={`
          ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} 
          md:hidden 
          fixed 
          top-14 
          left-0 
          w-full 
          z-50 
          transition-all 
          duration-500 
          overflow-hidden
        `}
        id="navbar-hamburger"
      >
        <ul className="bg-card flex flex-col text-center uppercase font-extrabold text-card-foreground">
          <li>
            <Link
              href="/feed"
              className="block py-2 px-3 rounded hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
          </li>
          <li>
            <Link
              href="/network"
              className="block py-2 px-3 rounded hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Network
            </Link>
          </li>
          <li>
            {loggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 px-3 rounded hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 px-3 rounded w-full hover:bg-muted transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 px-3 rounded hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
