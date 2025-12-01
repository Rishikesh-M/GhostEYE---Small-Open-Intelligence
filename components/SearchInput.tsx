import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { DataType } from '../types';

interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  dataType: DataType;
  setDataType: (t: DataType) => void;
  onSearch: () => void;
  loading: boolean;
  onToggleFilters: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  dataType,
  setDataType,
  onSearch,
  loading,
  onToggleFilters
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const types: DataType[] = ['all', 'username', 'email', 'phone', 'address', 'text', 'url'];

  return (
    <div className="w-full max-w-4xl mx-auto relative z-20">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1">
          
          {/* Type Selector */}
          <div className="relative hidden md:block border-r border-slate-700 pr-2">
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataType)}
              className="appearance-none bg-transparent text-slate-300 font-medium py-3 pl-4 pr-8 outline-none cursor-pointer hover:text-white transition-colors uppercase text-xs tracking-wider"
            >
              {types.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-slate-300">
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Main Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search target... (e.g. 'John Doe' or try: -t 'specific text')"
            className="flex-grow bg-transparent text-white px-4 py-3 outline-none placeholder-slate-500 font-mono text-sm md:text-base"
          />

          {/* Actions */}
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={onToggleFilters}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onSearch}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-md font-medium transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="hidden md:inline">Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text / Flag Usage Guide */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-mono justify-center md:justify-start px-2 opacity-80">
         <span className="flex items-center gap-1"><span className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">-u</span> username</span>
         <span className="flex items-center gap-1"><span className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">-e</span> email</span>
         <span className="flex items-center gap-1"><span className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">-t</span> text/content</span>
         <span className="flex items-center gap-1"><span className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">-l</span> url/link</span>
         <span className="flex items-center gap-1"><span className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">-all</span> everything</span>
      </div>
    </div>
  );
};

export default SearchInput;