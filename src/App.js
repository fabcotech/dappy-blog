import React from "react";
import { connect } from "react-redux";

import { BLOG_TITLE } from "./index";
import { Writing } from "./Writing";
import { Articles } from "./Articles";

const AppComponent = props => {
  console.log(props);
  return (
    <div className="container">
      <h2 className="title is-2">{BLOG_TITLE}</h2>
      <div className="columns">
        <div className="column is-one-quarter">
          <button
            onClick={() =>
              props.dispatch({
                type: "GO_HOME"
              })
            }
            type="button"
            className="button is-dark"
          >
            Home
          </button>
          <button
            onClick={() =>
              props.dispatch({
                type: "TOGGLE_WRITE"
              })
            }
            type="button"
            className="button is-dark"
          >
            Write article
          </button>
        </div>
        <div className="column is-three-quarter">
          {props.writing && <Writing />}
          {!props.writing && <Articles />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    writing: state.writing
  };
};

export const App = connect(
  mapStateToProps,
  undefined
)(AppComponent);
