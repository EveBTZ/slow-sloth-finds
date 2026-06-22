
CREATE TYPE public.availability_status AS ENUM ('available_now', 'available_soon', 'not_available');

CREATE TABLE public.freelancer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  availability public.availability_status NOT NULL DEFAULT 'available_now',
  hourly_rate_min INT,
  hourly_rate_max INT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  avatar_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  portfolio_url TEXT,
  portfolio_filename TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.freelancer_profiles TO authenticated;
GRANT SELECT ON public.freelancer_profiles TO anon;
GRANT ALL ON public.freelancer_profiles TO service_role;

ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published profiles are viewable by everyone"
  ON public.freelancer_profiles FOR SELECT
  USING (published = true OR auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.freelancer_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.freelancer_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.freelancer_profiles FOR DELETE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_freelancer_profiles_updated
BEFORE UPDATE ON public.freelancer_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.freelancer_profiles (id, full_name, job_title)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'job_title', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
