Word Definition Chrome Extension
This is a lightweight and efficient Chrome extension that provides instant definitions for any word on a webpage. Simply highlight a word, click on the pop-up, and the definition will appear in a small notification in the corner of your screen.

Features
Seamless Integration: The extension works on any webpage without disrupting your browsing experience.

On-Demand Definitions: The API is only called when you explicitly request a definition by clicking on a selected word, saving on API requests and avoiding rate-limit issues.

Clean UI: Definitions are displayed in a clean, non-intrusive toaster notification.

No API Key Needed: This extension uses a free, open-source dictionary API, so no personal API keys or subscriptions are required.

Installation
To install this extension, follow these steps:

Clone this repository or download the ZIP file.

Open Google Chrome and navigate to chrome://extensions.

Enable Developer mode by toggling the switch in the top-right corner.

Click on the Load unpacked button.

Select the folder containing your extension files (manifest.json, background.js, content.js, and icon.svg).

The extension should now be installed and ready to use.

Usage
Navigate to any webpage with text.

Highlight a word that you want to define. A small tooltip will appear.

Click the tooltip.

The definition will pop up in a toaster notification in the top-right corner of your browser.

Technologies
HTML, CSS, JavaScript

Chrome Extension API

Dictionary API (used for definitions)