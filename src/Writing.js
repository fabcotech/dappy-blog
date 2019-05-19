import React, { useState } from "react";

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

export const Writing = WritingComponent;
