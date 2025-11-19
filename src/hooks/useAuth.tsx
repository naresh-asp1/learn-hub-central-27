import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

export const useAuth = (requiredRole?: Database['public']['Enums']['app_role']) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Database['public']['Enums']['app_role'] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setTimeout(() => {
          loadUserRole(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setRole(null);
        if (requiredRole) {
          navigate('/auth');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (requiredRole) {
          navigate('/auth');
        }
        setLoading(false);
        return;
      }

      setUser(session.user);
      await loadUserRole(session.user.id);
    } catch (error) {
      console.error('Auth error:', error);
      setLoading(false);
    }
  };

  const loadUserRole = async (userId: string) => {
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setRole(roleData.role);

      if (requiredRole && roleData.role !== requiredRole) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Role loading error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return { user, role, loading, logout };
};
