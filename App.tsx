import React, { useState, useEffect } from 'react';
import { DataType, SearchFilters, GeminiSearchResponse } from './types';
import { searchIntelligence } from './services/geminiService';
import SearchInput from './components/SearchInput';
import FilterPanel from './components/FilterPanel';
import ResultCard from './components/ResultCard';
import { Shield, Database, Activity, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';

const DEFAULT_FILTERS: SearchFilters = {
  dataType: 'all',
  exactMatch: false,
  includeSocials: true,
  deepSearch: false,
  crossReference: true,
};

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [query, setQuery] = useState(() => localStorage.getItem('nexus_query') || '');
  
  const [dataType, setDataType] = useState<DataType>(() => {
    return (localStorage.getItem('nexus_dataType') as DataType) || 'all';
  });

  const [filters, setFilters] = useState<SearchFilters>(() => {
    const saved = localStorage.getItem('nexus_filters');
    return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
  });

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GeminiSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('nexus_query', query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem('nexus_dataType', dataType);
  }, [dataType]);

  useEffect(() => {
    localStorage.setItem('nexus_filters', JSON.stringify(filters));
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDataType('all');
    // We intentionally do not clear the query text as the user might want to re-run it with clean filters
  };

  const parseSearchFlags = (input: string) => {
    const flagMap: { [key: string]: DataType } = {
      '-u': 'username', '--username': 'username',
      '-e': 'email',    '--email': 'email',
      '-p': 'phone',    '--phone': 'phone',
      '-a': 'address',  '--address': 'address',
      '-s': 'social',   '--social': 'social',
      '-t': 'text',     '--text': 'text', '--title': 'text', '--content': 'text',
      '-l': 'url',      '--link': 'url', '--url': 'url',
      '-all': 'all'
    };

    const tokens = input.split(/\s+/);
    let newQueryParts: string[] = [];
    let foundType: DataType | null = null;

    for (const token of tokens) {
      if (flagMap[token.toLowerCase()]) {
        foundType = flagMap[token.toLowerCase()];
      } else {
        newQueryParts.push(token);
      }
    }

    return {
      cleanQuery: newQueryParts.join(' '),
      detectedType: foundType
    };
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    // Parse flags from the query (e.g., "john_doe -u")
    const { cleanQuery, detectedType } = parseSearchFlags(query);

    // If a type flag was used, update the state to reflect it
    let activeDataType = dataType;
    if (detectedType) {
      setDataType(detectedType);
      setQuery(cleanQuery); // Clean up the input box
      activeDataType = detectedType;
    }

    // Sync dataType from input to filters
    const activeFilters = { ...filters, dataType: activeDataType };

    try {
      const result = await searchIntelligence(cleanQuery, activeFilters);
      setResponse(result);
    } catch (err) {
      setError("Intelligence gathering failed. Please check your connection or API key quota.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-primary-500/30 selection:text-white">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-16 text-center">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 shadow-xl shadow-primary-500/10">
                <Database className="w-8 h-8 text-primary-500" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight mb-4">
            GHOST <span className="font-light text-slate-400">EYE</span>
          </h1>
          <p className="text-slate-500 max-w-lg text-sm md:text-base leading-relaxed">
            Advanced data correlation engine. Connect usernames, emails, and digital footprints using public data sources.
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-12">
          <SearchInput 
            query={query} 
            setQuery={setQuery} 
            dataType={dataType}
            setDataType={setDataType}
            onSearch={handleSearch}
            loading={loading}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          <FilterPanel 
            isOpen={showFilters} 
            filters={filters} 
            setFilters={setFilters} 
            onReset={handleResetFilters}
          />
        </section>

        {/* Status Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="max-w-4xl mx-auto mb-12 text-center animate-pulse">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-primary-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-mono tracking-widest uppercase">
                {filters.deepSearch ? 'Analyzing Global Data Streams...' : 'Scanning Public Records...'}
              </span>
            </div>
          </div>
        )}

        {/* Results Area */}
        {response && !loading && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Meta Stats Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Intelligence Report
                </h2>
                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
                  {response.items.length} Entities Found
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-2 md:mt-0">
                Sources Scanned via Google Grounding
              </div>
            </div>

            {/* Structured Grid */}
            {response.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {response.items.map((item, idx) => (
                  <ResultCard key={item.id || idx} item={item} />
                ))}
              </div>
            ) : (
               <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 text-center">
                  <p className="text-slate-400 mb-2">No structured profiles found for this query.</p>
                  <p className="text-slate-600 text-sm">However, raw intelligence may be available below.</p>
               </div>
            )}

            {/* Fallback/Raw Data / Grounding Links */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Shield className="w-4 h-4" />
                 Source Analysis & Grounding
              </h3>
              
              {/* Display grounding links cleanly */}
              {response.groundingChunks && response.groundingChunks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {response.groundingChunks.map((chunk, i) => (
                    chunk.web?.uri ? (
                        <a 
                            key={i} 
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-primary-500/30 px-3 py-2 rounded-lg transition-all text-xs text-slate-300"
                        >
                            <ExternalLink className="w-3 h-3 text-primary-500" />
                            <span className="truncate max-w-[200px]">{chunk.web.title}</span>
                        </a>
                    ) : null
                  ))}
                </div>
              )}

              {/* Raw textual summary from the AI if needed */}
              <div className="prose prose-invert prose-sm max-w-none text-slate-400 font-mono bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 whitespace-pre-wrap">
                 {/* Only show the raw text if we couldn't parse items efficiently or to show the summary part */}
                 {response.items.length === 0 ? response.rawText : "Primary data extracted above. Refer to sources for verification."}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 py-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>© 2025 Nexus Intel. Data provided via public sources using Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
