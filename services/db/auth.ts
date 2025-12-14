import { User } from '../../types';
import { db, useLocalStorage, connect } from './client';

// Define SurrealResult locally since it is not exported from the package
interface SurrealResult<T> {
  result?: T;
  status: string;
}

let currentUser: User | null = null;
let currentToken: string | null = null;

export const getCurrentUser = () => currentUser;

export async function login(username: string, password: string, role: User['role'] = 'designer'): Promise<{user: User, token: string}> {
    await connect();
    if (useLocalStorage) {
        currentUser = { id: 'user:anonymous', username: 'anonymous', role: 'designer' };
        return { user: currentUser, token: 'anonymous-token' };
    }

    try {
        let token: string;
        try {
            token = await db.signin({ NS: 'woveflow', DB: 'woveflow', SC: 'user_scope', username, password });
        } catch (e) {
            console.log(`[DB] Signin failed for ${username}, attempting signup...`);
            await db.signup({ NS: 'woveflow', DB: 'woveflow', SC: 'user_scope', username, password, role });
            token = await db.signin({ NS: 'woveflow', DB: 'woveflow', SC: 'user_scope', username, password });
        }
        
        await db.authenticate(token);
        const userQuery = await db.query<[SurrealResult<User[]>]>('SELECT * FROM user WHERE username = $name', { name: username });
        const user = userQuery[0].result?.[0];
        if (!user) throw new Error('User authentication failed.');
        currentUser = user;
        currentToken = token;
        return { user, token };
    } catch (e) {
        console.error('[DB] Authentication process failed.', e);
        throw e;
    }
}