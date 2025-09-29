# Technical Documentation

## Extension Architecture

### Manifest V3 Structure

The extension uses Chrome Extension Manifest V3 with the following key components:

```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup/popup.html"
  },
  "content_scripts": [
    {
      "matches": ["https://www.hellowork.com/*"],
      "js": ["scripts/content.js"],
      "css": ["style.css"]
    }
  ],
  "permissions": ["storage"]
}
```

## Component Details

### Background Service Worker (`background.js`)

**Purpose**: Handles API communications and secure storage operations.

**Key Functions**:

- `chrome.runtime.onMessage.addListener()`: Main message handler
- Token storage/retrieval using Chrome Storage API
- France Travail API communication

**Message Actions**:

- `getToken`: Retrieves stored authentication token
- `saveToken`: Securely stores authentication token
- `submitOffer`: Submits job application data to France Travail API

**API Integration**:

```javascript
// France Travail API Endpoint
const API_URL = "https://api.francetravail.fr/exp-demarcheretouremploi/v2/demarches";

// Required headers
{
  "authorization": `Bearer ${token}`,
  "content-type": "application/json;charset=UTF-8",
  "pe-nom-application": "pn118-dreusager",
  "typeauth": "/individu"
}
```

### Content Script (`scripts/content.js`)

**Purpose**: Injects floating UI on supported job sites.

**Key Components**:

1. **Site Detection & Data Extraction**:

   ```javascript
   function extractOffer() {
     // Extracts company name and job title from page DOM
     // Currently supports HelloWork
   }
   ```

2. **UI State Management**:

   ```javascript
   function updateButtonState(state, text) {
     // Manages: loading, success, error, default states
   }
   ```

3. **Form Handling**:
   ```javascript
   function handleSubmit(formData) {
     // Communicates with background script for API submission
   }
   ```

**UI States**:

- **Collapsed**: 48x48px floating button
- **Expanded**: 300x250px form container
- **Loading**: Shows spinner and disables interaction
- **Success**: Shows checkmark and auto-collapses
- **Error**: Shows error icon with retry capability

### Popup Interface (`popup/`)

**Purpose**: Configuration interface for token management.

**Components**:

- `popup.html`: Simple form with token input field
- `popup.js`: Handles token validation, storage, and user feedback

**User Flow**:

1. User clicks extension icon
2. Popup opens with token input field
3. User pastes France Travail authentication token
4. Token is validated and stored securely
5. Success confirmation displayed

## Data Flow

```
User Action → Content Script → Background Script → France Travail API
     ↓              ↓                ↓                    ↓
  UI Update ← Message Response ← API Response ← HTTP Response
```

### Message Passing Protocol

**Content Script → Background**:

```javascript
chrome.runtime.sendMessage({
  action: "submitOffer",
  data: {
    token: "Bearer xxx...",
    formData: { enterprise: "...", jobTitle: "..." },
    dateString: "2025-09-30T02:00:00+02:00",
  },
});
```

**Background → Content Script**:

```javascript
sendResponse({
  success: true,
  error: null, // or error message
});
```

## Security Considerations

### Token Storage

- Tokens stored using `chrome.storage.local` API
- No transmission to third-party services
- Automatic cleanup on extension removal

### API Communication

- HTTPS-only communication with France Travail
- No data persistence on external servers
- CORS handled by background script context

### Content Script Isolation

- Runs in isolated context from page scripts
- No access to page's global variables
- Secure message passing only

## Browser Compatibility

**Supported**:

- Chrome 88+ (Manifest V3)
- Chromium-based browsers (Edge, Brave, Opera)

**Not Supported**:

- Firefox (uses different extension API)
- Safari (different extension system)

## Development Workflow

### Local Development

1. Load unpacked extension in Chrome
2. Enable Developer mode
3. Use Chrome DevTools for debugging

### Debugging

- Background script: `chrome://extensions` → Inspect views
- Content script: Regular DevTools on target page
- Popup: Right-click extension icon → Inspect popup

### Testing

- Manual testing on supported job sites
- Token validation with real France Travail API
- Error handling for network failures

## Performance Considerations

### Memory Usage

- Minimal background script footprint
- Content script only loads on matched sites
- No persistent DOM listeners

### Network Efficiency

- Single API call per submission
- Minimal payload size
- Error retry logic prevents spam

### UI Responsiveness

- CSS transitions for smooth animations
- Non-blocking API calls
- Immediate visual feedback

## Error Handling

### Common Errors

1. **Invalid Token**: User feedback + retry mechanism
2. **Network Failure**: Automatic retry with exponential backoff
3. **API Rate Limiting**: User notification + delay
4. **Missing Data**: Form validation before submission

### Error Recovery

- Local storage fallback for token issues
- UI state reset on errors
- Graceful degradation for unsupported sites

## Future Enhancements

### Planned Features

- Support for additional job sites
- Bulk submission capabilities
- Advanced form pre-filling
- Export/import functionality

### Technical Improvements

- TypeScript migration
- Unit test coverage
- Automated E2E testing
- Performance monitoring

## API Documentation

### France Travail API Schema

**Request Body Structure**:

```json
{
  "debut": "ISO 8601 datetime",
  "fin": "ISO 8601 datetime",
  "pourquoi": {
    "code": "P03",
    "libelle": "Mes candidatures"
  },
  "quoi": {
    "code": "Q14",
    "libelle": "Réponse à des offres d'emploi"
  },
  "attributs": [
    {
      "libelle": "Nom de l'entreprise",
      "type": "TEXTE",
      "valeur": "Company name"
    },
    {
      "libelle": "Nom du métier",
      "type": "TEXTE",
      "valeur": "Job title"
    }
  ]
}
```

**Response Format**:

```json
{
  "success": boolean,
  "id": "unique_submission_id",
  "timestamp": "ISO 8601 datetime"
}
```
