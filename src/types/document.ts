
export interface StrategyDocument {
  id: string;
  strategy_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  processed: boolean;
  extracted_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadProgressEvent {
  fileName: string;
  progress: number;
}

export interface DocumentUploadState {
  uploading: boolean;
  progress: Record<string, number>; // fileName -> progress percentage
  error: string | null;
}
