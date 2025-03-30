
-- Create RPC functions to update and create user preferences
-- These functions bypass RLS policies

-- Function to update user preference
CREATE OR REPLACE FUNCTION public.update_user_preference(
  p_user_id INT,
  p_light_meal BOOLEAN,
  p_updated_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_preferences
  SET 
    light_meal = p_light_meal,
    updated_at = p_updated_at
  WHERE user_id = p_user_id;
END;
$$;

-- Function to create user preference
CREATE OR REPLACE FUNCTION public.create_user_preference(
  p_user_id INT,
  p_light_meal BOOLEAN,
  p_created_at TIMESTAMPTZ,
  p_updated_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_preferences (
    user_id,
    light_meal,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_light_meal,
    p_created_at,
    p_updated_at
  );
END;
$$;
