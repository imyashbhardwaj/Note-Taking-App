const constants = {
  NOTE_TITLE_UPDATE_EVENT_NAME: "Note Name Update",
  NOTE_CONTENT_UPDATE_EVENT_NAME: "Note Content Update",
  SERVER_NOTE_STATE_EVENT_NAME: "Server State",
  UPDATE_EVENT_THROTTLE_TIME_IN_MS: 50,
  BACKEND_SERVER:{
    URL: `http://35.209.161.69/api`,
    GET_NOTE_ROUTE: "/getNote",
    GET_NOTES_ROUTE: "/getNotes",
    UPDATE_NOTE_ROUTE: "/updateNote",
    CREATE_NOTE_ROUTE: "/create",
  }
};

export {constants};
