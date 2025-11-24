-- Create user_did_mapping table to link Supabase users with DIDs
CREATE TABLE public.user_did_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  did TEXT NOT NULL,
  persona_id UUID REFERENCES persona(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(did)
);

-- Enable RLS
ALTER TABLE public.user_did_mapping ENABLE ROW LEVEL SECURITY;

-- Users can view their own DID mapping
CREATE POLICY "Users can view their own DID mapping"
ON public.user_did_mapping
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own DID mapping
CREATE POLICY "Users can insert their own DID mapping"
ON public.user_did_mapping
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own DID mapping
CREATE POLICY "Users can update their own DID mapping"
ON public.user_did_mapping
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage all DID mappings
CREATE POLICY "Admins can manage all DID mappings"
ON public.user_did_mapping
FOR ALL
TO authenticated
USING (has_admin_role());

-- Add trigger for updated_at
CREATE TRIGGER update_user_did_mapping_updated_at
BEFORE UPDATE ON public.user_did_mapping
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_user_did_mapping_user_id ON public.user_did_mapping(user_id);
CREATE INDEX idx_user_did_mapping_did ON public.user_did_mapping(did);

-- Add comments
COMMENT ON TABLE public.user_did_mapping IS 'Maps Supabase user IDs to DIDs for AA-API authentication';
COMMENT ON COLUMN public.user_did_mapping.did IS 'Decentralized Identifier for AA-API authentication';
COMMENT ON COLUMN public.user_did_mapping.verified_at IS 'When the DID was verified via AA-API challenge-verify flow';