import { SocialMediaAccount } from '../types';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
}

const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL}/oauth/youtube/callback`,
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL}/oauth/instagram/callback`,
    scope: ['instagram_basic', 'instagram_content_publish'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL}/oauth/twitter/callback`,
    scope: ['tweet.read', 'tweet.write', 'users.read'],
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: `${process.env.APP_URL}/oauth/facebook/callback`,
    scope: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
};

export const OAuthService = {
  getAuthUrl: (platform: string): string => {
    const config = OAUTH_CONFIGS[platform];
    if (!config) throw new Error(`Unsupported platform: ${platform}`);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope.join(' '),
      state: Math.random().toString(36).substring(7),
    });

    return `${config.authUrl}?${params.toString()}`;
  },

  handleCallback: async (platform: string, code: string): Promise<SocialMediaAccount> => {
    const config = OAUTH_CONFIGS[platform];
    if (!config) throw new Error(`Unsupported platform: ${platform}`);

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const userData = await OAuthService.getUserData(platform, tokenData.access_token);

    return {
      id: Date.now().toString(),
      platform,
      username: userData.username || userData.name,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
    };
  },

  getUserData: async (platform: string, accessToken: string): Promise<any> => {
    const endpoints: Record<string, string> = {
      youtube: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      instagram: 'https://graph.instagram.com/me?fields=id,username',
      twitter: 'https://api.twitter.com/2/users/me',
      facebook: 'https://graph.facebook.com/v18.0/me',
    };

    const response = await fetch(endpoints[platform], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user data: ${response.statusText}`);
    }

    return response.json();
  },

  refreshToken: async (account: SocialMediaAccount): Promise<SocialMediaAccount> => {
    const config = OAUTH_CONFIGS[account.platform];
    if (!config) throw new Error(`Unsupported platform: ${account.platform}`);

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: account.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const tokenData = await response.json();

    return {
      ...account,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || account.refreshToken,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
    };
  },
}; 