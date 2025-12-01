import React from 'react';
import { SearchResultItem, LinkedEntity } from '../types';
import { User, Mail, Phone, MapPin, Globe, ExternalLink, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  item: SearchResultItem;
}

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      case 'username': return <User className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900 relative">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-primary-400`}>
              {getIcon(item.type)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                <span className="uppercase tracking-wider">{item.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="truncate max-w-[150px]">{item.mainData}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-5">
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {item.description}
        </p>

        {/* Linked Data Section */}
        {item.linkedData && item.linkedData.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Connected Data
            </h4>
            <div className="space-y-2">
              {item.linkedData.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-2 rounded border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{getIcon(link.type)}</span>
                    <span className="text-sm text-slate-200 font-mono">{link.value}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getConfidenceColor(link.confidence)}`}>
                    {link.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources / Footer */}
        {item.sources && item.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
             <div className="flex flex-wrap gap-2">
                {item.sources.slice(0, 3).map((source, i) => (
                    <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-400 transition-colors bg-slate-950 px-2 py-1 rounded"
                    >
                        <ExternalLink className="w-3 h-3" />
                        <span className="max-w-[120px] truncate">{source.title || 'Source'}</span>
                    </a>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;