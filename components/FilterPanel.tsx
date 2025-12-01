import React from 'react';
import { SearchFilters } from '../types';
import { ShieldAlert, Share2, SearchCheck, GitMerge, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, filters, setFilters, onReset }) => {
  if (!isOpen) return null;

  const toggleFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
        // Handle boolean toggles only
        if (typeof prev[key] === 'boolean') {
            return { ...prev, [key]: !prev[key] };
        }
        return prev;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => toggleFilter('exactMatch')}
            className={`flex items-start gap-3 p-3 rounded-md border transition-all text-left ${
              filters.exactMatch 
                ? 'bg-primary-900/20 border-primary-500/50 text-primary-200' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <SearchCheck className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Exact Match</h4>
              <p className="text-xs opacity-70 mt-1">Strict string matching.</p>
            </div>
          </button>

          <button
            onClick={() => toggleFilter('crossReference')}
            className={`flex items-start gap-3 p-3 rounded-md border transition-all text-left ${
              filters.crossReference 
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-200' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <GitMerge className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Data Cross-Ref</h4>
              <p className="text-xs opacity-70 mt-1">Link multiple inputs.</p>
            </div>
          </button>

          <button
            onClick={() => toggleFilter('includeSocials')}
            className={`flex items-start gap-3 p-3 rounded-md border transition-all text-left ${
              filters.includeSocials
                ? 'bg-blue-900/20 border-blue-500/50 text-blue-200' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Social Networks</h4>
              <p className="text-xs opacity-70 mt-1">Include social profiles.</p>
            </div>
          </button>

          <button
            onClick={() => toggleFilter('deepSearch')}
            className={`flex items-start gap-3 p-3 rounded-md border transition-all text-left ${
              filters.deepSearch
                ? 'bg-purple-900/20 border-purple-500/50 text-purple-200' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Deep Intelligence</h4>
              <p className="text-xs opacity-70 mt-1">High-reasoning (Slow).</p>
            </div>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors px-3 py-1 rounded hover:bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterPanel;