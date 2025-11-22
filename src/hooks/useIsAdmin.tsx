import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            id,
            role_id,
            roles!inner(name)
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setIsAdmin(false);
        } else {
          const roles = (data as any[]) || [];
          const hasAdminRole = roles.some((row) =>
            typeof row?.roles?.name === 'string' && row.roles.name.toLowerCase() === 'admin'
          );
          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  return { isAdmin, loading };
}
