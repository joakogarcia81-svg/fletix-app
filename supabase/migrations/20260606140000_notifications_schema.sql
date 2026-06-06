-- Fletix Notifications Schema Upgrade
-- Adds metadata, action_url to notifications and notification_preferences to profiles

-- 1. Añadir columnas a notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS action_url TEXT;

-- 2. Añadir preferencias de notificación a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "nuevo_viaje": true,
    "viaje_asignado": true,
    "mensaje_nuevo": true,
    "cambio_estado": true,
    "documento_vencido": true,
    "alerta_operativa": true,
    "viaje_cercano": true
  }'::jsonb;

-- 3. Índice para consultas rápidas de notificaciones no leídas
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, read_at) 
  WHERE read_at IS NULL;
