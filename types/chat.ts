export interface ChatMessage {
  id: string;
  company_id: string;
  trip_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  attachment_type?: string;
  created_at: string;
  deleted_at?: string;
  // Relational data
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface ChatRead {
  trip_id: string;
  user_id: string;
  last_read_at: string;
}

export interface ChatUserStatus {
  user_id: string;
  online_at: string;
  is_typing: boolean;
}
