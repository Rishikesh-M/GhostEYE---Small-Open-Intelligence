export type DataType = 'all' | 'username' | 'email' | 'phone' | 'address' | 'social' | 'text' | 'url';

export interface SearchFilters {
  dataType: DataType;
  exactMatch: boolean;
  includeSocials: boolean;
  deepSearch: boolean;
  crossReference: boolean;
}

export interface LinkedEntity {
  type: DataType;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  source?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  mainData: string;
  type: DataType;
  linkedData: LinkedEntity[];
  sources: { uri: string; title: string }[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GeminiSearchResponse {
  items: SearchResultItem[];
  rawText: string;
  groundingChunks: GroundingChunk[];
}