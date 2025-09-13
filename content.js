let tooltip = null;
let toaster = null;
let toasterTimeout = null;

function showTooltip(text, x, y) {
  if (tooltip) {
    tooltip.remove();
  }

  tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    top: ${y + 10}px;
    left: ${x + 10}px;
    background-color: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: sans-serif;
    font-size: 14px;
    z-index: 9999;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    display: block;
    pointer-events: auto;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  `;
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  setTimeout(() => {
    if (tooltip) {
      tooltip.style.opacity = '1';
    }
  }, 10);
}

function hideTooltip() {
  if (tooltip) {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    }, 200);
  }
}

function showToaster(text) {
  if (toaster) {
    clearTimeout(toasterTimeout);
    toaster.remove();
  }

  toaster = document.createElement('div');
  toaster.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #1a1a1a;
    color: #f0f0f0;
    padding: 15px 25px;
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 16px;
    z-index: 10000;
    max-width: 350px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  `;
  toaster.textContent = text;
  document.body.appendChild(toaster);

  // Fade in the toaster
  setTimeout(() => {
    if (toaster) {
      toaster.style.opacity = '1';
      toaster.style.transform = 'translateY(0)';
    }
  }, 10);

  // Add event listeners to pause the timer on hover
  toaster.addEventListener('mouseover', () => {
    clearTimeout(toasterTimeout);
  });

  toaster.addEventListener('mouseout', () => {
    // Start the timer again when the mouse leaves
    toasterTimeout = setTimeout(() => {
      hideToaster();
    }, 5000);
  });

  // Set the initial timer to hide the toaster after 5 seconds
  toasterTimeout = setTimeout(() => {
    hideToaster();
  }, 5000);
}

function hideToaster() {
  if (toaster) {
    toaster.style.opacity = '0';
    toaster.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (toaster) {
        toaster.remove();
        toaster = null;
      }
    }, 300);
  }
}

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  const activeElement = document.activeElement;

  if (selectedText.length > 0 && selectedText.split(/\s+/).length === 1 && !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
    console.log(`Content Script: Selected word: ${selectedText}`);
    showTooltip('Click for definition', event.pageX, event.pageY);

    tooltip.onclick = () => {
      chrome.runtime.sendMessage({ action: 'getDefinition', word: selectedText }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Content Script: Could not send message:", chrome.runtime.lastError.message);
          return;
        }
        if (response && response.definition) {
          showToaster(response.definition);
        }
      });
      hideTooltip();
    };
  } else {
    hideTooltip();
  }
});
