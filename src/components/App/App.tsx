import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { useEffect, useState } from 'react';
import { createNote, deleteNote, fetchNotes } from '../services/noteService';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import type { NewNote } from '../types/note';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsmodalOpen] = useState(false);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openModal = () => {
    setIsmodalOpen(true);
  };

  const closeModal = () => {
    setIsmodalOpen(false);
  };

  const createMutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsmodalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (value: NewNote) => {
    createMutation.mutate(value);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const updateSearchQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setPage(1);
    },
    300
  );

  useEffect(() => {
    if (!isFetching && !isError && searchQuery && notes.length === 0) {
      toast.error('No such note was found.');
    }
  }, [isFetching, isError, searchQuery, notes.length]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={updateSearchQuery} value={searchQuery} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={newPage => setPage(newPage)}
            />
          )}
          {isModalOpen && (
            <Modal onClose={closeModal} onCreateNote={handleCreateNote} />
          )}
          <button onClick={openModal} className={css.button}>
            Create note +
          </button>
        </header>

        {/* {isFetching && <Loader />} */}

        {isFetching ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          notes.length > 0 && (
            <NoteList onDelete={handleDeleteNote} notes={notes} />
          )
        )}

        <Toaster />

        {/* {notes.length > 0 && (
          <NoteList onDelete={handleDeleteNote} notes={notes} />
        )} */}
      </div>
    </>
  );
}
