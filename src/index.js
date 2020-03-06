import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { App } from "./App";

export const BLOG_TITLE = "My cool blog";

const Index = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

window.onload = () => {
  ReactDOM.render(<Index />, document.getElementById("root"));
};

// In Dappy, window is already loaded when this code executes
if (typeof dappyRChain !== "undefined") {
  dappyRChain
    .fetch("dappy://rchain/betanetwork/REGISTRY_URI")
    .then(a => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr[0];
      const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
      store.dispatch({
        type: "INIT",
        payload: {
          filesRegistryUri: jsValue.filesRegistryUri.replace("rho:id:", ""),
          entryRegistryUri: jsValue.entryRegistryUri.replace("rho:id:", ""),
          publicKey: jsValue.publicKey,
          nonce: jsValue.nonce
        }
      });
      ReactDOM.render(<Index />, document.getElementById("root"));
    })
    .catch(err => {
      console.error(
        "Something went wrong when retreiving the files module object"
      );
      console.log(err);
    });
}
