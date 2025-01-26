type NoteType = { title?: string; content?: string; id?: string };

type SavedUserNoteType = {
  _id: string;
  title: string;
  createdAt: string;
  id: string;
};

type UserNotesType = SavedUserNoteType[];

type NoteChangeObject = { updatedValue: string; noteId: string }

export type { NoteType, UserNotesType, NoteChangeObject };
