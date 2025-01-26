import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { constants } from '../constants';
import type { UserNotesType } from './types';

const { BACKEND_SERVER } = constants;

function allUserNotes(props: { authorId: string }) {
  const [userNotes, setUserNotes] = useState([] as UserNotesType);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserNotes() {
      try {
        const getNotesRouteUrl = `${BACKEND_SERVER.ROOT}${BACKEND_SERVER.API_ROUTE}${BACKEND_SERVER.GET_NOTES_ROUTE}`;
        const response = await axios.get(getNotesRouteUrl, {
          params: { authorId: props },
        });
        setUserNotes(response.data); // Set the notes data
      } catch (err) {
        setError('Failed to fetch notes');
        console.error(err);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }

    fetchUserNotes();
  }, [props]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Found {userNotes.length} User Notes:</h2>
      <Table id="notesTable">
        <TableCaption>All of your Notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userNotes.map((note) => (
            <TableRow
              key={note._id}
              onClick={() => navigate(`/update?id=${note.id}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell className="font-medium">{note.title}</TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
              <TableCell>{note.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default allUserNotes;
