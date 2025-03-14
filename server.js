const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// OAuth callback endpoints
app.get('/oauth/:platform/callback', (req, res) => {
  const { platform } = req.params;
  const { code, error } = req.query;

  if (error) {
    // Handle OAuth error
    res.redirect(`/?error=${encodeURIComponent(error)}`);
    return;
  }

  if (!code) {
    res.redirect('/?error=No authorization code received');
    return;
  }

  // Redirect back to the app with the authorization code
  res.redirect(`/?platform=${platform}&code=${code}`);
});

// Ping endpoint to keep the site active
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 