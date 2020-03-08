import React from "react";
import { connect } from "react-redux";

import { BLOG_TITLE } from "./index";
import { Writing } from "./Writing";
import { Articles } from "./Articles";
import { loadAllArticles } from "./loadAllArticles";

const AppComponent = props => {
  return (
    <div className="container">
      <h2 className="title is-2">{BLOG_TITLE}</h2>
      <div className="columns left-menu">
        <div className="column is-one-quarter">
          <a onClick={() => props.goHome(props.filesRegistryUri)}>Home</a>
          {props.publicKey && props.identified ? (
            <a onClick={() => props.toggleWrite()}>Write article</a>
          ) : (
            <a onClick={() => props.identify(props.publicKey)}>Identify</a>
          )}
        </div>
        <div className="column is-three-quarters">
          {props.writing && (
            <Writing
              entryRegistryUri={props.entryRegistryUri}
              filesRegistryUri={props.filesRegistryUri}
              publicKey={props.publicKey}
              nonce={props.nonce}
              sendArticle={props.sendArticle}
            />
          )}
          {!props.writing && (
            <Articles
              filesRegistryUri={props.filesRegistryUri}
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
    entryRegistryUri: state.entryRegistryUri,
    publicKey: state.publicKey,
    nonce: state.nonce,
    filesRegistryUri: state.filesRegistryUri,
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
    loadArticles: filesRegistryUri => {
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot fetch articles");
        return;
      }
      loadAllArticles(filesRegistryUri)
        .then(articles => {
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: articles
          });
        })
        .catch(err => {
          console.error("Something went wrong when loading articles");
          console.log(err);
        });
    },
    goHome: filesRegistryUri => {
      dispatch({
        type: "GO_HOME"
      });
      if (typeof dappyRChain === "undefined") {
        console.warn("window.dappyRChain is undefined, cannot fetch articles");
        return;
      }
      loadAllArticles(filesRegistryUri)
        .then(articles => {
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: articles
          });
        })
        .catch(err => {
          console.error("Something went wrong when loading articles");
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
      const id = new Date().getTime().toString();
      dappyRChain
        .transaction({
          term: `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
            lookup!(\`rho:id:${payload.entryRegistryUri}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
                {
                  "type": "ADD",
                  "payload": {
                    "file": {
                      "id": "${id}",
                      "title": "${payload.title}",
                      "author": "${payload.author}",
                      "content": "${payload.content}",
                      "address": "${payload.address}",
                    },
                    "nonce": "${newNonce}",
                    "signature": "SIGN",
                    "id": "${id}",
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
          console.log(a);
          return loadAllArticles(payload.filesRegistryUri);
        })
        .then(articles => {
          dispatch({
            type: "UPDATE_ARTICLES",
            payload: articles
          });
          dispatch({
            type: "GO_HOME"
          });
        })
        .catch(err => {
          console.error("Something went wrong");
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
