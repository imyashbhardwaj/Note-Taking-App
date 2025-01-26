import axios from 'axios';
import throttle from 'lodash/throttle';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { NoteType, NoteChangeObject } from './types';
import { setSocketListener, emitSocketEvent } from './socketConfig';
import { constants } from '../constants';

const { BACKEND_SERVER } = constants;
const {
  NOTE_CONTENT_UPDATE_EVENT_NAME: noteContentUpdateEventName,
  NOTE_TITLE_UPDATE_EVENT_NAME: noteTitleUpdateEventName,
  SERVER_NOTE_STATE_EVENT_NAME: serverUpdateEventName,
  UPDATE_EVENT_THROTTLE_TIME_IN_MS: updateEventThrottleIntervalInMs,
} = constants;

let typingTimeout: NodeJS.Timeout;
let isTyping = false;

const NoteUpdateWindow = () => {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [currentNote, setCurrentNote] = useState<NoteType>({
    title: '',
    content: '',
    id: '',
  });

  const noteTitleRef = useRef(noteTitle);
  const noteContentRef = useRef(noteContent);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Update refs when note title/content changes
  useEffect(() => {
    noteTitleRef.current = noteTitle;
    noteContentRef.current = noteContent;
  }, [noteTitle, noteContent]);

  // Handle server-side changes to the note
  const applyServerSideChanges = useCallback((noteState: NoteType) => {
    const { title: serverTitle, content: serverContent } = noteState;
    const falseValues = [undefined, ''];
    const shouldIgnoreUpdate = (
      ref: React.MutableRefObject<string>,
      value: string | undefined
    ) =>
      // @ts-ignore
      !falseValues.includes(value) && ref.current.includes(value);

    if (shouldIgnoreUpdate(noteTitleRef, serverTitle)) delete noteState.title;
    if (shouldIgnoreUpdate(noteContentRef, serverContent))
      delete noteState.content;

    if (noteState.title || noteState.content) {
      updateNoteState(noteState);
    }
  }, []);

  // Update state with note changes
  const updateNoteState = (noteState: NoteType) => {
    const { title, content } = noteState;
    if (title) setNoteTitle(title);
    if (content) setNoteContent(content);
  };

  // Fetch the note from the backend
  const fetchNote = useCallback(async () => {
    const noteId = searchParams.get('id');
    if (!noteId) return;

    try {
      const response = await axios.get(
        `${BACKEND_SERVER.ROOT}${BACKEND_SERVER.API_ROUTE}${BACKEND_SERVER.GET_NOTE_ROUTE}`,
        {
          params: { id: noteId },
        }
      );
      const [note] = response.data;
      setCurrentNote(note);
      updateNoteState(note);
    } catch (err) {
      console.error('Error fetching note:', err);
    }
  }, [searchParams]);

  // Setup socket listener and fetch note
  useEffect(() => {
    setSocketListener(serverUpdateEventName, applyServerSideChanges);
    fetchNote();
  }, [applyServerSideChanges, fetchNote]);

  // Create a throttled event emitter for real-time updates
  const createThrottledEventEmitter = (eventName: string) =>
    useCallback(
      throttle((noteChangeObject: NoteChangeObject) => {
        emitSocketEvent(eventName, noteChangeObject);
      }, updateEventThrottleIntervalInMs),
      []
    );

  const handleNoteTitleChange = createThrottledEventEmitter(
    noteTitleUpdateEventName
  );
  const handleNoteContentChange = createThrottledEventEmitter(
    noteContentUpdateEventName
  );

  // Generic input change handler
  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
    emitChange: (change: NoteChangeObject) => void
  ) => {
    const updatedValue = event.currentTarget.value;
    setState(updatedValue);
    emitChange({ updatedValue, noteId: currentNote.id as string });
  };

  // Handlers for title and content changes
  const handleNoteTitleChangeEvent = (
    event: React.FormEvent<HTMLInputElement>
  ) => handleInputChange(event, setNoteTitle, handleNoteTitleChange);

  const handleNoteContentChangeEvent = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => handleInputChange(event, setNoteContent, handleNoteContentChange);

  // Copy URL to clipboard
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('URL copied to clipboard!'))
      .catch((err) => console.error('Failed to copy URL:', err));
  };

  // Navigate to home
  const routeToHome = () => navigate('/');

  return (
    <div className="wide_content" id="NoteUpdateWindowParent">
      <Button id="homePageButton" onClick={routeToHome}>
        Go back
      </Button>
      <h1>Create or Modify your note below:</h1>
      <p>
        Invite your friends to collaborate on the note by sharing the URL.{' '}
        <Button onClick={handleCopyUrl}>Copy URL</Button>
      </p>
      <br />
      <label>
        Note Title:
        <Input
          type="text"
          placeholder="Note Name"
          onChange={handleNoteTitleChangeEvent}
          value={noteTitle}
        />
      </label>
      <br />
      <label>
        Note Content:
        <Textarea
          placeholder="Type your note here."
          onChange={handleNoteContentChangeEvent}
          value={noteContent}
        />
      </label>
    </div>
  );
};

export default NoteUpdateWindow;
