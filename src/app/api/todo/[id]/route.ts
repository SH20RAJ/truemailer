import { NextRequest } from 'next/server';
import { TodoService } from '@/lib/db';

// GET single todo by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        error: 'Invalid todo ID'
      }, { status: 400 });
    }
    
    console.log('[TODO API] Fetching todo:', id);
    
    const todoService = new TodoService();
    const todo = await todoService.getTodoById(id);
    
    if (!todo) {
      return Response.json({
        success: false,
        error: 'Todo not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      todo
    });
  } catch (error) {
    console.error('[TODO API] Error fetching todo:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        error: 'Invalid todo ID'
      }, { status: 400 });
    }
    
    const body = await request.json() as { content?: string };
    const { content } = body;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return Response.json({
        success: false,
        error: 'Content is required and must be a non-empty string'
      }, { status: 400 });
    }
    
    console.log('[TODO API] Updating todo:', id, 'with content:', content);
    
    const todoService = new TodoService();
    const updatedTodo = await todoService.updateTodo(id, content.trim());
    
    if (!updatedTodo) {
      return Response.json({
        success: false,
        error: 'Todo not found'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: 'Todo updated successfully',
      todo: updatedTodo
    });
  } catch (error) {
    console.error('[TODO API] Error updating todo:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return Response.json({
        success: false,
        error: 'Invalid todo ID'
      }, { status: 400 });
    }
    
    console.log('[TODO API] Deleting todo:', id);
    
    const todoService = new TodoService();
    const deleted = await todoService.deleteTodo(id);
    
    if (!deleted) {
      return Response.json({
        success: false,
        error: 'Todo not found or could not be deleted'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('[TODO API] Error deleting todo:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}