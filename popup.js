// Popup script - handles UI interactions
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const startBtn = document.getElementById('startBtn');
  const statusDiv = document.getElementById('status');

  // Load saved email if exists
  chrome.storage.local.get(['savedEmail'], function(result) {
    if (result.savedEmail) {
      emailInput.value = result.savedEmail;
    }
  });

  // Show status message
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status show ${type}`;
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 5000);
  }

  // Start button click handler
  startBtn.addEventListener('click', async function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showStatus('Please enter both email and password', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address', 'error');
      return;
    }

    try {
      startBtn.disabled = true;
      showStatus('Starting login process...', 'info');

      // Save email for future use
      chrome.storage.local.set({ savedEmail: email });

      // Save credentials to storage (will be used by content script)
      await chrome.storage.local.set({
        loginEmail: email,
        loginPassword: password,
        autoLoginActive: true
      });

      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Navigate to Google login page
      await chrome.tabs.update(tab.id, { 
        url: 'https://accounts.google.com/signin/v2/identifier?service=mail&continue=https://mail.google.com/mail/'
      });

      showStatus('Opened Google login page. Automation starting...', 'success');
      
      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      showStatus('Error: ' + error.message, 'error');
      startBtn.disabled = false;
    }
  });

  // Enable enter key to submit
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      startBtn.click();
    }
  });

  emailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      passwordInput.focus();
    }
  });
});
