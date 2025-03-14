import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Comment as CommentsIcon,
  Share as SharesIcon,
} from '@mui/icons-material';
import { StorageService } from '../services/storage';
import { VideoPost } from '../types';

const Analytics: React.FC = () => {
  const [videos, setVideos] = React.useState<VideoPost[]>([]);
  const [timeRange, setTimeRange] = React.useState('7d');
  const [platform, setPlatform] = React.useState('all');

  React.useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const storedVideos = StorageService.getVideoPosts();
    setVideos(storedVideos);
  };

  const getFilteredVideos = () => {
    return videos.filter((video) => {
      if (platform === 'all') return true;
      return video.platforms.includes(platform);
    });
  };

  const getTotalStats = () => {
    const filteredVideos = getFilteredVideos();
    return filteredVideos.reduce(
      (acc, video) => {
        if (video.analytics) {
          acc.views += video.analytics.views;
          acc.likes += video.analytics.likes;
          acc.comments += video.analytics.comments;
          acc.shares += video.analytics.shares;
          acc.engagementRate += video.analytics.engagementRate;
        }
        return acc;
      },
      { views: 0, likes: 0, comments: 0, shares: 0, engagementRate: 0 }
    );
  };

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
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  const stats = getTotalStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platform}
            label="Platform"
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value="all">All Platforms</MenuItem>
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Views"
            value={stats.views}
            icon={<ViewsIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Likes"
            value={stats.likes}
            icon={<LikesIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Comments"
            value={stats.comments}
            icon={<CommentsIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Shares"
            value={stats.shares}
            icon={<SharesIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Video Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell align="right">Views</TableCell>
                <TableCell align="right">Likes</TableCell>
                <TableCell align="right">Comments</TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">Engagement Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredVideos().map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.platforms.join(', ')}</TableCell>
                  <TableCell align="right">
                    {video.analytics?.views.toLocaleString() || 0}
                  </TableCell>
                  <TableCell align="right">
                    {video.analytics?.likes.toLocaleString() || 0}
                  </TableCell>
                  <TableCell align="right">
                    {video.analytics?.comments.toLocaleString() || 0}
                  </TableCell>
                  <TableCell align="right">
                    {video.analytics?.shares.toLocaleString() || 0}
                  </TableCell>
                  <TableCell align="right">
                    {video.analytics?.engagementRate.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Analytics; 