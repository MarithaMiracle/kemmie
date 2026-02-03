import { Injectable } from '@nestjs/common';

type PrismaMood = 'GOOD' | 'OKAY' | 'LOW' | 'STRESSED';

@Injectable()
export class MoodService {
  toLabel(mood: PrismaMood | null): string {
    if (!mood) return '';
    switch (mood) {
      case 'GOOD': return 'Happy';
      case 'OKAY': return 'Okay';
      case 'LOW': return 'Low';
      case 'STRESSED': return 'Stressed';
      default: return '';
    }
  }
  fromLabel(label: string): PrismaMood {
    const l = (label || '').trim().toLowerCase();
    if (['happy','energized','motivated','on fire','grateful'].some(x => l.includes(x))) return 'GOOD';
    if (['chill','peaceful','okay'].some(x => l.includes(x))) return 'OKAY';
    if (['tired','low'].some(x => l.includes(x))) return 'LOW';
    return 'STRESSED';
  }
}