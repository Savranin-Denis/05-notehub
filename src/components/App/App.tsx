import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { useState } from 'react';
import { deleteNote, fetchNotes } from '../services/noteService';
import Pagination from '../Pagination/Pagination';
// import { useDebouncedCallback } from 'use-debounce';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  // const updateSearchQuery = useDebouncedCallback(
  //   (e: React.ChangeEvent) => setSearchQuery(),
  //   300
  // );

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {/* Компонент SearchBox */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={newPage => setPage(newPage)}
            />
          )}
          {/* Кнопка створення нотатки */}
        </header>
        {notes.length > 0 && (
          <NoteList onDelete={id => mutation.mutate(id)} notes={notes} />
        )}
      </div>
    </>
  );
}
