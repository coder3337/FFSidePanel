# A reading panel with scratchpad

### What it does

A simple reading pane to save tabs you want to come back to. Saves to local storage and has a scratchpad. 

My spin on the *annotate-page* and *quicknote* examples from webextensions-examples. 

### Environment

In order to debug extensions you must make use of the built in 'Developer tools toolbox' found in about:debugging#/runtime/this-firefox. Load your temporary extensions manifest and click inspect. You will need the web-ext extension.

```
npm install --global web-ext

web-ext run

web-ext lint

```
web-ext run --firefox-profile 
or
web-ext run --firefox="C:\Program Files\Firefox Developer Edition\firefox.exe"

### Resources and references
With thanks:
- https://extensionworkshop.com
- https://extensionworkshop.com/documentation/develop/debugging/#developer-tools-toolbox
- https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
- https://github.com/mdn/webextensions-examples/tree/main/annotate-page
- https://github.com/mdn/webextensions-examples/tree/main/quicknote


