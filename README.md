# Gmail Auto Login Chrome Extension

A Chrome Extension that automates Gmail login using pure JavaScript DOM manipulation (no external automation APIs).

## Features

- 🔐 Automated Gmail login with email and password
- 🎯 Pure DOM manipulation (no Puppeteer, Selenium, or external APIs)
- 🤖 Handles dynamic Google login flow changes
- ⏱️ Smart element waiting with MutationObserver
- 🎨 Modern, beautiful UI
- 💾 Remembers your email for convenience

## Requirements

- Google Chrome browser
- Valid Gmail account credentials

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `ChromeMailLogin` folder
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter your Gmail email address
3. Enter your password
4. Click the **Start** button
5. The extension will:
   - Open Google's login page
   - Automatically enter your email and click "Next"
   - Automatically enter your password and click "Sign in"
   - Handle additional verification steps (Continue, Confirm, etc.)
   - Navigate to your Gmail inbox

## How It Works

### Architecture

The extension consists of several components:

1. **manifest.json** - Chrome Extension configuration
   - Declares permissions for tabs, storage, and scripting
   - Defines content scripts for Google domains
   - Configures the popup UI

2. **popup.html/js** - User Interface
   - Simple form with email/password fields
   - Saves credentials to Chrome storage
   - Opens Google login page in current tab

3. **content.js** - DOM Automation Script
   - Runs on Google login pages
   - Uses `document.querySelector()` to find elements
   - Uses `.value` to fill in forms
   - Uses `.click()` to click buttons
   - Waits for dynamic elements with `MutationObserver`
   - Simulates human-like typing with random delays

### Technical Details

**Element Detection:**
- Multiple selector strategies for robustness
- Handles different Google login page variations
- Falls back to text-based button detection

**Human-like Behavior:**
- Random typing speed (50-100ms per character)
- Random click delays (200-500ms)
- Proper focus and event dispatching

**Dynamic Page Handling:**
- `MutationObserver` watches for DOM changes
- Waits for elements to appear before interaction
- Handles URL changes in Single Page Applications

**Automation Flow:**
1. Email page → Enter email → Click "Next"
2. Password page → Enter password → Click "Sign in"
3. Additional pages → Click "Continue"/"Confirm" if present
4. Gmail inbox → Stop automation

## Security Notes

⚠️ **Important Security Information:**

- Credentials are stored in Chrome's local storage
- Storage is extension-specific and not accessible to websites
- Clear stored credentials by uninstalling the extension
- For maximum security, avoid saving passwords in any extension

## Limitations

- Does NOT support 2-Factor Authentication (2FA)
  - If 2FA is enabled, you'll need to manually enter the code
- Does NOT support reCAPTCHA challenges
- May break if Google significantly changes their login page structure
- This is for educational/personal use only

## Troubleshooting

**Extension doesn't start:**
- Check that Developer mode is enabled
- Reload the extension in `chrome://extensions/`
- Check browser console for errors

**Automation fails:**
- Google may have changed their page selectors
- Check console logs (F12) on the Google login page
- Look for `[Gmail Auto Login]` messages

**Gets stuck on a page:**
- Google may be showing a security challenge
- Complete it manually and the automation may continue
- Some pages require manual interaction

## Development

### File Structure
```
ChromeMailLogin/
├── manifest.json       # Extension configuration
├── popup.html          # UI layout
├── popup.js            # UI logic
├── content.js          # DOM automation
├── styles.css          # UI styling
├── icon16.png          # Icon (16x16)
├── icon48.png          # Icon (48x48)
├── icon128.png         # Icon (128x128)
└── README.md           # This file
```

### Debugging

Enable logging in `content.js`:
- Open DevTools (F12) on Google login pages
- Look for console messages with `[Gmail Auto Login]` prefix
- Check for element detection and automation steps

### Customization

To modify automation behavior, edit `content.js`:
- Adjust `typeText()` for different typing speeds
- Modify selectors arrays for different element detection
- Change timeouts in `waitForElement()` for slower connections

## Disclaimer

This extension is for educational and personal use only. Automated login may violate Google's Terms of Service. Use at your own risk. The authors are not responsible for any account restrictions or bans.

## License

MIT License - Feel free to modify and distribute
