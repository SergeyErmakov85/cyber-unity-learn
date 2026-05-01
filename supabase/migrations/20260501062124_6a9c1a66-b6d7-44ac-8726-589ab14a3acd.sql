-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Validation via trigger (length + rating range)
CREATE OR REPLACE FUNCTION public.validate_testimonial()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.content IS NULL OR length(btrim(NEW.content)) < 10 THEN
    RAISE EXCEPTION 'Отзыв должен содержать минимум 10 символов';
  END IF;
  IF length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'Отзыв не может быть длиннее 1000 символов';
  END IF;
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Оценка должна быть от 1 до 5';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_testimonial_trigger
BEFORE INSERT OR UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.validate_testimonial();

-- RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can view testimonials
CREATE POLICY "Testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT
  USING (true);

-- Only authenticated users can insert their own testimonials
CREATE POLICY "Authenticated users can create their own testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own testimonials
CREATE POLICY "Users can update their own testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own testimonials
CREATE POLICY "Users can delete their own testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_testimonials_created_at ON public.testimonials(created_at DESC);
CREATE INDEX idx_testimonials_user_id ON public.testimonials(user_id);

-- Allow public read access to profiles (name + avatar_url) so testimonial authors are visible to all visitors
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);