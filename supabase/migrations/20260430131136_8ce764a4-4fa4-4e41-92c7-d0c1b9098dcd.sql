-- Storage bucket para imagens de produtos (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies do bucket: leitura pública, escrita só do próprio produtor (pasta = user_id)
CREATE POLICY "product-images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "product-images producer insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "product-images producer update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "product-images producer delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Atualizar handle_new_user para atribuir role 'produtor' quando metadata indicar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count INT;
  assigned_role app_role;
  signup_role TEXT;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  signup_role := NEW.raw_user_meta_data->>'signup_role';

  IF user_count <= 1 THEN
    assigned_role := 'admin';
  ELSIF signup_role = 'produtor' THEN
    assigned_role := 'produtor';
  ELSE
    assigned_role := 'consumidor';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$function$;

-- Garantir o trigger no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();