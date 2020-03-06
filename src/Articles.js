import React, { useState } from "react";

import { Article } from "./Article";

export const Articles = props => {
  const [load, setLoad] = useState(false);

  if (props.articles.ids.length === 0 && !load) {
    setLoad(true);
    props.loadArticles(props.filesRegistryUri);
  }

  if (props.articles.ids.length === 0) {
    return <p className="no-articles">No articles</p>;
  }

  return (
    <div>
      {props.articles.ids.map(id => {
        return (
          <Article
            key={id}
            id={id}
            title={props.articles.entities[id].title}
            author={props.articles.entities[id].author}
            content={props.articles.entities[id].content}
            address={props.articles.entities[id].address}
            onTip={props.onTip}
          ></Article>
        );
      })}
    </div>
  );
};
