type noteType = { title?: string; content?: string; id?: string };

type SavedUserNoteType = {
  _id: string;
  title: string;
  createdAt: string;
  id: string;
};

type UserNotesType = SavedUserNoteType[];

export type { noteType, UserNotesType };
