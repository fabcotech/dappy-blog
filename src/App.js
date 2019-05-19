import React from "react";
import { connect } from "react-redux";

import { store } from "./store";
import { REGISTRY_URI, UNFORGEABLE_NAME_ID } from "./index";
import { BLOG_TITLE } from "./index";
import { Writing } from "./Writing";
import { Articles } from "./Articles";

const AppComponent = props => {
  return (
    <div className="container">
      <h2 className="title is-2">{BLOG_TITLE}</h2>
      <div className="columns">
        <div className="column is-one-quarter">
          <button
            onClick={() => props.goHome()}
            type="button"
            className="button is-dark"
          >
            Home
          </button>
          <button
            onClick={() => props.toggleWrite()}
            type="button"
            className="button is-dark"
          >
            Write article
          </button>
        </div>
        <div className="column is-three-quarter">
          {props.writing && <Writing sendArticle={props.sendArticle} />}
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
  dispatch => {
    return {
      goHome: a => {
        dispatch({
          type: "GO_HOME"
        });

        const nameByteArray = new Buffer(UNFORGEABLE_NAME_ID, "hex");
        const channelRequest = { ids: [{ id: Array.from(nameByteArray) }] };
        if (typeof dappyRChain === "undefined") {
          return;
        }
        dappyRChain
          .listenForDataAtName(new Date().getTime().toString(), {
            depth: 1000,
            name: channelRequest
          })
          .then(a => {
            let articles;
            try {
              const json = JSON.parse(a.value);
              const map = json.exprs[0].e_map_body;
              articles = blockchainUtils.rholangMapToJsObject(map);
            } catch (err) {
              console.error("Unable to parse result from call");
              console.log(err);
            }

            dispatch({
              type: "UPDATE_ARTICLES",
              payload: articles
            });
          })
          .catch(err => {
            console.log("ERR");
            console.log(err);
          });
      },
      toggleWrite: a =>
        dispatch({
          type: "TOGGLE_WRITE"
        }),
      sendArticle: payload => {
        if (typeof dappyRChain === "undefined") {
          return;
        }
        dappyRChain
          .transaction(new Date().getTime().toString(), {
            term: `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
            lookup!(\`rho:id:${REGISTRY_URI}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
                {
                  "type": "CREATE",
                  "payload": {
                    "id": "${new Date().getTime().toString()}",
                    "title": "${payload.title}",
                    "content": "${payload.content}",
                  }
                },
                *stdout
              )
            } |
            basket!({ "status": "completed" })
          }`
          })
          .then(a => {
            const nameByteArray = new Buffer(UNFORGEABLE_NAME_ID, "hex");
            const channelRequest = { ids: [{ id: Array.from(nameByteArray) }] };
            return dappyRChain.listenForDataAtName(
              new Date().getTime().toString(),
              {
                depth: 1000,
                name: channelRequest
              }
            );
          })
          .then(a => {
            let articles;
            try {
              const json = JSON.parse(a.value);
              const map = json.exprs[0].e_map_body;
              articles = blockchainUtils.rholangMapToJsObject(map);
            } catch (err) {
              console.error("Unable to parse result from call");
              console.log(err);
            }

            dispatch({
              type: "UPDATE_ARTICLES",
              payload: articles
            });
          })
          .catch(err => {
            console.log("ERR");
            console.log(err);
          });
      }
    };
  }
)(AppComponent);
