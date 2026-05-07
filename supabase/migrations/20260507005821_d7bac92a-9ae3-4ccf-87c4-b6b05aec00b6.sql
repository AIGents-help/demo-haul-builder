INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE lower(email) IN ('tonykates@gmail.com','coreydiantonio18@icloud.com','dakotaskyekates@gmail.com')
ON CONFLICT DO NOTHING;