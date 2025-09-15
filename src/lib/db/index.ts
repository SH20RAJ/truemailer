import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { usersTable, sessionsTable, todosTable, type User, type NewUser, type Todo, type NewTodo } from './schema';
import * as schema from './schema';

// Initialize Turso client and Drizzle
let client: ReturnType<typeof createClient> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function initializeDB() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!url) {
      throw new Error('TURSO_DATABASE_URL environment variable is required');
    }
    
    client = createClient({
      url,
      authToken,
    });
    
    db = drizzle(client, { schema });
  }
  
  return db;
}

// Get database instance
export function getDB() {
  try {
    return initializeDB();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}

// Database service functions
export class UserService {
  private db: ReturnType<typeof drizzle> | null;

  constructor() {
    this.db = getDB();
  }

  // Create or update user from StackAuth
  async upsertUser(userData: {
    id: string;
    email: string;
    displayName?: string;
    profileImageUrl?: string;
    primaryEmail?: string;
    primaryEmailVerified?: boolean;
    clientMetadata?: Record<string, unknown>;
    serverMetadata?: Record<string, unknown>;
  }): Promise<User> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const now = new Date();
    
    // Check if user exists
    const existingUser = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userData.id))
      .get();

    if (existingUser) {
      // Update existing user
      const updatedUser = await this.db
        .update(usersTable)
        .set({
          email: userData.email,
          displayName: userData.displayName,
          profileImageUrl: userData.profileImageUrl,
          primaryEmail: userData.primaryEmail,
          primaryEmailVerified: userData.primaryEmailVerified,
          clientMetadata: userData.clientMetadata,
          serverMetadata: userData.serverMetadata,
          updatedAt: now,
        })
        .where(eq(usersTable.id, userData.id))
        .returning()
        .get();

      return updatedUser;
    } else {
      // Create new user
      const newUser = await this.db
        .insert(usersTable)
        .values({
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
          profileImageUrl: userData.profileImageUrl,
          primaryEmail: userData.primaryEmail,
          primaryEmailVerified: userData.primaryEmailVerified,
          clientMetadata: userData.clientMetadata,
          serverMetadata: userData.serverMetadata,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
        .get();

      return newUser;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const user = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .get();

    return user || null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const user = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    return user || null;
  }

  // Get all users (for admin)
  async getAllUsers(): Promise<User[]> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const users = await this.db
      .select()
      .from(usersTable)
      .all();

    return users;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .run();

    return result.rowsAffected > 0;
  }

  // Test database connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.db) {
        return { success: false, message: 'Database connection not available' };
      }

      // Try to query the users table
      const result = await this.db.select().from(usersTable).limit(1).all();
      return { 
        success: true, 
        message: `Database connected successfully. Found ${result.length} user(s).` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

// Todo service functions
export class TodoService {
  private db: ReturnType<typeof drizzle> | null;

  constructor() {
    this.db = getDB();
  }

  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const todos = await this.db
      .select()
      .from(todosTable)
      .all();

    return todos;
  }

  // Get todo by ID
  async getTodoById(id: number): Promise<Todo | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const todo = await this.db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id))
      .get();

    return todo || null;
  }

  // Create new todo
  async createTodo(content: string): Promise<Todo> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const newTodo = await this.db
      .insert(todosTable)
      .values({ content })
      .returning()
      .get();

    return newTodo;
  }

  // Update todo
  async updateTodo(id: number, content: string): Promise<Todo | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const updatedTodo = await this.db
      .update(todosTable)
      .set({ content })
      .where(eq(todosTable.id, id))
      .returning()
      .get();

    return updatedTodo || null;
  }

  // Delete todo
  async deleteTodo(id: number): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .run();

    return result.rowsAffected > 0;
  }

  // Test database connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.db) {
        return { success: false, message: 'Database connection not available' };
      }

      // Try to query the todos table
      const result = await this.db.select().from(todosTable).limit(1).all();
      return { 
        success: true, 
        message: `Database connected successfully. Found ${result.length} todo(s).` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}