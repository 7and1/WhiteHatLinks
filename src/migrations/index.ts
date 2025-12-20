import * as migration_20251217_114459 from './20251217_114459';
import * as migration_20251219_085923 from './20251219_085923';

export const migrations = [
  {
    up: migration_20251217_114459.up,
    down: migration_20251217_114459.down,
    name: '20251217_114459',
  },
  {
    up: migration_20251219_085923.up,
    down: migration_20251219_085923.down,
    name: '20251219_085923'
  },
];
