import { NextRequest } from 'next/server';
import { TodoService } from '@/lib/db';

// GET all todos
export async function GET(_request: NextRequest) {
  try {
    console.log('[TODO API] Fetching all todos...');
    
    const todoService = new TodoService();
    
    // Test connection first
    const connectionTest = await todoService.testConnection();
    console.log('[TODO API] Database test result:', connectionTest);
    
    if (!connectionTest.success) {
      return Response.json({
        success: false,
        message: 'Database connection failed',
        error: connectionTest.message,
        todos: []
      }, { status: 500 });
    }
    
    // Get all todos
    const todos = await todoService.getAllTodos();
    console.log('[TODO API] Found todos:', todos.length);
    
    return Response.json({
      success: true,
      message: 'Todos fetched successfully',
      todos
    });
  } catch (error) {
    console.error('[TODO API] Error fetching todos:', error);
    
    return Response.json({
      success: false,
      message: 'Error fetching todos',
      error: error instanceof Error ? error.message : 'Unknown error',
      todos: []
    }, { status: 500 });
  }
}

// POST new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { content?: string };
    const { content } = body;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return Response.json({ 
        success: false,
        error: 'Content is required and must be a non-empty string' 
      }, { status: 400 });
    }
    
    console.log('[TODO API] Creating new todo:', content);
    
    const todoService = new TodoService();
    
    // Test connection first
    const connectionTest = await todoService.testConnection();
    if (!connectionTest.success) {
      return Response.json({
        success: false,
        message: 'Database connection failed',
        error: connectionTest.message
      }, { status: 500 });
    }
    
    // Create new todo
    const newTodo = await todoService.createTodo(content.trim());
    console.log('[TODO API] Created todo:', newTodo);
    
    return Response.json({
      success: true,
      message: 'Todo created successfully',
      todo: newTodo
    });
  } catch (error) {
    console.error('[TODO API] Error creating todo:', error);
    
    return Response.json({
      success: false,
      message: 'Error creating todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
