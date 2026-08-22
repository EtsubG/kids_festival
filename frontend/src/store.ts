import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/auth';
import type { Participant } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiParticipant {
  id: string;
  parentName: string;
  answers: Record<string, string>;
  luckyNumber: number;
  createdAt: string;
}

// For localStorage fallback
const STORAGE_KEY = 'festival_participants_v1';
const COUNTER_KEY = 'festival_counter_v1';

type Listener = (participants: Participant[]) => void;
const listeners = new Set<Listener>();

function readStore(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Participant[]) : [];
  } catch {
    return [];
  }
}

function writeStore(list: Participant[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  listeners.forEach((l) => l(list));
}

function readCounter(): number {
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    return raw ? parseInt(raw, 10) : 100;
  } catch {
    return 100;
  }
}

function writeCounter(n: number) {
  localStorage.setItem(COUNTER_KEY, String(n));
}

export function useParticipants() {
  const { getToken } = useAuth(); // Get token from auth context
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch participants from backend
  const fetchParticipants = useCallback(async () => {
    const token = getToken();
    console.log('Fetching participants, token exists:', !!token);
    
    if (!token) {
      console.log('No admin token, using local data');
      setParticipants(readStore());
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/admin/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch participants: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched participants:', data.count);
      
      // Transform API data to frontend Participant type
      const transformed = data.registrations.map((reg: ApiParticipant) => ({
        id: reg.id,
        luckyNumber: reg.luckyNumber,
        name: reg.parentName,
        answers: reg.answers,
        createdAt: new Date(reg.createdAt).getTime()
      }));
      
      setParticipants(transformed);
      // Also update localStorage as cache
      writeStore(transformed);
      setIsOnline(true);
      return transformed;
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to local data
      setParticipants(readStore());
      setIsOnline(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Add participant via API (with localStorage fallback)
  const addParticipant = useCallback(async (name: string, answers: Record<string, string>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentName: name.trim(),
          answers
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('Registration successful, lucky number:', data.luckyNumber);
      
      // Create participant object
      const participant: Participant = {
        id: `api-${Date.now()}`,
        luckyNumber: data.luckyNumber,
        name: name.trim(),
        answers,
        createdAt: Date.now()
      };
      
      // Update local state
      setParticipants(prev => [participant, ...prev]);
      
      // Update localStorage cache
      const current = readStore();
      writeStore([participant, ...current]);
      
      setIsOnline(true);
      return participant;
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      
      // Fallback: Save locally if API fails
      console.warn('API failed, saving locally:', err);
      const current = readStore();
      const nextNumber = readCounter() + 1;
      writeCounter(nextNumber);
      const participant: Participant = {
        id: `local-${Date.now()}`,
        luckyNumber: nextNumber,
        name: name.trim(),
        answers,
        createdAt: Date.now()
      };
      writeStore([participant, ...current]);
      setParticipants(prev => [participant, ...prev]);
      
      setIsOnline(false);
      return participant;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset all participants (API + localStorage)
  const resetAll = useCallback(async () => {
    const token = getToken();
    console.log('Resetting, token exists:', !!token);
    
    setLoading(true);
    setError(null);
    
    try {
      if (token) {
        const response = await fetch(`${API_URL}/admin/reset`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ confirm: 'DELETE' })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reset registrations');
        }
        
        const data = await response.json();
        console.log('Reset successful:', data);
      } else {
        console.warn('No token for reset, clearing local data only');
      }
      
      // Clear local data
      writeStore([]);
      writeCounter(100);
      setParticipants([]);
      
    } catch (err) {
      console.error('Reset error:', err);
      setError(err instanceof Error ? err.message : 'Reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Initial load: try API, fallback to localStorage
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchParticipants().catch(() => {
        // Fallback to local data
        setParticipants(readStore());
      });
    } else {
      setParticipants(readStore());
    }
  }, [fetchParticipants, getToken]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const l: Listener = (list) => setParticipants(list);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return { 
    participants, 
    loading, 
    error, 
    isOnline,
    addParticipant, 
    resetAll,
    fetchParticipants,
    refresh: fetchParticipants
  };
}