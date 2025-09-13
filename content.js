let tooltip = null;
let toast = null;

// Function to create and show the tooltip for a selected word
function showDefinitionPrompt(word, x, y) {
  // Remove any existing tooltips
  if (tooltip) {
    tooltip.remove();
  }

  tooltip = document.createElement('div');
  tooltip.textContent = `Click to define: "${word}"`;
  tooltip.style.cssText = `
    position: absolute;
    top: ${y + 10}px;
    left: ${x}px;
    background-color: #007bff;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: sans-serif;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  `;
  document.body.appendChild(tooltip);

  // Animate the tooltip in
  setTimeout(() => {
    if (tooltip) {
      tooltip.style.opacity = '1';
    }
  }, 10);

  // Attach a click listener to the tooltip to get the definition
  tooltip.addEventListener('click', () => {
    hideTooltip();
    try {
      chrome.runtime.sendMessage({ action: 'getDefinition', word: word }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Content Script: Error sending message:", chrome.runtime.lastError.message);
          showToaster('Failed to get definition. Please try again.');
          return;
        }
        if (response && response.definition) {
          showToaster(response.definition);
        } else {
          showToaster('Definition not found.');
        }
      });
    } catch (e) {
      console.error("Content Script: Could not send message:", e);
      showToaster('Failed to get definition. Please try again.');
    }
  });
}

// Function to create and show the toaster notification
function showToaster(text) {
  // Remove any existing toaster
  if (toast) {
    toast.remove();
  }

  toast = document.createElement('div');
  toast.textContent = text;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 16px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 350px;
    word-wrap: break-word;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: translateY(-50px);
    opacity: 0;
  `;
  document.body.appendChild(toast);

  // Animate the toaster in
  setTimeout(() => {
    if (toast) {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }
  }, 100);

  // Hide the toaster after a few seconds
  setTimeout(() => {
    if (toast) {
      toast.style.transform = 'translateY(-50px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast) {
          toast.remove();
          toast = null;
        }
      }, 300);
    }
  }, 30000); // 5 seconds
}

// Function to hide the tooltip
function hideTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

// Listen for text selection
document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection().toString().trim();
  
  if (selection.length > 0) {
    // Check if the selected text is a single word
    if (selection.split(/\s+/).length === 1) {
      showDefinitionPrompt(selection, event.pageX, event.pageY);
    }
  }
});

// Hide the tooltip if the user clicks anywhere else
document.addEventListener('mousedown', (event) => {
  if (tooltip && !tooltip.contains(event.target)) {
    hideTooltip();
  }
});
