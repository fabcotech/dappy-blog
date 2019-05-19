## dapp-blog

Simple blog boilerplate for Dappy. For now this is a append-only blog, you can not edit neither delete the articles that were posted :)

### Initialization

deploy articles_contract.rho, this rholang contract is responsible for storing the articles (no signature verification yet)

```
rnode deploy --phlo-price 1 --phlo-limit 999999999 --private-key PRIVATE_KEY articles_contract.rho
rnode propose
```

Check the rnode console, registry_uri and unforgeable_name should appear, copy them in the src/index.ts file (unforgeable_name_id without 0x, and registry_uri without 'rho:id'), example:

```
export const UNFORGEABLE_NAME_ID = "8a03bd532a12096aa8d8daf1c13663508785498391a4fee088edaba6861dbf48";
export const REGISTRY_URI = "ohqkjueg5ud5kgyx51p1ow9cnejpe5spzdi1hui3bancb9ag3zikjj";
```

Now your web application is ready to be compiled, compile it with webpack:

```
npm install
npm run build
```

Now that the JS bundle is ready, yoou have to turn it into a dappy manifest, and publish it to the blockchain, please refer to [dappy-cli](https://github.com/fabcotech/dappy-cli) documentation.
