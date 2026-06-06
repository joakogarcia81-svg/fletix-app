-- 1. Modificar tabla messages para soportar adjuntos
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_type TEXT; -- e.g. 'image', 'pdf'

-- 2. Crear tabla chat_reads para contador de no leídos
CREATE TABLE IF NOT EXISTS public.chat_reads (
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (trip_id, user_id)
);

-- Habilitar RLS en chat_reads
ALTER TABLE public.chat_reads ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_reads
CREATE POLICY "Tenant isolation for chat_reads select" 
  ON public.chat_reads FOR SELECT 
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update their own read status" 
  ON public.chat_reads FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own read status update" 
  ON public.chat_reads FOR UPDATE 
  USING (user_id = auth.uid());

-- 3. Crear Storage Bucket para chat_attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat_attachments', 'chat_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para chat_attachments
-- Permitir a usuarios autenticados subir archivos (idealmente se validaría company_id, 
-- pero las políticas de storage manejan RLS un poco diferente. Para MVP, auth.uid() != null)
CREATE POLICY "Authenticated users can upload chat attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat_attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Public access to chat attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat_attachments');

CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'chat_attachments' AND auth.uid() = owner);

-- Añadir chat_reads a la publicación realtime (opcional, pero útil para sincronizar read receipts)
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_reads;
