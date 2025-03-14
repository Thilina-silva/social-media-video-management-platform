import { SocialMediaAccount, VideoPost, UserSettings } from '../types';

const STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',
  VIDEO_POSTS: 'video_posts',
  SOCIAL_ACCOUNTS: 'social_accounts',
};

export const StorageService = {
  // User Settings
  getUserSettings: (): UserSettings | null => {
    const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  },

  saveUserSettings: (settings: UserSettings): void => {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  },

  // Video Posts
  getVideoPosts: (): VideoPost[] => {
    const posts = localStorage.getItem(STORAGE_KEYS.VIDEO_POSTS);
    return posts ? JSON.parse(posts) : [];
  },

  saveVideoPost: (post: VideoPost): void => {
    const posts = StorageService.getVideoPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }
    
    localStorage.setItem(STORAGE_KEYS.VIDEO_POSTS, JSON.stringify(posts));
  },

  deleteVideoPost: (postId: string): void => {
    const posts = StorageService.getVideoPosts().filter(post => post.id !== postId);
    localStorage.setItem(STORAGE_KEYS.VIDEO_POSTS, JSON.stringify(posts));
  },

  // Social Media Accounts
  getSocialAccounts: (): SocialMediaAccount[] => {
    const accounts = localStorage.getItem(STORAGE_KEYS.SOCIAL_ACCOUNTS);
    return accounts ? JSON.parse(accounts) : [];
  },

  saveSocialAccount: (account: SocialMediaAccount): void => {
    const accounts = StorageService.getSocialAccounts();
    const existingIndex = accounts.findIndex(a => a.id === account.id);
    
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    
    localStorage.setItem(STORAGE_KEYS.SOCIAL_ACCOUNTS, JSON.stringify(accounts));
  },

  deleteSocialAccount: (accountId: string): void => {
    const accounts = StorageService.getSocialAccounts().filter(account => account.id !== accountId);
    localStorage.setItem(STORAGE_KEYS.SOCIAL_ACCOUNTS, JSON.stringify(accounts));
  },
}; 