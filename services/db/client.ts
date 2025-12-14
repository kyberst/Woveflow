import Surreal from 'surrealdb.js';

export const db = new Surreal();

export let isConnected = false;
export let useLocalStorage = false;

// --- LocalStorage Helpers ---
const STORAGE_PREFIX = 'woveflow_';

export const getStore = <T>(table: string): T[] => {
    try {
        const item = localStorage.getItem(`${STORAGE_PREFIX}${table}`);
        return item ? JSON.parse(item) : [];
    } catch (e) {
        console.error('LocalStorage read error', e);
        return [];
    }
};

export const setStore = (table: string, data: any[]) => {
    try {
        localStorage.setItem(`${STORAGE_PREFIX}${table}`, JSON.stringify(data));
    } catch (e) {
        console.error('LocalStorage write error', e);
    }
};

export const parseThing = (thing: string) => {
    const parts = thing.split(':');
    return parts.length > 1 ? { table: parts[0], id: parts.slice(1).join(':') } : { table: thing, id: null };
};

export async function connect() {
    if (isConnected) return;
    try {
        await db.connect('ws://localhost:8000/rpc');
        await db.use({ namespace: 'woveflow', database: 'woveflow' });
        isConnected = true;
        console.log('[DB] Connected to SurrealDB');
    } catch (e) {
        console.warn('[DB] Connection failed. Falling back to LocalStorage.', e);
        useLocalStorage = true;
        isConnected = true;
    }
}