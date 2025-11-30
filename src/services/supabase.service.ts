import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MedicionParadero } from '../models/medicion-paradero.model';

declare global {
  interface Window {
    supabase: {
      createClient: typeof createClient;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseUrl = 'https://sshhtcfgvwtqhrdvdtje.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzaGh0Y2Zndnd0cWhyZHZkdGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzc1NzEsImV4cCI6MjA3OTkxMzU3MX0.5ht2jqOUv7KfvytiU-ROW4-6f8aXKWqM0i_jDnlv3VQ';

  constructor() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
    } else {
      console.error('Supabase client is not available on the window object.');
      this.supabase = {
        from: () => ({
          select: async () => ({
            data: null,
            error: { message: 'Supabase client not initialized.', details: '', hint: '', code: '' },
          }),
        }),
      } as unknown as SupabaseClient;
    }
  }

  async getParaderoRecords(): Promise<{ data: MedicionParadero[] | null, error: Error | null }> {
    const { data, error } = await this.supabase
      .from('mediciones_paradero')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return { data: null, error: new Error(error.message) };
    }
    
    const mappedData = data as MedicionParadero[];
    return { data: mappedData, error: null };
  }
}
