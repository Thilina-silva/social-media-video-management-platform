import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { StorageService } from '../services/storage';
import { VideoPost } from '../types';

const Videos: React.FC = () => {
  const [videos, setVideos] = React.useState<VideoPost[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<VideoPost | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    platforms: [] as string[],
  });

  React.useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const storedVideos = StorageService.getVideoPosts();
    setVideos(storedVideos);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const videoUrl = reader.result as string;
        const newVideo: VideoPost = {
          id: Date.now().toString(),
          title: file.name,
          description: '',
          videoUrl,
          thumbnailUrl: '', // You would typically generate this from the video
          scheduledDate: new Date().toISOString(),
          status: 'draft',
          platforms: [],
        };
        StorageService.saveVideoPost(newVideo);
        loadVideos();
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
  });

  const handleOpenDialog = (video?: VideoPost) => {
    if (video) {
      setSelectedVideo(video);
      setFormData({
        title: video.title,
        description: video.description,
        platforms: video.platforms,
      });
    } else {
      setSelectedVideo(null);
      setFormData({
        title: '',
        description: '',
        platforms: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  const handleSave = () => {
    if (selectedVideo) {
      const updatedVideo = {
        ...selectedVideo,
        ...formData,
      };
      StorageService.saveVideoPost(updatedVideo);
    }
    handleCloseDialog();
    loadVideos();
  };

  const handleDelete = (videoId: string) => {
    StorageService.deleteVideoPost(videoId);
    loadVideos();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Videos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Video
        </Button>
      </Box>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          mb: 3,
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? 'Drop the video here'
            : 'Drag and drop a video here, or click to select'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card>
              <CardMedia
                component="video"
                height="200"
                src={video.videoUrl}
                controls
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {video.status}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(video)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(video.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton>
                  <ScheduleIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedVideo ? 'Edit Video' : 'Add New Video'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={formData.platforms}
              onChange={(e) => setFormData({ ...formData, platforms: e.target.value as string[] })}
              label="Platforms"
            >
              <MenuItem value="youtube">YouTube</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Videos; 