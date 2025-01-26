import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AllUserNotes from './AllUserNotes';
import { constants } from '../constants';

const { BACKEND_SERVER } = constants;
function SignedInUI() {
  // Get the user's first name
  const { user } = useUser();
  const navigate = useNavigate();

  function createANewNote() {
    const authorId = user?.id;
    const createNoteReqUrl = `${BACKEND_SERVER.ROOT}${BACKEND_SERVER.API_ROUTE}${BACKEND_SERVER.CREATE_NOTE_ROUTE}`;
    axios
      .post(createNoteReqUrl, { authorId })
      .then((response) => navigate(`/update?id=${response.data.id}`))
      .catch(console.log);
  }

  return (
    <div id="notesView">
      <h1>
        Create a new note {' '}
        <Button id="newNoteButton" onClick={createANewNote}>
          +
        </Button>
      </h1>
      <br></br><br></br>
      {user?.id && <AllUserNotes authorId={user.id} />}
    </div>
  );
}

export default SignedInUI;
