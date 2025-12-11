export type ThemeColor = 'white' | 'blue' | 'purple' | 'green' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  theme: ThemeColor;
  credits: number;
  password?: string; // For mock auth only
  status: 'active' | 'banned';
  createdAt: number;
}

export interface AppFeature {
  id: string;
  label: string;
  path: string;
  icon: string;
  enabled: boolean;
  category: 'create' | 'media' | 'social' | 'utility';
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface ImageConfig {
  aspectRatio: string;
  style: string;
  quality: 'standard' | 'hd';
}

export interface VideoConfig {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export interface SystemLog {
  id: string;
  action: string;
  admin: string;
  timestamp: number;
}
