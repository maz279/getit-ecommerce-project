-- Add missing foreign key constraints and fix nullable columns

-- Add foreign key for file_uploads.user_id
ALTER TABLE public.file_uploads 
ADD CONSTRAINT file_uploads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key for system_logs.user_id  
ALTER TABLE public.system_logs
ADD CONSTRAINT system_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add foreign key for error_tracking.user_id
ALTER TABLE public.error_tracking
ADD CONSTRAINT error_tracking_user_id_fkey  
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add foreign key for audit_logs.user_id
ALTER TABLE public.audit_logs
ADD CONSTRAINT audit_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add updated_at triggers for relevant tables
CREATE TRIGGER update_file_uploads_updated_at
  BEFORE UPDATE ON public.file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance on user queries
CREATE INDEX idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX idx_error_tracking_user_id ON public.error_tracking(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Add missing updated_at column to file_uploads
ALTER TABLE public.file_uploads 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();