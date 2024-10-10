import { TokenDate } from './dates';

export interface Friend {
  id: number;
  logo: string | null;
  points: number;
  second: number;
  telegram_id: number;
  username: string;
}

export interface LeadboardPerson {
  displayed_name: string;
  id: number;
  points: number;
  telegram_id: number;
  username: string;
}

export interface UserToken {
  token: string;
  workspace: number;
  user: number;
  action: number;
  expired_at: TokenDate;
  created_at: TokenDate;
  action_label: string;
  slugs: string[];
  is_on_sp: [];
  car_files: Record<string, string | null>;
  boost_deals: [];
  sizes: Record<string, number | null>;
  preview_large: Record<string, string | null>;
  preview_small: Record<string, string | null>;
}

export interface UserReferral {
  code: string;
  credit_amount?: number | null;
  current_usage: number | null;
  id?: number;
  max_usage?: number | null;
  only_on_signup?: boolean;
}

export interface UserCountry {
  id: number;
  name: string;
  code: string;
}

export interface UserRegion {
  id: number;
  name: string;
}

export interface UserSubscriptionDescription {
  name: string;
  price: number;
  storage_size: number;
  file_size: number;
  workspace_cnt: number;
  voice_security: boolean;
  smart_contracts: boolean;
  worktime_limit: boolean;
  api_key: boolean;
  trust_location: boolean;
  key_security: boolean;
  pin_security: boolean;
  fa_security: boolean;
  workspace_members: number;
}

export interface UserSubscription {
  id: number;
  status: boolean;
  subscription: UserSubscriptionDescription;
  expired_at: string | null;
}

export interface UserPublicAddress {
  id: number;
  public_address: string;
  created_at: string;
  active: boolean;
  is_unstoppable: boolean;
  is_coinbase: boolean;
  type: boolean;
}

export interface User {
  id: number;
  created_at: string;
  updated_at: string | null;
  email: string | null;
  username: string;
  enabled: boolean;
  referral: UserReferral;
  color: string;
  password: string | null;
  logout: unknown;
  subscription: UserSubscription;
  country: UserCountry | null;
  region: UserRegion | null;
  expired_at: string | null;
  phone: string | null;
  telegram: string;
  logo: string;
  user_public_addresses: UserPublicAddress[];
  stripe_customer_id: number | null;
  stripe_sub_id: number | null;
  token: number;
  is_password_access: unknown;
  notifications: unknown;
  space_available: number | null;
  space_total: number | null;
  ghost_pass_exist: boolean | null;
  ghost_time_enable: unknown;
  public_key: string | null;
  role: string | null;
  displayed_name: string;
  telegram_id: number;
  tg_chat_id: number;
  nonce: unknown;
  workspace_notification_sound: boolean;
  sharing_notification_sound: boolean;
  workspace_notification: boolean;
  sharing_notification: boolean;
  storage: unknown;
  funds: number;
  dateformat: string | null;
  first_login: boolean;
  timezone: string | null;
  message_verification_status: boolean;
  password_access: unknown;
  gps_location: boolean;
  custom_expired_interval: unknown;
  custom_expired_timezone: string | null;
  rewards: number;
  is_mobile: boolean;
  is_premium: boolean;
  bot_token: string | null;
  is_google_authenticator_enabled: boolean;
  is_pin_authenticator_enabled: boolean;
  is_key_authenticator_enabled: boolean;
}
