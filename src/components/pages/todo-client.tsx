"use client";

import { useState, useEffect } from "react";
import { Button, Textarea, Badge, Title, Text, ActionIcon } from "rizzui";
import { CheckCircle, XCircle, Database, Plus, Loader2, Edit, Trash2, Save, X } from "lucide-react";

interface Todo {
  id: number;
  content: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  todos?: Todo[];
  todo?: Todo;
  error?: string;
}

export default function TodoClient() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch('/api/todo');
      const data: ApiResponse = await response.json();
      if (data.success && data.todos) setTodos(data.todos);
      else setError(data.error || data.message || 'Failed to fetch todos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      const response = await fetch('/api/todo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newTodo.trim() })
      });
      const data = await response.json() as ApiResponse;
      if (data.success && data.todo) {
        setTodos(prev => [data.todo!, ...prev]);
        setNewTodo("");
      } else setError(data.error || 'Failed to create todo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally { setSubmitting(false); }
  };

  const updateTodo = async (id: number, content: string) => {
    try {
      setError("");
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() })
      });
      const data = await response.json() as ApiResponse;
      if (data.success && data.todo) {
        setTodos(prev => prev.map(todo => todo.id === id ? data.todo! : todo));
        setEditingId(null); setEditContent("");
      } else setError(data.error || 'Failed to update todo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError("");
      const response = await fetch(`/api/todo/${id}`, { method: 'DELETE' });
      const data = await response.json() as ApiResponse;
      if (data.success) setTodos(prev => prev.filter(todo => todo.id !== id));
      else setError(data.error || 'Failed to delete todo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const startEdit = (todo: Todo) => { setEditingId(todo.id); setEditContent(todo.content); };
  const cancelEdit = () => { setEditingId(null); setEditContent(""); };
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !submitting) createTodo(); };

  useEffect(() => { fetchTodos(); }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Title as="h1" className="text-3xl font-bold mb-4">Todo CRUD with D1 Database</Title>
          <Text className="text-muted-foreground">Create, Read, Update, Delete todos using Cloudflare D1 + Drizzle ORM</Text>
        </div>

        <div className="bg-card/50 border border-primary/20 rounded-xl mb-6">
          <div className="p-6 border-b border-primary/10">
            <Title as="h2" className="flex items-center gap-2"><Database className="w-5 h-5" />Database Status</Title>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Checking database connection...</div>
            ) : (
              <div className="flex items-center gap-2">
                {error ? (<><XCircle className="w-5 h-5 text-red-500" /><Badge color="danger" variant="flat">Error</Badge><Text className="text-sm text-red-600">{error}</Text></>) : (<><CheckCircle className="w-5 h-5 text-green-500" /><Badge color="success" variant="flat">Connected</Badge><Text className="text-sm text-muted-foreground">Found {todos.length} todo(s) in database</Text></>)}
              </div>
            )}
          </div>
        </div>

        {error && !loading && (
          <div className="bg-card/50 border border-red-200 rounded-xl mb-6">
            <div className="p-6">
              <div className="text-red-600"><strong>Error:</strong> {error}</div>
            </div>
          </div>
        )}

        <div className="bg-card/50 border border-primary/20 rounded-xl">
          <div className="p-6 border-b border-primary/10">
            <Title as="h2">Todo Management</Title>
            <Text className="text-sm text-muted-foreground">Full CRUD operations with real database storage</Text>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-6">
              <Textarea placeholder="Enter a todo item..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyPress={handleKeyPress} disabled={submitting} className="min-h-[60px]" />
              <Button onClick={createTodo} disabled={!newTodo.trim() || submitting} className="flex items-center gap-2 self-start">
                {submitting ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<Plus className="w-4 h-4" />)}
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="space-y-2">
                        <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[60px]" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateTodo(todo.id, editContent)} disabled={!editContent.trim()} className="flex items-center gap-1"><Save className="w-3 h-3" />Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} className="flex items-center gap-1"><X className="w-3 h-3" />Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium mb-1">ID: {todo.id}</div>
                        <div className="whitespace-pre-wrap">{todo.content}</div>
                      </div>
                    )}
                  </div>
                  {editingId !== todo.id && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => startEdit(todo)} className="flex items-center gap-1"><Edit className="w-3 h-3" />Edit</Button>
                      <Button size="sm" color="danger" onClick={() => deleteTodo(todo.id)} className="flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {todos.length === 0 && !loading && !error && (
              <div className="text-center text-muted-foreground py-8">No todos yet. Add one above!</div>
            )}
          </div>
        </div>

        <div className="bg-card/50 border border-primary/20 rounded-xl mt-6">
          <div className="p-6 border-b border-primary/10">
            <Title as="h2">CRUD Operations</Title>
          </div>
          <div className="p-6 space-y-2 text-sm">
            <p><strong>Create:</strong> Enter content and click &quot;Add&quot;</p>
            <p><strong>Read:</strong> Todos are displayed with their database ID</p>
            <p><strong>Update:</strong> Click &quot;Edit&quot; then &quot;Save&quot;</p>
            <p><strong>Delete:</strong> Click &quot;Delete&quot; to remove a todo</p>
            <Text className="text-muted-foreground mt-3">All operations use Cloudflare D1 + Drizzle ORM</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
