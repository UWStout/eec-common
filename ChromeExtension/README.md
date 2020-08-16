# Electronic Empathetic Communication Project

## EEC Browser Extension
This is a Browser Extension intended to provide a general means of connecting to the EEC tool
from any page that contains a text area for sending messages. It will provide basic feedback on your
typing and attempt to connect back to the context that already exists in the EEC tool.

While it is generally being designed from the 'Chrome Extension' API, there is intention to keep things in line
with the general WebExtension API so it can be loaded into other browsers like Opera, Firefox, and Edge.

## Structure
This plugin will likely utilize all the components of a web extension: a popup, in-content scripts, and a background script.

- __Popup__: The popup is your connection to the EEC back end allowing you to connect to an account and a
communication context.
- __In-Content__: These scripts are injected onto the page and interact with and modify the DOM to provide
in-situ feedback on a message as it is being composed. It will monitor editable text boxes on select web
pages and capture input to send it to the background script. It will receive any recommendations from the 
background script and present them to the user for interaction.
- __Background__: The background script will maintain the connection to the EEC back end providing means
for assessing messages, putting them in context, and initiating recommendations.

## Technology
The following standard web technologies are part of this tool:
- Modern ES6+ programming managed with Babel, webpack, eslint and node.js
- The WebExtension API for authoring cross-browser compatible extensions.
- The WebComponents API for encapsulating the extension's injected elements and code on a page.
- jQuery for DOM traversal and manipulation
- Axios for Promise based AJAX communication

## Sources
While it has diverged significantly, the original structure of this project was cloned from the
[chrome-extension-template](https://github.com/edrpls/chrome-extension-template) project by
[edrpls](https://github.com/edrpls). Major inspiration for some functionality came from deeply examining
and reverse-engineering the
[Grammarly chrome extension](https://chrome.google.com/webstore/detail/grammarly-for-chrome/kbfnbcaeplbcioakkpcpgfkobkghlhen),
an excellent tool for feedback in any editable text boxes on many web pages.
