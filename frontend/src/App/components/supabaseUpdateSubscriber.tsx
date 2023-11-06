import { supabase } from './supabaseClient';

export function subscribe(channelName: string, eventType: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: eventType,
          schema: 'public',
        },
        callback,
      )
      .subscribe();
}

export function unsubscribe(channelName: string) {
    supabase.removeChannel(channelName);
}