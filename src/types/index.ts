export interface SocialMediaAccount {
  id: string;
  platform: 'youtube' | 'instagram' | 'twitter';
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface VideoPost {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platforms: string[];
  platformIds?: string[];
  analytics?: VideoAnalytics;
}

export interface VideoAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

export interface UserSettings {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'premium';
  maxVideos: number;
  socialAccounts: SocialMediaAccount[];
} 