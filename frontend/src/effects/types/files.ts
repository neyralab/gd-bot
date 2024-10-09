import { User, UserToken } from './users';

export interface FileGateway {
  same_ip_upload: boolean;
  id: number;
  url: string;
  type: string;
  upload_chunk_size: number;
  interim_chunk_size: number;
}

export interface FileToken {
  jwt_ott: string;
  user_tokens: UserToken;
  gateway: FileGateway;
  storage_providers: Record<string, string | null>;
  is_on_storage_provider: Record<string, boolean | null>;
  upload_chunk_size: Record<string, number | null>;
}

export interface FileUserFavorite {
  id: number;
  created_at: string;
  user: User;
}

export interface FileStatistics {
  id: number;
  created: number;
  viewed: number;
  renamed: number;
  moved: number;
  downloaded: number;
  commented: number;
  deleted: number;
  file_cnt: number;
  member_cnt: number;
  guest_cnt: number;
  folder_cnt: number;
  recovered: number;
}

export interface FileShareRight {
  id: number;
  can_view: boolean;
  can_edit: boolean;
  can_comment: boolean;
  user: unknown;
  invite: unknown;
  input: unknown;
  message: unknown;
  expired_at: number;
}

export interface FileShare {
  created_at: string;
  updated_at: string;
  id: number;
  type: number;
  share_right: FileShareRight;
  keyword: string;
  user_role: string | null;
}

export interface File {
  id: number;
  slug: string;
  title: string;
  type: string;
  extension: string;
  updated: string | null;
  file: FileDetails;
}

export interface PPVFile {
  id: number;
  file: FileDetails;
  file_name: string;
  description: string;
  price_view: number;
  price_download: number;
  currency: number;
  status: number;
  created_at: string;
  updated_at: string | null;
}

export interface FileDetails {
  id: number;
  type: number;
  user: User;
  name: string;
  is_public: true;
  is_denied: boolean;
  is_printed: true;
  offline_mode: boolean;
  is_delegated: boolean;
  is_hidden: boolean;
  is_downloaded: boolean;
  is_ai_generated: boolean;
  can_delete: boolean;
  is_on_storage_provider: boolean;
  ipfs_hash: string | null;
  is_clientside_encrypted: boolean;
  entry_statistic: FileStatistics;
  shares: FileShare[];
  ppv_file: unknown;
  entry_clientside_key: string | null;
  securities: unknown[];
  entry_groups: unknown[];
  geo_securities: unknown[];
  tags: string[];
  car_file: string;
  cid: unknown | null;
  upload_chunk_size: number | null;
  color: [];
  description: string | null;
  user_favorites: FileUserFavorite[];
  trusted_members: unknown[];
  storage_provider: unknown;
  created_at: string;
  updated_at: string | null;
  slug: string;
  preview_small: string | null;
  preview_large: string | null;
  convert_video: unknown;
  size: number;
  converted_size: number | null;
  mime: string;
  converted_mime: string | null;
  extension: string;
  converted_extension: string | null;
  root_cid: unknown | null;
}
