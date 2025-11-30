import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { MedicionParadero } from './models/medicion-paradero.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SupabaseService],
})
export class AppComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  records = signal<MedicionParadero[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await this.supabaseService.getParaderoRecords();
    if (error) {
      this.error.set(error.message);
      this.records.set([]);
    } else if (data) {
      this.records.set(data);
    }
    this.loading.set(false);
  }
  
  formatTimestamp(timestamp: string): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  }
  
  getOccupancyLevelColor(level: string | null): string {
    if (!level) return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'full':
        return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  trackById(index: number, item: MedicionParadero): number {
    return item.id;
  }
}
