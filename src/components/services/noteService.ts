import axios from 'axios';
import type { NewNote, Note } from '../types/note';

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api/notes';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteResponse {
  note: Note;
}

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number = 12
): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params: { search, page, perPage },
    headers: { Authorization: `Bearer ${myKey}` },
  });

  return response.data;
}

export async function createNote(
  newNote: NewNote
): Promise<CreateNoteResponse> {
  const response = await axios.post<CreateNoteResponse>(BASE_URL, newNote, {
    headers: { Authorization: `Bearer ${myKey}` },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`BASE_URL/${id}`, {
    headers: { Authorization: `Bearer ${myKey}` },
  });
  return response.data;
}
