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
  console.log("ONLOAD");
  ReactDOM.render(<Index />, document.getElementById("root"));
};

// In Dappy, window is already loaded when this code executes
if (typeof dappyRChain !== "undefined") {
  dappyRChain
    .fetch("dappy://rchain/alphanetwork/UNFORGEABLE_NAME_1")
    .then(a => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr;
      const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
      // get nonce value
      dappyRChain
        .fetch(
          `dappy://rchain/alphanetwork/${jsValue.unforgeable_name_nonce.UnforgPrivate}`
        )
        .then(a => {
          const responseNonce = JSON.parse(a);
          const rholangTermNonce = responseNonce.expr;
          const jsValueNonce = blockchainUtils.rhoValToJs(rholangTermNonce);
          store.dispatch({
            type: "INIT",
            payload: {
              unforgeableNameId:
                jsValue.unforgeable_name_articles.UnforgPrivate,
              registryUri: jsValue.registry_uri.replace("rho:id:", ""),
              publicKey: jsValue.public_key,
              nonce: jsValueNonce
            }
          });
          ReactDOM.render(<Index />, document.getElementById("root"));
        });
    })
    .catch(err => {
      console.log(err);
    });
}
