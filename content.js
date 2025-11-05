// Content script - DOM automation for Google login
(function() {
  'use strict';

  console.log('[Gmail Auto Login] Content script loaded');

  let credentials = null;
  let isProcessing = false;

  // Get credentials from storage
  async function getCredentials() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['loginEmail', 'loginPassword', 'autoLoginActive'], function(result) {
        resolve(result);
      });
    });
  }

  // Clear auto login flag
  async function clearAutoLogin() {
    chrome.storage.local.set({ autoLoginActive: false });
  }

  // Wait for element to appear
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // Simulate human-like typing
  function typeText(element, text) {
    return new Promise((resolve) => {
      element.focus();
      element.click();
      
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          element.value += text[index];
          
          // Dispatch input event for React/Angular compatibility
          const inputEvent = new Event('input', { bubbles: true });
          element.dispatchEvent(inputEvent);
          
          index++;
        } else {
          clearInterval(typeInterval);
          
          // Final events
          const changeEvent = new Event('change', { bubbles: true });
          element.dispatchEvent(changeEvent);
          
          setTimeout(resolve, 200);
        }
      }, 50 + Math.random() * 50); // Random typing speed
    });
  }

  // Click element with human-like delay
  async function clickElement(element) {
    return new Promise((resolve) => {
      element.focus();
      setTimeout(() => {
        element.click();
        resolve();
      }, 200 + Math.random() * 300);
    });
  }

  // Handle email input page
  async function handleEmailPage(email) {
    console.log('[Gmail Auto Login] Handling email page');
    
    try {
      // Multiple possible selectors for email input
      const emailSelectors = [
        'input[type="email"]',
        'input[name="identifier"]',
        'input[id="identifierId"]',
        '#Email',
        'input[aria-label*="email" i]',
        'input[aria-label*="username" i]'
      ];

      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          emailInput = await waitForElement(selector, 2000);
          if (emailInput) break;
        } catch (e) {
          continue;
        }
      }

      if (!emailInput) {
        throw new Error('Email input field not found');
      }

      console.log('[Gmail Auto Login] Found email input, typing...');
      await typeText(emailInput, email);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Multiple possible selectors for next button
      const nextButtonSelectors = [
        '#identifierNext button',
        'button[jsname="LgbsSe"]',
        'button:has-text("Next")',
        '[id="identifierNext"]',
        'button[type="button"]'
      ];

      let nextButton = null;
      for (const selector of nextButtonSelectors) {
        try {
          const buttons = document.querySelectorAll(selector);
          for (const btn of buttons) {
            const text = btn.textContent.toLowerCase();
            if (text.includes('next') || text.includes('weiter') || text.includes('далее') || btn.closest('#identifierNext')) {
              nextButton = btn;
              break;
            }
          }
          if (nextButton) break;
        } catch (e) {
          continue;
        }
      }

      if (!nextButton) {
        // Fallback: find any button containing "next"
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
          if (btn.textContent.toLowerCase().includes('next')) {
            nextButton = btn;
            break;
          }
        }
      }

      if (!nextButton) {
        throw new Error('Next button not found');
      }

      console.log('[Gmail Auto Login] Clicking Next button');
      await clickElement(nextButton);
      
      return true;
    } catch (error) {
      console.error('[Gmail Auto Login] Error on email page:', error);
      return false;
    }
  }

  // Handle password input page
  async function handlePasswordPage(password) {
    console.log('[Gmail Auto Login] Handling password page');
    
    try {
      // Multiple possible selectors for password input
      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        '#password',
        'input[aria-label*="password" i]',
        'input[aria-label*="Passwort" i]'
      ];

      let passwordInput = null;
      for (const selector of passwordSelectors) {
        try {
          passwordInput = await waitForElement(selector, 5000);
          if (passwordInput && passwordInput.offsetParent !== null) { // Check if visible
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!passwordInput) {
        throw new Error('Password input field not found');
      }

      console.log('[Gmail Auto Login] Found password input, typing...');
      await typeText(passwordInput, password);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Multiple possible selectors for next/sign in button
      const signInButtonSelectors = [
        '#passwordNext button',
        'button[jsname="LgbsSe"]',
        'button[type="button"]'
      ];

      let signInButton = null;
      for (const selector of signInButtonSelectors) {
        try {
          const buttons = document.querySelectorAll(selector);
          for (const btn of buttons) {
            const text = btn.textContent.toLowerCase();
            if (text.includes('next') || text.includes('sign in') || text.includes('weiter') || btn.closest('#passwordNext')) {
              signInButton = btn;
              break;
            }
          }
          if (signInButton) break;
        } catch (e) {
          continue;
        }
      }

      if (!signInButton) {
        // Fallback
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
          const text = btn.textContent.toLowerCase();
          if (text.includes('next') || text.includes('sign')) {
            signInButton = btn;
            break;
          }
        }
      }

      if (!signInButton) {
        throw new Error('Sign in button not found');
      }

      console.log('[Gmail Auto Login] Clicking Sign In button');
      await clickElement(signInButton);
      
      return true;
    } catch (error) {
      console.error('[Gmail Auto Login] Error on password page:', error);
      return false;
    }
  }

  // Handle additional verification pages (2FA, recovery, etc.)
  async function handleAdditionalPages() {
    console.log('[Gmail Auto Login] Checking for additional pages');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Look for "Continue" or "Confirm" buttons
      const confirmButtonTexts = ['continue', 'confirm', 'yes', 'skip', 'not now', 'done'];
      const allButtons = document.querySelectorAll('button, [role="button"]');
      
      for (const btn of allButtons) {
        const text = btn.textContent.toLowerCase().trim();
        for (const confirmText of confirmButtonTexts) {
          if (text === confirmText || text.includes(confirmText)) {
            console.log('[Gmail Auto Login] Found additional button:', text);
            await clickElement(btn);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return true;
          }
        }
      }

      // Check if we're already in Gmail
      if (window.location.hostname === 'mail.google.com' && window.location.pathname.includes('/mail')) {
        console.log('[Gmail Auto Login] Successfully reached Gmail!');
        await clearAutoLogin();
        return false; // No more pages to handle
      }

      return false;
    } catch (error) {
      console.error('[Gmail Auto Login] Error on additional pages:', error);
      return false;
    }
  }

  // Main automation logic
  async function startAutomation() {
    if (isProcessing) {
      console.log('[Gmail Auto Login] Already processing');
      return;
    }

    const data = await getCredentials();
    
    if (!data.autoLoginActive || !data.loginEmail || !data.loginPassword) {
      console.log('[Gmail Auto Login] Auto login not active or missing credentials');
      return;
    }

    credentials = {
      email: data.loginEmail,
      password: data.loginPassword
    };

    isProcessing = true;
    console.log('[Gmail Auto Login] Starting automation process');

    try {
      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentUrl = window.location.href;
      console.log('[Gmail Auto Login] Current URL:', currentUrl);

      // Check if we're on email page
      if (currentUrl.includes('accounts.google.com') && 
          (currentUrl.includes('identifier') || document.querySelector('input[type="email"]'))) {
        console.log('[Gmail Auto Login] Detected email page');
        const success = await handleEmailPage(credentials.email);
        if (success) {
          // Wait and check for password page
          await new Promise(resolve => setTimeout(resolve, 2000));
          isProcessing = false;
          startAutomation(); // Retry for next page
        }
        return;
      }

      // Check if we're on password page
      if (currentUrl.includes('accounts.google.com') && 
          (currentUrl.includes('challenge/pwd') || document.querySelector('input[type="password"]'))) {
        console.log('[Gmail Auto Login] Detected password page');
        const success = await handlePasswordPage(credentials.password);
        if (success) {
          // Wait and check for additional pages
          await new Promise(resolve => setTimeout(resolve, 3000));
          isProcessing = false;
          startAutomation(); // Retry for next page
        }
        return;
      }

      // Check for additional verification pages
      if (currentUrl.includes('accounts.google.com')) {
        console.log('[Gmail Auto Login] Checking for additional verification pages');
        const handled = await handleAdditionalPages();
        if (handled) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          isProcessing = false;
          startAutomation(); // Retry for next page
        } else {
          isProcessing = false;
        }
        return;
      }

      // Check if we reached Gmail
      if (currentUrl.includes('mail.google.com')) {
        console.log('[Gmail Auto Login] Successfully reached Gmail inbox!');
        await clearAutoLogin();
        isProcessing = false;
        return;
      }

      isProcessing = false;
    } catch (error) {
      console.error('[Gmail Auto Login] Automation error:', error);
      isProcessing = false;
    }
  }

  // Start automation when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(startAutomation, 500);
    });
  } else {
    setTimeout(startAutomation, 500);
  }

  // Also listen for URL changes (for SPAs)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('[Gmail Auto Login] URL changed to:', url);
      setTimeout(startAutomation, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

})();
