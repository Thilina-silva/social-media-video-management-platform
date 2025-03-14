# Social Media Video Management Platform

A client-side application for managing and scheduling video content across multiple social media platforms. This version uses local storage for data persistence and browser-based APIs for social media integration.

## Features

- **Video Management**
  - Upload and organize videos
  - Add descriptions and metadata
  - Preview videos before publishing
  - Support for multiple video formats

- **Social Media Integration**
  - Connect multiple social media accounts (YouTube, Instagram, Twitter)
  - OAuth-based authentication
  - Platform-specific video optimization
  - Secure credential storage

- **Content Scheduling**
  - Calendar-based scheduling interface
  - Bulk scheduling capabilities
  - Schedule preview and management
  - Automatic publishing at scheduled times

- **Analytics & Reporting**
  - Real-time performance tracking
  - Platform-specific metrics
  - Engagement rate calculation
  - Customizable reporting periods
  - Export analytics data

- **User Settings**
  - Account preferences
  - Notification settings
  - Platform-specific configurations
  - Subscription tier management

## Tech Stack

- React with TypeScript
- Material-UI for components
- Local Storage for data persistence
- Social Media Platform APIs
- Browser-based video processing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-video-management-platform.git
cd social-media-video-management-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── services/          # Business logic and API services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Social Media API Integration

The application integrates with the following social media platforms:

- YouTube Data API v3
- Instagram Graph API
- Twitter API

Each platform requires proper API credentials and OAuth setup. See the respective platform documentation for setup instructions.

## Data Storage

This version uses browser-based storage solutions:

- Local Storage for user settings and credentials
- IndexedDB for video metadata and analytics
- Browser's File API for video file handling

## Security Considerations

- OAuth tokens are stored securely in browser storage
- API credentials are never exposed in client-side code
- Video processing is done locally
- Regular token refresh for social media accounts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Social media platform APIs
- React community for tools and libraries 