# Contributing to France Travail Extension

Thank you for considering contributing to the France Travail Extension! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please check if it already exists. When creating a new issue:

1. **Use a clear and descriptive title**
2. **Provide detailed steps to reproduce**
3. **Include browser version and OS information**
4. **Add screenshots if applicable**
5. **Mention the job site where the issue occurred**

### Suggesting Features

Feature requests are welcome! Please provide:

1. **Clear description of the feature**
2. **Use case and motivation**
3. **Possible implementation approach**
4. **Any relevant mockups or examples**

## 🔧 Development Setup

### Prerequisites

- Google Chrome (latest version)
- Text editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension APIs

### Local Development

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/your-username/francetravail-extension.git
   cd francetravail-extension
   ```

2. **Load the extension in Chrome**:

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked" and select the project folder

3. **Make your changes**:
   - Edit the relevant files
   - Reload the extension in Chrome after changes
   - Test thoroughly on supported job sites

### Project Structure

```
francetravail-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (API calls, storage)
├── popup/
│   ├── popup.html        # Configuration interface
│   └── popup.js          # Popup logic
├── scripts/
│   └── content.js        # Injected script for job sites
├── style.css             # UI styles
├── images/               # Extension icons
└── docs/                 # Documentation
```

## 📝 Coding Standards

### JavaScript

- Use ES6+ features where appropriate
- Follow JSDoc conventions for documentation
- Use meaningful variable and function names
- Handle errors gracefully with user feedback

### CSS

- Use BEM methodology for class naming
- Maintain responsive design principles
- Use CSS custom properties for theming
- Keep specificity low

### Chrome Extension Best Practices

- Follow Manifest V3 guidelines
- Use service workers instead of background pages
- Implement proper error handling
- Respect user privacy and data

## 🧪 Testing

### Manual Testing

1. **Load the extension** in Chrome developer mode
2. **Visit supported job sites** (HelloWork, etc.)
3. **Test all UI states**: collapsed, expanded, loading, success, error
4. **Verify API integration** with valid France Travail token
5. **Test error scenarios**: invalid token, network failures

### Testing Checklist

- [ ] Extension loads without errors
- [ ] Floating button appears on supported sites
- [ ] Form expands/collapses correctly
- [ ] Token configuration works in popup
- [ ] Successful submission to France Travail API
- [ ] Error handling for invalid tokens
- [ ] Error handling for network failures
- [ ] Responsive design on different screen sizes

## 🌐 Adding Support for New Job Sites

To add support for a new job site:

1. **Update `manifest.json`**:

   ```json
   {
     "content_scripts": [
       {
         "matches": [
           "https://www.hellowork.com/*",
           "https://new-job-site.com/*"
         ]
       }
     ]
   }
   ```

2. **Extend `extractOffer()` function** in `content.js`:

   ```javascript
   if (hostname.includes("new-job-site.com")) {
     return {
       enterprise:
         document.querySelector(".company-name")?.innerText || "Non renseigné",
       jobTitle:
         document.querySelector(".job-title")?.innerText || "Non renseigné",
       url: window.location.href,
     };
   }
   ```

3. **Test thoroughly** on the new site
4. **Update documentation** to reflect new support

## 📋 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow the coding standards**
4. **Write clear commit messages**

### PR Guidelines

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** with clear commit messages:

   ```bash
   git commit -m "Add support for new job site"
   ```

3. **Push to your fork**:

   ```bash
   git push origin feature/amazing-feature
   ```

4. **Create a Pull Request** with:
   - Clear title and description
   - List of changes made
   - Screenshots (if UI changes)
   - Testing information

### PR Review Process

1. **Automated checks** (if configured)
2. **Code review** by maintainers
3. **Testing** on multiple browsers/sites
4. **Approval** and merge

## 🔍 Code Review Guidelines

### For Contributors

- Be responsive to feedback
- Make requested changes promptly
- Ask questions if feedback is unclear
- Test suggestions before implementing

### For Reviewers

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Focus on code quality and user experience
- Test changes when possible

## 🐛 Troubleshooting

### Common Development Issues

**Extension not loading**:

- Check manifest.json syntax
- Verify file paths are correct
- Look for console errors in developer tools

**Content script not injecting**:

- Verify match patterns in manifest
- Check if site uses Content Security Policy
- Test on different pages of the site

**API calls failing**:

- Verify token format and validity
- Check network tab for error details
- Ensure proper CORS handling in background script

## 📚 Resources

### Chrome Extension Documentation

- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/)

### France Travail API

- [France Travail Developer Portal](https://francetravail.io/)
- [API Documentation](https://francetravail.io/data/documentation)

### Web Technologies

- [MDN Web Docs](https://developer.mozilla.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributor section
- Release notes for significant contributions
- GitHub contributors page

## 📧 Questions?

If you have questions about contributing:

1. **Check existing issues** and discussions
2. **Create a new issue** with the "question" label
3. **Reach out** to maintainers

Thank you for helping improve the France Travail Extension! 🎉
