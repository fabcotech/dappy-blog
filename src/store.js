import { createStore } from "redux";

const initialState = {
  filesRegistryUri: undefined,
  entryRegistryUri: undefined,
  publicKey: undefined,
  nonce: undefined,
  identified: false,
  articles: {
    ids: [],
    entities: {}
  },
  writing: false
};

const reducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "INIT": {
      return {
        ...state,
        filesRegistryUri: action.payload.filesRegistryUri,
        entryRegistryUri: action.payload.entryRegistryUri,
        publicKey: action.payload.publicKey,
        nonce: action.payload.nonce
      };
    }
    case "IDENTIFIED": {
      return {
        ...state,
        identified: true
      };
    }
    case "UPDATE_NONCE": {
      return {
        ...state,
        nonce: action.payload
      };
    }
    case "GO_HOME": {
      return {
        ...state,
        writing: false
      };
    }
    case "TOGGLE_WRITE": {
      return {
        ...state,
        writing: !state.writing
      };
    }
    case "UPDATE_ARTICLES": {
      const ids = Object.keys(action.payload).sort((a, b) => {
        return parseInt(a) - parseInt(b) < 0 ? 1 : -1;
      });
      return {
        ...state,
        articles: {
          ids: ids,
          entities: action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
