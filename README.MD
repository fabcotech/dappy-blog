## dapp-blog

Simple blog boilerplate for Dappy. For now this is a append-only blog, you can not edit neither delete the articles that were posted. It includes tipping capabilities.

Is is highly based on the rholang-files-module, see (https://github.com/fabcotech/rholang-files-module)[https://github.com/fabcotech/rholang-files-module]

This dapp uses the default files module rholang file (`files.rho`), the dynamic articles are stored in the same module as the assets (dpy file).

### Initialization

The mechanism is the following : at genesis, and each times an article is published, the publisher must provide a valid signature of the existing nonce, and also changes the value of it for the next deployment.

Use the `generate_signature_for_nonce.js` script to generate a signature based on a nonce and a private key. Then add this signature in the
