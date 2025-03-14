import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { StorageService } from '../services/storage';
import { VideoPost } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalVideos: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
  });

  const [recentVideos, setRecentVideos] = React.useState<VideoPost[]>([]);

  React.useEffect(() => {
    const videos = StorageService.getVideoPosts();
    setStats({
      totalVideos: videos.length,
      scheduledPosts: videos.filter(v => v.status === 'scheduled').length,
      publishedPosts: videos.filter(v => v.status === 'published').length,
      failedPosts: videos.filter(v => v.status === 'failed').length,
    });
    
    // Get the 5 most recent videos
    setRecentVideos(videos.sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    ).slice(0, 5));
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Videos"
            value={stats.totalVideos}
            icon={<VideoIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scheduled"
            value={stats.scheduledPosts}
            icon={<ScheduleIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Published"
            value={stats.publishedPosts}
            icon={<TrendingIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Failed"
            value={stats.failedPosts}
            icon={<WarningIcon sx={{ color: '#d32f2f' }} />}
            color="#d32f2f"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Videos
            </Typography>
            <List>
              {recentVideos.map((video) => (
                <ListItem key={video.id}>
                  <ListItemIcon>
                    <VideoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={video.title}
                    secondary={`Scheduled for ${new Date(video.scheduledDate).toLocaleString()} - ${video.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 