import { VideoPost } from '../types';
import { StorageService } from './storage';
import { SocialMediaService } from './socialMedia';

export const VideoProcessorService = {
  processVideo: async (video: VideoPost): Promise<void> => {
    // This would handle video processing tasks like:
    // - Generating thumbnails
    // - Optimizing video format
    // - Adding watermarks
    // - Compressing video
    console.log('Processing video:', video.title);
  },

  scheduleVideo: async (video: VideoPost): Promise<void> => {
    const scheduledDate = new Date(video.scheduledDate);
    const now = new Date();
    
    if (scheduledDate < now) {
      throw new Error('Cannot schedule video for a past date');
    }

    // Store the scheduled video
    StorageService.saveVideoPost({
      ...video,
      status: 'scheduled',
    });

    // Set up a timeout to publish the video at the scheduled time
    const timeUntilPublish = scheduledDate.getTime() - now.getTime();
    setTimeout(async () => {
      try {
        await VideoProcessorService.publishVideo(video);
      } catch (error) {
        console.error('Failed to publish video:', error);
        StorageService.saveVideoPost({
          ...video,
          status: 'failed',
        });
      }
    }, timeUntilPublish);
  },

  publishVideo: async (video: VideoPost): Promise<void> => {
    try {
      // Get social media accounts for the video's platforms
      const accounts = StorageService.getSocialAccounts().filter(account =>
        video.platforms.includes(account.platform)
      );

      if (accounts.length === 0) {
        throw new Error('No social media accounts found for the selected platforms');
      }

      // Process the video before publishing
      await VideoProcessorService.processVideo(video);

      // Upload to all selected platforms
      const videoIds = await SocialMediaService.uploadToAllPlatforms(video, accounts);

      // Update video status and store platform-specific IDs
      StorageService.saveVideoPost({
        ...video,
        status: 'published',
        platformIds: videoIds,
      });

      // Start tracking analytics
      VideoProcessorService.startAnalyticsTracking(video.id, accounts);
    } catch (error) {
      console.error('Error publishing video:', error);
      throw error;
    }
  },

  startAnalyticsTracking: async (videoId: string, accounts: any[]): Promise<void> => {
    // Set up periodic analytics tracking
    const trackAnalytics = async () => {
      try {
        const analytics = await SocialMediaService.getAnalyticsForAllPlatforms(videoId, accounts);
        
        // Aggregate analytics from all platforms
        const aggregatedAnalytics = analytics.reduce((acc, curr) => ({
          views: acc.views + curr.views,
          likes: acc.likes + curr.likes,
          comments: acc.comments + curr.comments,
          shares: acc.shares + curr.shares,
          engagementRate: (acc.engagementRate + curr.engagementRate) / analytics.length,
        }), {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          engagementRate: 0,
        });

        // Update video with new analytics
        const video = StorageService.getVideoPosts().find(v => v.id === videoId);
        if (video) {
          StorageService.saveVideoPost({
            ...video,
            analytics: aggregatedAnalytics,
          });
        }
      } catch (error) {
        console.error('Error tracking analytics:', error);
      }
    };

    // Track analytics every hour
    setInterval(trackAnalytics, 60 * 60 * 1000);
    // Initial tracking
    trackAnalytics();
  },

  cancelScheduledVideo: (videoId: string): void => {
    const video = StorageService.getVideoPosts().find(v => v.id === videoId);
    if (video) {
      StorageService.saveVideoPost({
        ...video,
        status: 'draft',
      });
    }
  },

  rescheduleVideo: async (videoId: string, newDate: Date): Promise<void> => {
    const video = StorageService.getVideoPosts().find(v => v.id === videoId);
    if (video) {
      await VideoProcessorService.scheduleVideo({
        ...video,
        scheduledDate: newDate.toISOString(),
      });
    }
  },
}; 