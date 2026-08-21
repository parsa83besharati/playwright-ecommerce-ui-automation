type EntityType = 'product' | 'user' | 'cart' | 'order';

interface RegistryEntry {
  type: EntityType;
  id: string | number;
  data: unknown;
}

export class DataRegistry {
  private static instance: DataRegistry;
  private entries: RegistryEntry[] = [];

  static getInstance(): DataRegistry {
    if (!DataRegistry.instance) {
      DataRegistry.instance = new DataRegistry();
    }
    return DataRegistry.instance;
  }

  register(type: EntityType, id: string | number, data: unknown): void {
    this.entries.push({ type, id, data });
  }

  getAll(): RegistryEntry[] {
    return [...this.entries];
  }

  getByType(type: EntityType): RegistryEntry[] {
    return this.entries.filter(e => e.type === type);
  }

  count(type?: EntityType): number {
    return type ? this.entries.filter(e => e.type === type).length : this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }
}

// Singleton export for convenience
export const dataRegistry = DataRegistry.getInstance();