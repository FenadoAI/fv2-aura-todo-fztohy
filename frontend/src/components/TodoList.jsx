import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, Edit3, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    }
  };

  const createTodo = async () => {
    if (!newTodo.title.trim()) {
      toast({
        title: "Error",
        description: "Todo title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`${API}/todos`, newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  const updateTodo = async (todoId, updates) => {
    try {
      const response = await axios.put(`${API}/todos/${todoId}`, updates);
      setTodos(todos.map(todo => todo.id === todoId ? response.data : todo));
      if (updates.completed !== undefined) {
        toast({
          title: "Success",
          description: updates.completed ? "Todo completed!" : "Todo marked as incomplete",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API}/todos/${todoId}`);
      setTodos(todos.filter(todo => todo.id !== todoId));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleEdit = (todo) => {
    setEditingTodo({ ...todo });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    if (!editingTodo.title.trim()) {
      toast({
        title: "Error",
        description: "Todo title is required",
        variant: "destructive",
      });
      return;
    }

    await updateTodo(editingTodo.id, {
      title: editingTodo.title,
      description: editingTodo.description
    });
    setIsEditDialogOpen(false);
    setEditingTodo(null);
    toast({
      title: "Success",
      description: "Todo updated successfully",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6" 
         style={{
           backgroundImage: 'url(https://storage.googleapis.com/fenado-ai-farm-public/generated/9974c330-cfcf-46ba-86f6-cb2e26c8ec1e.webp)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            My Todo List
          </h1>
          <p className="text-slate-200 text-lg drop-shadow">
            Stay organized and productive
          </p>
          {totalCount > 0 && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                {completedCount} of {totalCount} completed
              </Badge>
            </div>
          )}
        </div>

        {/* Add Todo Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Todo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800">Create New Todo</DialogTitle>
                <DialogDescription>
                  Add a new task to your todo list
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Todo title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description (optional)"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
                <Button onClick={createTodo} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Create Todo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No todos yet</h3>
                <p className="text-slate-200">Create your first todo to get started!</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card 
                key={todo.id} 
                className={`bg-white/90 backdrop-blur border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleComplete(todo)}
                      className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold text-slate-800 ${
                        todo.completed ? 'line-through text-slate-500' : ''
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-slate-600 mt-1 ${
                          todo.completed ? 'line-through text-slate-400' : ''
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(todo.created_at)}</span>
                        {todo.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(todo)}
                        className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-slate-800">Edit Todo</DialogTitle>
              <DialogDescription>
                Update your todo details
              </DialogDescription>
            </DialogHeader>
            {editingTodo && (
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Todo title"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description (optional)"
                    value={editingTodo.description}
                    onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                    className="border-slate-300 focus:border-indigo-500"
                  />
                </div>
                <Button onClick={saveEdit} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoList;