# Changelog

All notable changes to the France Travail Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation (README, TECHNICAL docs)
- Inline code documentation
- JSDoc type annotations

### Changed

- Improved code organization and structure
- Enhanced error handling and user feedback

## [1.0.0] - 2025-09-30

### Added

- Initial release of France Travail Extension
- Floating UI button on HelloWork.com
- Token-based authentication with France Travail API
- Automatic job application submission
- Popup interface for token configuration
- Real-time status updates (loading, success, error)
- Form validation and error handling
- Responsive design with smooth animations

### Features

- **Supported Sites**: HelloWork (hellowork.com)
- **Authentication**: Bearer token storage via Chrome Storage API
- **UI States**: Collapsed/expanded button with form overlay
- **API Integration**: Direct submission to France Travail API
- **User Experience**: One-click job application logging

### Technical

- Chrome Extension Manifest V3
- Service Worker background script
- Content script injection on specific domains
- Secure local storage for authentication tokens
- Cross-origin API requests via background script
- Message passing between components

### Security

- Secure token storage using Chrome Storage API
- HTTPS-only API communication
- No third-party data transmission
- Content script isolation

## Development Notes

### Architecture Decisions

- **Manifest V3**: Future-proof extension structure
- **Service Worker**: Background processing for API calls
- **Content Script**: Minimal DOM manipulation
- **Message Passing**: Secure component communication

### Browser Support

- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, Opera)

### Known Limitations

- Currently supports HelloWork only
- Requires manual token configuration
- Single job site per submission

## Future Roadmap

### Version 1.1.0 (Planned)

- [ ] Support for additional job sites (Welcome to the Jungle, Indeed)
- [ ] Automatic token refresh mechanism
- [ ] Bulk submission capabilities
- [ ] Enhanced form pre-filling

### Version 1.2.0 (Planned)

- [ ] Export/import functionality
- [ ] Advanced filtering options
- [ ] Custom field mappings
- [ ] Analytics dashboard

### Version 2.0.0 (Planned)

- [ ] TypeScript migration
- [ ] Unit test coverage
- [ ] Automated E2E testing
- [ ] Performance optimizations
- [ ] Multi-language support
