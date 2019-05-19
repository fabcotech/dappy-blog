import React, { useState } from "react";
import { connect } from "react-redux";

import { REGISTRY_URI, UNFORGEABLE_NAME_ID } from "./index";

const WritingComponent = props => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="form">
      <h4 className="title is-4">Write article</h4>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            onChange={e => setTitle(e.target.value)}
            className="input"
            type="text"
            placeholder="Article title"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Content</label>
        <div className="control">
          <textarea
            className="textarea"
            type="text"
            placeholder="Article content"
            onChange={e => setContent(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button
            onClick={() =>
              props.sendArticle({
                title: title,
                content: content
              })
            }
            type="button"
            className="button is-dark"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export const Writing = connect(
  undefined,
  dispatch => {
    return {
      sendArticle: payload => {
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
)(WritingComponent);
