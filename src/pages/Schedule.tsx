import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StorageService } from '../services/storage';
import { VideoPost } from '../types';

const Schedule: React.FC = () => {
  const [videos, setVideos] = React.useState<VideoPost[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<VideoPost | null>(null);
  const [scheduledDate, setScheduledDate] = React.useState<Date | null>(new Date());

  React.useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const storedVideos = StorageService.getVideoPosts();
    setVideos(storedVideos);
  };

  const handleOpenDialog = (video: VideoPost) => {
    setSelectedVideo(video);
    setScheduledDate(new Date(video.scheduledDate));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  const handleSaveSchedule = () => {
    if (selectedVideo && scheduledDate) {
      const updatedVideo = {
        ...selectedVideo,
        scheduledDate: scheduledDate.toISOString(),
        status: 'scheduled',
      };
      StorageService.saveVideoPost(updatedVideo);
      loadVideos();
    }
    handleCloseDialog();
  };

  const getVideosForDate = (date: Date) => {
    return videos.filter((video) => {
      const videoDate = new Date(video.scheduledDate);
      return (
        videoDate.getDate() === date.getDate() &&
        videoDate.getMonth() === date.getMonth() &&
        videoDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule Videos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calendar View
            </Typography>
            {/* Calendar component would go here */}
            <Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Calendar View (To be implemented)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scheduled Videos
            </Typography>
            {videos
              .filter((video) => video.status === 'scheduled')
              .map((video) => (
                <Card key={video.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled for: {new Date(video.scheduledDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Platforms: {video.platforms.join(', ')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(video)}
                    >
                      Reschedule
                    </Button>
                  </CardActions>
                </Card>
              ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Schedule Video</DialogTitle>
        <DialogContent>
          {selectedVideo && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedVideo.title}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Schedule Date & Time"
                  value={scheduledDate}
                  onChange={(newValue) => setScheduledDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
              </LocalizationProvider>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained">
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule; 