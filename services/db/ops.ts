import { db, useLocalStorage, getStore, setStore, parseThing } from './client';
import { getCurrentUser } from './auth';

export const _select = async <T>(table: string): Promise<T[]> => {
    if (useLocalStorage) return getStore<T>(table);
    return await db.select<T & { id: string }>(table);
};

export const _create = async (thing: string, data: any) => {
    if (useLocalStorage) {
        const { table, id } = parseThing(thing);
        const store = getStore<any>(table);
        const recordId = id || data.id || Math.random().toString(36).substr(2, 9);
        const newItem = { ...data, id: recordId, owner: getCurrentUser()?.id || 'anonymous' };
        store.push(newItem);
        setStore(table, store);
        return [newItem];
    }
    const dataWithOwner = { ...data, owner: data.owner || getCurrentUser()?.id };
    return await db.create(thing, dataWithOwner);
};

export const _update = async (thing: string, data: any) => {
     if (useLocalStorage) {
        const { table, id } = parseThing(thing);
        let store = getStore<any>(table);
        store = store.map((item: any) => item.id === id ? { ...data, id } : item);
        setStore(table, store);
        return [data];
    }
    return await db.update(thing, data);
};

export const _merge = async (thing: string, data: any) => {
    if (useLocalStorage) {
        const { table, id } = parseThing(thing);
        let store = getStore<any>(table);
        const index = store.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            store[index] = { ...store[index], ...data };
            setStore(table, store);
            return [store[index]];
        }
        return [];
    }
    return await db.merge(thing, data);
};

export const _delete = async (thing: string) => {
    if (useLocalStorage) {
         const { table, id } = parseThing(thing);
         let store = getStore<any>(table);
         store = store.filter((item: any) => item.id !== id);
         setStore(table, store);
         return;
    }
    return await db.delete(thing);
};