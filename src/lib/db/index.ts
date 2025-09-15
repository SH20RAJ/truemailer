import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq, and, gte, sql } from 'drizzle-orm';
import { 
  usersTable, 
  sessionsTable, 
  todosTable, 
  apiKeysTable, 
  apiUsageTable,
  personalBlocklistTable,
  personalWhitelistTable,
  type User, 
  type NewUser, 
  type Todo, 
  type NewTodo,
  type ApiKey,
  type NewApiKey,
  type ApiUsage,
  type NewApiUsage,
  type PersonalBlocklist,
  type NewPersonalBlocklist,
  type PersonalWhitelist,
  type NewPersonalWhitelist
} from './schema';
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

// API Key Management Service
export class ApiKeyService {
  private db: ReturnType<typeof drizzle> | null;

  constructor() {
    this.db = getDB();
  }

  // Generate a new API key for a user
  async createApiKey(userId: string, name: string, monthlyQuota: number = 5000): Promise<{ apiKey: ApiKey; secretKey: string }> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    // Generate a unique API key
    const secretKey = `tm_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = await this.hashApiKey(secretKey);
    
    const now = new Date();
    const id = crypto.randomUUID();

    const newApiKey = await this.db
      .insert(apiKeysTable)
      .values({
        id,
        userId,
        keyHash,
        name,
        isActive: true,
        monthlyQuota,
        currentUsage: 0,
        lastUsageReset: now,
        createdAt: now,
      })
      .returning()
      .get();

    return { apiKey: newApiKey, secretKey };
  }

  // Hash API key for storage
  private async hashApiKey(apiKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify and get API key
  async verifyApiKey(apiKey: string): Promise<ApiKey | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const keyHash = await this.hashApiKey(apiKey);
    
    const apiKeyRecord = await this.db
      .select()
      .from(apiKeysTable)
      .where(and(eq(apiKeysTable.keyHash, keyHash), eq(apiKeysTable.isActive, true)))
      .get();

    if (!apiKeyRecord) {
      return null;
    }

    // Check if usage needs to be reset (monthly)
    const now = new Date();
    const lastReset = new Date(apiKeyRecord.lastUsageReset);
    const monthDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth());
    
    if (monthDiff >= 1) {
      // Reset monthly usage
      await this.db
        .update(apiKeysTable)
        .set({
          currentUsage: 0,
          lastUsageReset: now,
        })
        .where(eq(apiKeysTable.id, apiKeyRecord.id))
        .run();
      
      apiKeyRecord.currentUsage = 0;
      apiKeyRecord.lastUsageReset = now;
    }

    return apiKeyRecord;
  }

  // Increment API usage
  async incrementUsage(apiKeyId: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .update(apiKeysTable)
      .set({
        currentUsage: sql`${apiKeysTable.currentUsage} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(apiKeysTable.id, apiKeyId))
      .run();

    return result.rowsAffected > 0;
  }

  // Get user's API keys
  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    return await this.db
      .select()
      .from(apiKeysTable)
      .where(eq(apiKeysTable.userId, userId))
      .all();
  }

  // Update API key
  async updateApiKey(apiKeyId: string, updates: Partial<Pick<ApiKey, 'name' | 'isActive' | 'monthlyQuota'>>): Promise<ApiKey | null> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const updatedKey = await this.db
      .update(apiKeysTable)
      .set(updates)
      .where(eq(apiKeysTable.id, apiKeyId))
      .returning()
      .get();

    return updatedKey || null;
  }

  // Delete API key
  async deleteApiKey(apiKeyId: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .delete(apiKeysTable)
      .where(eq(apiKeysTable.id, apiKeyId))
      .run();

    return result.rowsAffected > 0;
  }
}

// Analytics Service
export class AnalyticsService {
  private db: ReturnType<typeof drizzle> | null;

  constructor() {
    this.db = getDB();
  }

  // Log API usage
  async logApiUsage(data: {
    apiKeyId: string;
    userId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime?: number;
    ipAddress?: string;
    userAgent?: string;
    requestSize?: number;
    responseSize?: number;
  }): Promise<void> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    await this.db
      .insert(apiUsageTable)
      .values({
        ...data,
        timestamp: new Date(),
      })
      .run();
  }

  // Get usage analytics for a user
  async getUserAnalytics(userId: string, days: number = 30): Promise<{
    totalRequests: number;
    successfulRequests: number;
    errorRequests: number;
    averageResponseTime: number;
    dailyUsage: Array<{ date: string; requests: number }>;
    endpointUsage: Array<{ endpoint: string; requests: number }>;
    statusCodeDistribution: Array<{ statusCode: number; count: number }>;
  }> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all usage data for the period
    const usageData = await this.db
      .select()
      .from(apiUsageTable)
      .where(and(
        eq(apiUsageTable.userId, userId),
        gte(apiUsageTable.timestamp, startDate)
      ))
      .all();

    // Calculate metrics
    const totalRequests = usageData.length;
    const successfulRequests = usageData.filter(u => u.statusCode >= 200 && u.statusCode < 300).length;
    const errorRequests = usageData.filter(u => u.statusCode >= 400).length;
    const averageResponseTime = usageData.reduce((sum, u) => sum + (u.responseTime || 0), 0) / totalRequests || 0;

    // Daily usage
    const dailyUsageMap = new Map<string, number>();
    usageData.forEach(u => {
      const date = u.timestamp.toISOString().split('T')[0];
      dailyUsageMap.set(date, (dailyUsageMap.get(date) || 0) + 1);
    });
    const dailyUsage = Array.from(dailyUsageMap.entries()).map(([date, requests]) => ({ date, requests }));

    // Endpoint usage
    const endpointUsageMap = new Map<string, number>();
    usageData.forEach(u => {
      endpointUsageMap.set(u.endpoint, (endpointUsageMap.get(u.endpoint) || 0) + 1);
    });
    const endpointUsage = Array.from(endpointUsageMap.entries()).map(([endpoint, requests]) => ({ endpoint, requests }));

    // Status code distribution
    const statusCodeMap = new Map<number, number>();
    usageData.forEach(u => {
      statusCodeMap.set(u.statusCode, (statusCodeMap.get(u.statusCode) || 0) + 1);
    });
    const statusCodeDistribution = Array.from(statusCodeMap.entries()).map(([statusCode, count]) => ({ statusCode, count }));

    return {
      totalRequests,
      successfulRequests,
      errorRequests,
      averageResponseTime,
      dailyUsage,
      endpointUsage,
      statusCodeDistribution,
    };
  }

  // Get API key specific analytics
  async getApiKeyAnalytics(apiKeyId: string, days: number = 30): Promise<{
    totalRequests: number;
    remainingQuota: number;
    usagePercentage: number;
    dailyUsage: Array<{ date: string; requests: number }>;
  }> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    // Get API key info
    const apiKey = await this.db
      .select()
      .from(apiKeysTable)
      .where(eq(apiKeysTable.id, apiKeyId))
      .get();

    if (!apiKey) {
      throw new Error('API key not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get usage data
    const usageData = await this.db
      .select()
      .from(apiUsageTable)
      .where(and(
        eq(apiUsageTable.apiKeyId, apiKeyId),
        gte(apiUsageTable.timestamp, startDate)
      ))
      .all();

    const totalRequests = usageData.length;
    const remainingQuota = Math.max(0, (apiKey.monthlyQuota || 0) - (apiKey.currentUsage || 0));
    const usagePercentage = ((apiKey.currentUsage || 0) / (apiKey.monthlyQuota || 1)) * 100;

    // Daily usage
    const dailyUsageMap = new Map<string, number>();
    usageData.forEach(u => {
      const date = u.timestamp.toISOString().split('T')[0];
      dailyUsageMap.set(date, (dailyUsageMap.get(date) || 0) + 1);
    });
    const dailyUsage = Array.from(dailyUsageMap.entries()).map(([date, requests]) => ({ date, requests }));

    return {
      totalRequests,
      remainingQuota,
      usagePercentage,
      dailyUsage,
    };
  }
}

// Personal Blocklist and Whitelist Service
export class PersonalListService {
  private db: ReturnType<typeof drizzle> | null;

  constructor() {
    this.db = getDB();
  }

  // Blocklist management
  async addToBlocklist(userId: string, emailOrDomain: string, type: 'email' | 'domain', reason?: string): Promise<PersonalBlocklist> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const newEntry = await this.db
      .insert(personalBlocklistTable)
      .values({
        userId,
        emailOrDomain: emailOrDomain.toLowerCase(),
        type,
        reason,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return newEntry;
  }

  async removeFromBlocklist(userId: string, id: number): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .delete(personalBlocklistTable)
      .where(and(
        eq(personalBlocklistTable.id, id),
        eq(personalBlocklistTable.userId, userId)
      ))
      .run();

    return result.rowsAffected > 0;
  }

  async getBlocklist(userId: string): Promise<PersonalBlocklist[]> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    return await this.db
      .select()
      .from(personalBlocklistTable)
      .where(eq(personalBlocklistTable.userId, userId))
      .orderBy(personalBlocklistTable.createdAt)
      .all();
  }

  async isBlocked(userId: string, email: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const emailLower = email.toLowerCase();
    const domain = emailLower.split('@')[1];

    const blocked = await this.db
      .select()
      .from(personalBlocklistTable)
      .where(and(
        eq(personalBlocklistTable.userId, userId),
        sql`(
          (${personalBlocklistTable.type} = 'email' AND ${personalBlocklistTable.emailOrDomain} = ${emailLower}) OR
          (${personalBlocklistTable.type} = 'domain' AND ${personalBlocklistTable.emailOrDomain} = ${domain})
        )`
      ))
      .limit(1)
      .get();

    return !!blocked;
  }

  // Whitelist management
  async addToWhitelist(userId: string, emailOrDomain: string, type: 'email' | 'domain', reason?: string): Promise<PersonalWhitelist> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const newEntry = await this.db
      .insert(personalWhitelistTable)
      .values({
        userId,
        emailOrDomain: emailOrDomain.toLowerCase(),
        type,
        reason,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return newEntry;
  }

  async removeFromWhitelist(userId: string, id: number): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const result = await this.db
      .delete(personalWhitelistTable)
      .where(and(
        eq(personalWhitelistTable.id, id),
        eq(personalWhitelistTable.userId, userId)
      ))
      .run();

    return result.rowsAffected > 0;
  }

  async getWhitelist(userId: string): Promise<PersonalWhitelist[]> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    return await this.db
      .select()
      .from(personalWhitelistTable)
      .where(eq(personalWhitelistTable.userId, userId))
      .orderBy(personalWhitelistTable.createdAt)
      .all();
  }

  async isWhitelisted(userId: string, email: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    const emailLower = email.toLowerCase();
    const domain = emailLower.split('@')[1];

    const whitelisted = await this.db
      .select()
      .from(personalWhitelistTable)
      .where(and(
        eq(personalWhitelistTable.userId, userId),
        sql`(
          (${personalWhitelistTable.type} = 'email' AND ${personalWhitelistTable.emailOrDomain} = ${emailLower}) OR
          (${personalWhitelistTable.type} = 'domain' AND ${personalWhitelistTable.emailOrDomain} = ${domain})
        )`
      ))
      .limit(1)
      .get();

    return !!whitelisted;
  }

  // Get combined personal validation result
  async getPersonalValidation(userId: string, email: string): Promise<{
    isBlocked: boolean;
    isWhitelisted: boolean;
    personalOverride: boolean;
  }> {
    const [isBlocked, isWhitelisted] = await Promise.all([
      this.isBlocked(userId, email),
      this.isWhitelisted(userId, email)
    ]);

    // Whitelist takes precedence over blocklist
    const personalOverride = isWhitelisted || isBlocked;

    return {
      isBlocked,
      isWhitelisted,
      personalOverride
    };
  }
}