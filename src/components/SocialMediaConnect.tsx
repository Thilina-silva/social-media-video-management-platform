import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { OAuthService } from '../services/oauth';
import { SocialMediaAccount } from '../types';
import { StorageService } from '../services/storage';

interface SocialMediaConnectProps {
  onAccountConnected?: (account: SocialMediaAccount) => void;
}

const SocialMediaConnect: React.FC<SocialMediaConnectProps> = ({ onAccountConnected }) => {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = React.useState<SocialMediaAccount[]>([]);

  React.useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = () => {
    const accounts = StorageService.getSocialAccounts();
    setConnectedAccounts(accounts);
  };

  const handleConnect = async (platform: string) => {
    try {
      setLoading(platform);
      const authUrl = OAuthService.getAuthUrl(platform);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      setLoading(null);
    }
  };

  const handleCallback = async (platform: string, code: string) => {
    try {
      const account = await OAuthService.handleCallback(platform, code);
      StorageService.saveSocialAccount(account);
      loadConnectedAccounts();
      onAccountConnected?.(account);
    } catch (error) {
      console.error(`Failed to handle ${platform} callback:`, error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTubeIcon sx={{ color: '#FF0000' }} />;
      case 'instagram':
        return <InstagramIcon sx={{ color: '#E4405F' }} />;
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'facebook':
        return <FacebookIcon sx={{ color: '#1877F2' }} />;
      default:
        return null;
    }
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Connect Social Media Accounts
      </Typography>
      <Grid container spacing={2}>
        {platforms.map((platform) => {
          const isConnected = connectedAccounts.some(
            (account) => account.platform === platform.id
          );
          const connectedAccount = connectedAccounts.find(
            (account) => account.platform === platform.id
          );

          return (
            <Grid item xs={12} sm={6} md={3} key={platform.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getPlatformIcon(platform.id)}
                    <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                      {platform.name}
                    </Typography>
                  </Box>
                  {isConnected ? (
                    <Typography variant="body2" color="text.secondary">
                      Connected as: {connectedAccount?.username}
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleConnect(platform.id)}
                      disabled={loading === platform.id}
                    >
                      {loading === platform.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SocialMediaConnect; 