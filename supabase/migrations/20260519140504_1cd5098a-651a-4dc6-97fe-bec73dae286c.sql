
CREATE TABLE public.email_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can subscribe
CREATE POLICY "Anyone can subscribe"
ON public.email_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read the list
CREATE POLICY "Admins can read subscriptions"
ON public.email_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
