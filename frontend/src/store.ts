import { useCallback, useEffect, useState } from 'react';
import type { Participant } from '@/types';

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
  const [participants, setParticipants] = useState<Participant[]>(() => readStore());

  useEffect(() => {
    const l: Listener = (list) => setParticipants(list);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const addParticipant = useCallback((name: string, answers: Record<string, string>) => {
    const current = readStore();
    const nextNumber = readCounter() + 1;
    const participant: Participant = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      luckyNumber: nextNumber,
      name: name.trim(),
      answers,
      createdAt: Date.now(),
    };
    writeCounter(nextNumber);
    writeStore([...current, participant]);
    return participant;
  }, []);

  const resetAll = useCallback(() => {
    writeStore([]);
    writeCounter(100);
  }, []);

  return { participants, addParticipant, resetAll };
}
