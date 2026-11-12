DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Testimonial author profiles are public" ON public.profiles
FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.testimonials t WHERE t.user_id = profiles.id));