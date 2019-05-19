import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { App } from "./App";

export const UNFORGEABLE_NAME_ID =
  "8a03bd532a12096aa8d8daf1c13663508785498391a4fee088edaba6861dbf48";
export const REGISTRY_URI =
  "ohqkjueg5ud5kgyx51p1ow9cnejpe5spzdi1hui3bancb9ag3zikjj";
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
  ReactDOM.render(<Index />, document.getElementById("root"));
}
