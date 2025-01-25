import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCallback } from 'react';
import throttle from 'lodash/throttle';
import type { noteType } from './types';
import { setSocketListener, emitSocketEvent } from './socketConfig';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { constants } from '../constants';

const { BACKEND_SERVER } = constants;
const {
  NOTE_CONTENT_UPDATE_EVENT_NAME: noteContentUpdateEventName,
  NOTE_TITLE_UPDATE_EVENT_NAME: noteTitleUpdateEventName,
  SERVER_NOTE_STATE_EVENT_NAME: serverUpdateEventName,
  UPDATE_EVENT_THROTTLE_TIME_IN_MS: updateEventThrottleIntervalInMs,
} = constants;

let typingTimeout: NodeJS.Timeout;

function NoteUpdateWindow() {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [currentNote, setCurrentNote] = useState({
    title: '',
    content: '',
    id: '',
  });
  const noteTitleRef = useRef(noteTitle);
  const noteContentRef = useRef(noteContent);

  useEffect(() => {
    noteTitleRef.current = noteTitle;
    noteContentRef.current = noteContent;
  }, [noteTitle, noteContent]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let isTyping = false;

  function applyServerSideChanges(noteState: noteType) {
    console.log('got serverstate', noteState);
    const { title: serverSideTitle, content: serverSideContent } = noteState;
    const falseValues = [undefined, ''];
    const shouldIgnoreTitleUpdate =
      !falseValues.includes(serverSideTitle) &&
      noteTitleRef.current.includes(serverSideTitle);
    const shouldIgnoreContentUpdate =
      !falseValues.includes(serverSideContent) &&
      noteContentRef.current.includes(serverSideContent);
    if (shouldIgnoreTitleUpdate) {
      delete noteState.title;
    }
    if (shouldIgnoreContentUpdate) {
      delete noteState.content;
    }
    if (noteState.title != undefined || noteState.content != undefined)
      return setNoteState(noteState);
  }

  function setNoteState(noteState: noteType) {
    console.log(`setting serverState ${JSON.stringify(noteState)}`);
    const { title, content } = noteState;
    if (title != undefined) setNoteTitle(title);
    if (content != undefined) setNoteContent(content);
  }

  function setupComponentEffects() {
    setSocketListener(serverUpdateEventName, applyServerSideChanges);
    getNote();
  }

  async function getNote() {
    const noteId = searchParams.get('id');
    try {
      const response = await axios.get(
        `${BACKEND_SERVER.URL}${BACKEND_SERVER.GET_NOTE_ROUTE}`,
        {
          params: { id: noteId },
        }
      );
      const [note] = response.data;
      // Set the notes data
      setCurrentNote(note);
      setNoteState(note);
    } catch (err) {
      console.error(err);
    }
  }

  function routeToHome() {
    navigate('/');
  }

  const createThrottledEventEmitter = (eventName: string) => {
    clearTimeout(typingTimeout);
    isTyping = true;
    typingTimeout = setTimeout(() => {
      isTyping = false;
    }, 300);
    return useCallback(
      throttle((noteChangeObject: { updatedValue: string; noteId: string }) => {
        emitSocketEvent(eventName, noteChangeObject);
      }, updateEventThrottleIntervalInMs), // Throttle interval (300ms)
      []
    );
  };

  const handleNoteTitleChange = createThrottledEventEmitter(
    noteTitleUpdateEventName
  );
  const handleNoteContentChange = createThrottledEventEmitter(
    noteContentUpdateEventName
  );

  const handleInputChangeEvent = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    notePropertyUpdateCb: (value: string) => void,
    handleNoteChange: (noteChangeObject: {
      updatedValue: string;
      noteId: string;
    }) => void
  ) => {
    const updatedValue = event.currentTarget.value;
    notePropertyUpdateCb(updatedValue);
    const noteChangeObject = {
      updatedValue,
      noteId: currentNote.id,
    };
    handleNoteChange(noteChangeObject);
  };

  function handleNoteTitleChangeEvent(
    event: React.FormEvent<HTMLInputElement>
  ) {
    handleInputChangeEvent(event, setNoteTitle, handleNoteTitleChange);
  }

  function handleNoteContentChangeEvent(
    event: React.FormEvent<HTMLTextAreaElement>
  ) {
    handleInputChangeEvent(event, setNoteContent, handleNoteContentChange);
  }

  useEffect(setupComponentEffects, []);

  function handleCopyUrl() {
    const currentUrl = window.location.href; // Get the current window URL
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy URL:', error);
      });
  }

  return (
    <div className="wide_content" id="NoteUpdateWindowParent">
      <Button id="homePageButton" onClick={routeToHome}>
        Go back
      </Button>
      <h1>You can Create/Modify your note below:</h1>
      **Invite your Friends to collaborate on note, just send them the url{' '}
      <Button onClick={handleCopyUrl}>Copy Url</Button>
      <br />
      <br />
      Note Title:
      <Input
        type="text"
        placeholder="Note Name"
        onChange={handleNoteTitleChangeEvent}
        value={noteTitle}
      />
      <br />
      Note Content:
      <Textarea
        placeholder="Type your Note here."
        onChange={handleNoteContentChangeEvent}
        value={noteContent}
      />
    </div>
  );
}

export default NoteUpdateWindow;
