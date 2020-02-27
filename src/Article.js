import React from "react";
import { createPopper } from "@popperjs/core";

export class Article extends React.Component {
  state = {
    tooltipDisplayed: false
  };
  listenningForClicks = false;

  componentWillUnmount() {
    document.removeEventListener("click", this.listenForClicks);
  }

  saveTitleRef = el => {
    console.log(el);
    this.titleRev = el;
  };
  saveTipRef = el => {
    console.log(el);
    this.tipRev = el;
  };

  listenForClicks = e => {
    if (this.state.tooltipDisplayed) {
      this.setState({
        tooltipDisplayed: false
      });
    } else if (e.target.className === `tip-button ${this.props.id}`) {
      this.setState({
        tooltipDisplayed: true
      });
      createPopper(this.titleRev, this.tipRev, {
        placement: "right"
      });
    }
  };
  onDisplayTip = el => {
    // only once
    if (!this.listenningForClicks) {
      this.setState({
        tooltipDisplayed: true
      });
      createPopper(this.titleRev, this.tipRev, {
        placement: "right"
      });
      document.addEventListener("click", this.listenForClicks);
      this.listenningForClicks = true;
    }
  };

  onTip = i => {
    this.props.onTip(i, this.props.address);
  };

  render() {
    return (
      <div key={this.props.id} className="article">
        <div
          style={{ display: this.state.tooltipDisplayed ? "block" : "none" }}
          ref={this.saveTipRef}
          className={`tip-tooltip ${this.props.id}`}
        >
          <ul>
            {[1, 2, 5, 10].map(i => {
              return (
                <li onClick={() => this.onTip(i)} key={i}>
                  Tip {i} REV
                </li>
              );
            })}
          </ul>
        </div>
        <h3 className="title is-3">
          <span ref={this.saveTitleRef}>{this.props.title}</span>
          {this.props.address ? (
            <span
              className={`tip-button ${this.props.id}`}
              onClick={this.onDisplayTip}
            >
              tip
            </span>
          ) : (
            undefined
          )}
        </h3>
        <h6 className="title is-6">
          {this.props.author && this.props.author.length ? (
            <span>Published by {this.props.author}, </span>
          ) : (
            undefined
          )}
          {new Date(parseInt(this.props.id)).toString()}
        </h6>
        <div className="content">
          <div
            className="is-medium"
            dangerouslySetInnerHTML={{
              __html: this.props.content
            }}
          />
        </div>
      </div>
    );
  }
}
