export interface AppNotification {
  id: string;
  company_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  action_url?: string;
  read_at: string | null;
  created_at: string;
}

export type NotificationType =
  | 'nuevo_viaje'
  | 'viaje_asignado'
  | 'mensaje_nuevo'
  | 'cambio_estado'
  | 'documento_vencido'
  | 'alerta_operativa'
  | 'viaje_cercano';

export type NotificationPreferences = Record<NotificationType, boolean>;

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; label: string }> = {
  nuevo_viaje:       { icon: 'truck',       color: '#6366f1', label: 'Nuevo Viaje' },
  viaje_asignado:    { icon: 'check-circle', color: '#22c55e', label: 'Viaje Asignado' },
  mensaje_nuevo:     { icon: 'message',     color: '#3b82f6', label: 'Mensaje Nuevo' },
  cambio_estado:     { icon: 'refresh',     color: '#f59e0b', label: 'Cambio de Estado' },
  documento_vencido: { icon: 'file-warning', color: '#ef4444', label: 'Documento Vencido' },
  alerta_operativa:  { icon: 'alert',       color: '#f97316', label: 'Alerta Operativa' },
  viaje_cercano:     { icon: 'map-pin',     color: '#14b8a6', label: 'Viaje Cercano' },
};
