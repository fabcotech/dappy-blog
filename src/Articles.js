import React, { useState } from "react";
import { connect } from "react-redux";

import { UNFORGEABLE_NAME_ID } from "./index";

const ArticlesComponent = props => {
  const [load, setLoad] = useState(false);

  if (props.articles.ids.length === 0 && !load) {
    setLoad(true);
    props.loadArticles();
  }

  if (props.articles.ids.length === 0) {
    return <p>No articles</p>;
  }

  return (
    <div>
      {props.articles.ids.map(id => {
        return (
          <div key={id} className="article">
            <h4 className="title is-3">{props.articles.entities[id].title}</h4>
            <h6 className="title is-6">
              {new Date(parseInt(props.articles.entities[id].id)).toString()}
            </h6>
            <div className="content">
              <p className="is-medium">{props.articles.entities[id].content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Articles = connect(
  state => {
    return {
      articles: state.articles
    };
  },
  dispatch => {
    return {
      loadArticles: () => {
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
      }
    };
  }
)(ArticlesComponent);
