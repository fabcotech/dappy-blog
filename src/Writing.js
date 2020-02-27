import React from "react";

class WritingComponent extends React.Component {
  componentDidMount() {
    var quill = new Quill("#editor", {
      theme: "snow"
    });
    quill.on("text-change", () => {
      this.content = quill.root.innerHTML;
    });

    this.address = window.blockchainUtils.revAddressFromPublicKey(
      this.props.publicKey
    );
  }

  render() {
    return (
      <div className="form writing">
        <h4 className="title is-4">Write article</h4>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              onChange={e => (this.title = e.target.value)}
              className="input"
              type="text"
              placeholder="Article title"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Author</label>
          <div className="control">
            <input
              onChange={e => (this.author = e.target.value)}
              className="input"
              type="text"
              placeholder="Article author"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Address (for tipping)</label>
          <div className="control">
            <input
              defaultValue={
                window.blockchainUtils
                  ? window.blockchainUtils.revAddressFromPublicKey(
                      this.props.publicKey
                    )
                  : undefined
              }
              onChange={e => {
                console.log(this.address, e.target.value);
                this.address = e.target.value;
              }}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <div id="editor" />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              onClick={() => {
                this.props.sendArticle({
                  registryUri: this.props.registryUri,
                  unforgeableNameId: this.props.unforgeableNameId,
                  title: this.title,
                  author: this.author,
                  content: this.content,
                  nonce: this.props.nonce,
                  address: this.address
                });
              }}
              type="button"
              className="button is-light"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const Writing = WritingComponent;
