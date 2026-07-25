export interface AuditScore {
  overall: number;
  seo: number;
  performance: number;
  accessibility: number;
}

export interface OpenGraphData {
  title: string | null;
  description: string | null;
  image: string | null;
  site_name?: string | null;
  type?: string | null;
  url?: string | null;
}

export interface AuditData {
  status_code: number;
  load_time_ms: number;
  page_size_bytes: number;
  title: string | null;
  meta_description: string | null;
  has_viewport_meta: boolean;
  has_robots_txt: boolean;
  has_sitemap: boolean;
  canonical_url: string | null;
  open_graph: OpenGraphData;
  headings: {
    h1_count: number;
    h2_count: number;
    h1_text: string[];
  };
  images: {
    total: number;
    missing_alt: number;
    detected_urls?: string[];
  };
  detected_files?: {
    scripts: string[];
    stylesheets: string[];
    media_files?: string[];
  };
  https: boolean;
  redirect_chain: string[];
  score: AuditScore;
}

export interface AuditResponse {
  request_id: string;
  url: string;
  audited_at: string;
  cached: boolean;
  cache_expires_at: string;
  audit: AuditData;
}
