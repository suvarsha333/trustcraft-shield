-- Create activity_logs table for tracking all access attempts
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'denied', 'warning')),
  metadata JSONB DEFAULT '{}'::jsonb,
  reason TEXT,
  email TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for activity_logs
CREATE POLICY "Anyone can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- Create a function to log authentication attempts
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  p_email TEXT,
  p_action TEXT,
  p_status TEXT,
  p_reason TEXT,
  p_device TEXT,
  p_ip_address TEXT
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    resource,
    status,
    metadata,
    reason,
    email,
    ip_address
  ) VALUES (
    NULL,
    p_action,
    p_device,
    p_status,
    jsonb_build_object(
      'email', p_email,
      'device', p_device,
      'ip', p_ip_address,
      'timestamp', now()
    ),
    p_reason,
    p_email,
    p_ip_address
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;