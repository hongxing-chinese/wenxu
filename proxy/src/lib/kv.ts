/**
 * Edge KV 存储封装
 * 使用 ESA 内置的 EdgeKV API
 */

declare class EdgeKV {
  constructor(config: { namespace: string });
  get(key: string, options?: { type?: string }): Promise<any>;
  put(key: string, value: any): Promise<void>;
  delete(key: string): Promise<boolean>;
}

export interface StoredRecord {
  id: string;
  type: 'single' | 'compatibility' | 'divination';
  data: unknown;
  updatedAt: string;
}

export function createKV(namespace: string) {
  const kv = new EdgeKV({ namespace });

  return {
    async getRecords(userKey: string): Promise<StoredRecord[]> {
      const key = `user_${userKey}_records`;
      const data = await kv.get(key, { type: 'json' });
      return Array.isArray(data) ? data : [];
    },

    async addRecord(userKey: string, record: StoredRecord): Promise<void> {
      const key = `user_${userKey}_records`;
      const records: StoredRecord[] = await kv.get(key, { type: 'json' }) || [];
      const filtered = records.filter((r) => r.id !== record.id);
      filtered.unshift(record);
      await kv.put(key, JSON.stringify(filtered.slice(0, 100)));
    },

    async deleteRecord(userKey: string, recordId: string): Promise<boolean> {
      const key = `user_${userKey}_records`;
      const records: StoredRecord[] = await kv.get(key, { type: 'json' }) || [];
      const filtered = records.filter((r) => r.id !== recordId);
      if (filtered.length === records.length) return false;
      await kv.put(key, JSON.stringify(filtered));
      return true;
    },
  };
}
