import React from "react";
import { connect } from "react-redux";

import { BLOG_TITLE } from "./index";
import { Writing } from "./Writing";
import { Articles } from "./Articles";

const AppComponent = props => {
  return (
    <div className="container">
      <h2 className="title is-2">{BLOG_TITLE}</h2>
      <div className="columns left-menu">
        <div className="column is-one-quarter">
          <a onClick={() => props.goHome(props.unforgeableNameId)}>Home</a>
          {props.publicKey && props.identified ? (
            <a onClick={() => props.toggleWrite()}>Write article</a>
          ) : (
            <a onClick={() => props.identify(props.publicKey)}>Identify</a>
          )}
        </div>
        <div className="column is-three-quarter">
          {props.writing && (
            <Writing
              registryUri={props.registryUri}
              unforgeableNameId={props.unforgeableNameId}
              publicKey={props.publicKey}
              nonce={props.nonce}
              sendArticle={props.sendArticle}
            />
          )}
          {!props.writing && (
            <Articles
              unforgeableNameId={props.unforgeableNameId}
              loadArticles={props.loadArticles}
              articles={props.articles}
              onTip={props.onTip}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    writing: state.writing,
    articles: state.articles,
    registryUri: state.registryUri,
    publicKey: state.publicKey,
    nonce: state.nonce,
    unforgeableNameId: state.unforgeableNameId,
    identified: state.identified
  };
};

export const App = connect(mapStateToProps, dispatch => {
  return {
    identify: publicKey => {
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot identify");
        return;
      }
      dappyRChain
        .identify({ publicKey: publicKey })
        .then(a => {
          console.log(a);
          if (a && a.identified && a.publicKey === publicKey) {
            dispatch({
              type: "IDENTIFIED"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadArticles: unforgeableNameId => {
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot fetch articles");
        return;
      }
      dappyRChain
        .fetch("dappy://rchain/alphanetwork/" + unforgeableNameId)
        .then(a => {
          const response = JSON.parse(a);
          const rholangTerm = response.expr;
          const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: jsValue
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    goHome: unforgeableNameId => {
      dispatch({
        type: "GO_HOME"
      });
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot fetch articles");
        return;
      }
      dappyRChain
        .fetch("dappy://rchain/alphanetwork/" + unforgeableNameId)
        .then(a => {
          const response = JSON.parse(a);
          const rholangTerm = response.expr;
          const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: jsValue
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleWrite: a =>
      dispatch({
        type: "TOGGLE_WRITE"
      }),
    sendArticle: payload => {
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot send article");
        return;
      }
      const newNonce = blockchainUtils.generateNonce();
      dappyRChain
        .transaction({
          term: `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
            lookup!(\`rho:id:${payload.registryUri}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
                {
                  "type": "CREATE",
                  "payload": {
                    "article": {
                      "id": "${new Date().getTime().toString()}",
                      "title": "${payload.title}",
                      "author": "${payload.author}",
                      "content": "${payload.content}",
                      "address": "${payload.address}",
                    },
                    "nonce": "${newNonce}",
                    "signature": "SIGN"
                  }
                },
                *stdout
              )
            } |
            basket!({ "status": "completed" })
          }`,
          signatures: {
            SIGN: payload.nonce
          }
        })
        .then(a => {
          return dappyRChain.fetch(
            "dappy://rchain/alphanetwork/" + payload.unforgeableNameId
          );
        })
        .then(a => {
          const response = JSON.parse(a);
          const rholangTerm = response.expr;
          const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: jsValue
          });
          dispatch({
            type: "UPDATE_NONCE",
            payload: newNonce
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    onTip: (i, address) => {
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot tip author");
        return;
      }
      dappyRChain
        .requestPayment({
          from: undefined,
          to: address,
          amount: i
        })
        .then(a => {
          console.log(a);
          store.dispatch({
            type: "TRANSACTION_SUCCESFULL",
            payload: "Transaction aired succesfully"
          });
        })
        .catch(err => {
          console.log(err);
          store.dispatch({
            type: "TRANSACTION_ERROR",
            payload: err.transaction.value.message
          });
        });
    }
  };
})(AppComponent);
