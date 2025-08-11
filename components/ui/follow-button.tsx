"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FollowButton({ 
  targetUserId, 
  isFollowing, 
  onFollowChange,
  size = 'sm',
  variant = 'outline'
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const { currentUser } = useAuth();

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please log in to follow users');
      return;
    }

    setLoading(true);
    
    try {
      const action = following ? 'unfollow' : 'follow';
      
      // Get the authentication token
      const token = await currentUser.getIdToken();
      
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId,
          action
        }),
      });

      if (response.ok) {
        const newFollowingState = !following;
        setFollowing(newFollowingState);
        onFollowChange?.(newFollowingState);
        
        toast.success(`Successfully ${action}ed user!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={loading}
      className={`${following ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}`}
    >
      {following ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          {loading ? 'Unfollowing...' : 'Unfollow'}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? 'Following...' : 'Follow'}
        </>
      )}
    </Button>
  );
}