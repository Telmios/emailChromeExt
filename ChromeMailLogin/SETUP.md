# Quick Setup Guide

## Step 1: Create Icon Files

You need to create three icon files for the extension. Choose one method:

### Method A: Use the HTML Generator (Easiest)
1. Open `create-icons.html` in your browser
2. Right-click each canvas image
3. Select "Save image as..."
4. Save as: `icon16.png`, `icon48.png`, `icon128.png`
5. Place all three PNG files in the ChromeMailLogin folder

### Method B: Use Placeholder Icons (Quick)
Create any three PNG images with these dimensions:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)  
- icon128.png (128x128 pixels)

You can use any simple image editor or download free icons from:
- https://www.flaticon.com/
- https://icons8.com/

### Method C: Use Node.js Script
```bash
cd ChromeMailLogin
node generate-icons.js
# Then convert the SVG files to PNG using an online converter
```

## Step 2: Install Extension in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Browse to and select the `ChromeMailLogin` folder
6. The extension will now appear in your extensions list

## Step 3: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome toolbar
2. Find "Gmail Auto Login" in the list
3. Click the pin icon to keep it visible

## Step 4: Test the Extension

1. Click the extension icon
2. Enter your Gmail email and password
3. Click **Start**
4. Watch as it automatically logs you in!

## Troubleshooting

**"Failed to load extension" error:**
- Make sure all files are in the ChromeMailLogin folder
- Ensure icon files exist (icon16.png, icon48.png, icon128.png)
- Check manifest.json has no syntax errors

**Extension icon missing:**
- The icon files are required - follow Step 1 above
- Or temporarily comment out the "icons" sections in manifest.json

**Automation doesn't work:**
- Open DevTools (F12) on the Google login page
- Check console for `[Gmail Auto Login]` messages
- Google may have changed their page structure

**Gets stuck during login:**
- Some security checks require manual interaction
- 2FA/reCAPTCHA cannot be automated
- Complete them manually and automation may continue

## Security Notes

- Credentials are stored locally in Chrome storage
- Only accessible by this extension
- Clear by uninstalling the extension
- For testing/personal use only

## Next Steps

Once installed, you can:
- Save your email (password needs to be entered each time for security)
- Use on multiple Google accounts
- Customize the code in content.js for your needs

---

**Need Help?** Check the main README.md for detailed documentation.
