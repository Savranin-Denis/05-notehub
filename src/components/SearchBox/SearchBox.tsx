import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function SearchBox({ onSearch, value }: SearchBoxProps) {
  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={value}
        onChange={onSearch}
      />
    </>
  );
}
