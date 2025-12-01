import React from 'react';
import { SearchResultItem, LinkedEntity } from '../types';
import { User, Mail, Phone, MapPin, Globe, ExternalLink, Link as LinkIcon, Share2 } from 'lucide-react';

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
      case 'social': return <Share2 className="w-4 h-4" />;
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

  // Separate social links from other linked data
  const socialLinks = item.linkedData?.filter(link => link.type === 'social') || [];
  const otherLinks = item.linkedData?.filter(link => link.type !== 'social') || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900 relative">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-primary-400 shrink-0`}>
              {getIcon(item.type)}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                <span className="uppercase tracking-wider shrink-0">{item.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                <span className="truncate">{item.mainData}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 flex-grow">
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {item.description}
        </p>

        {/* Social Footprint Section */}
        {socialLinks.length > 0 && (
          <div className="mb-6">
             <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Share2 className="w-3 h-3" /> Social Footprint
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link, idx) => {
                const isUrl = link.value.startsWith('http');
                const Wrapper = isUrl ? 'a' : 'div';
                const props = isUrl ? { href: link.value, target: "_blank", rel: "noopener noreferrer" } : {};
                
                return (
                  <Wrapper 
                    key={idx} 
                    {...props as any}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all mb-1 ${
                      isUrl 
                        ? 'bg-primary-950/30 border-primary-500/30 text-primary-300 hover:bg-primary-900/50 hover:border-primary-400 hover:text-white cursor-pointer group/link' 
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Share2 className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate max-w-[120px]">{link.source || 'Profile'}</span>
                    
                    {isUrl ? (
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 ml-1" />
                    ) : (
                      <span className="ml-1 opacity-50 font-mono bg-black/20 px-1.5 rounded truncate max-w-[100px]">{link.value}</span>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Linked Data Section */}
        {otherLinks.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Connected Data
            </h4>
            <div className="space-y-2">
              {otherLinks.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-2 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-slate-500 shrink-0">{getIcon(link.type)}</span>
                    <span className="text-sm text-slate-200 font-mono truncate" title={link.value}>{link.value}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ml-2 shrink-0 ${getConfidenceColor(link.confidence)}`}>
                    {link.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sources / Footer */}
      {item.sources && item.sources.length > 0 && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex flex-wrap gap-2">
              {item.sources.slice(0, 3).map((source, i) => (
                  <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-400 transition-colors bg-slate-950 border border-slate-800 px-2 py-1 rounded hover:border-primary-500/30"
                  >
                      <ExternalLink className="w-3 h-3" />
                      <span className="max-w-[120px] truncate">{source.title || 'Source'}</span>
                  </a>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;