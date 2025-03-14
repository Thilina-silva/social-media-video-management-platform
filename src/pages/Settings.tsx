import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Divider,
  MenuItem,
  Button,
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { StorageService } from '../services/storage';
import { SocialMediaAccount } from '../types';

const Settings: React.FC = () => {
  const [socialAccounts, setSocialAccounts] = React.useState<SocialMediaAccount[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<SocialMediaAccount | null>(null);
  const [formData, setFormData] = React.useState({
    platform: '',
    username: '',
    accessToken: '',
    refreshToken: '',
  });

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const accounts = StorageService.getSocialAccounts();
    setSocialAccounts(accounts);
  };

  const handleOpenDialog = (account?: SocialMediaAccount) => {
    if (account) {
      setSelectedAccount(account);
      setFormData({
        platform: account.platform,
        username: account.username,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
      });
    } else {
      setSelectedAccount(null);
      setFormData({
        platform: '',
        username: '',
        accessToken: '',
        refreshToken: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
  };

  const handleSaveAccount = () => {
    const account: SocialMediaAccount = {
      id: selectedAccount?.id || Date.now().toString(),
      platform: formData.platform as 'youtube' | 'instagram' | 'twitter',
      username: formData.username,
      accessToken: formData.accessToken,
      refreshToken: formData.refreshToken,
    };

    StorageService.saveSocialAccount(account);
    loadSettings();
    handleCloseDialog();
  };

  const handleDeleteAccount = (accountId: string) => {
    StorageService.deleteSocialAccount(accountId);
    loadSettings();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTubeIcon sx={{ color: '#FF0000' }} />;
      case 'instagram':
        return <InstagramIcon sx={{ color: '#E4405F' }} />;
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Social Media Accounts</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Account
              </Button>
            </Box>
            <List>
              {socialAccounts.map((account) => (
                <React.Fragment key={account.id}>
                  <ListItem>
                    <ListItemIcon>{getPlatformIcon(account.platform)}</ListItemIcon>
                    <ListItemText
                      primary={account.username}
                      secondary={account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog(account)}
                        sx={{ mr: 1 }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications about video performance"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Auto-publish"
                  secondary="Automatically publish videos at scheduled times"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Analytics Reports"
                  secondary="Receive weekly analytics reports"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedAccount ? 'Edit Account' : 'Add Social Media Account'}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Platform"
            fullWidth
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          >
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Access Token"
            fullWidth
            type="password"
            value={formData.accessToken}
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Refresh Token"
            fullWidth
            type="password"
            value={formData.refreshToken}
            onChange={(e) => setFormData({ ...formData, refreshToken: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAccount} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 