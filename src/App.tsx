import { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface Todo {
  id: string;
  content: string;
  owner: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function createTodo(e: React.FormEvent) {
    e.preventDefault();
    if (newTodo.trim() && user) {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        content: newTodo.trim(),
        owner: user.username
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #9370DB 0%, #E6E6FA 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          color: '#333'
        }}>
          <h1 style={{ color: 'white', marginBottom: '2rem' }}>My Todo List</h1>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px'
          }}>
            <form onSubmit={createTodo} style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginRight: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <button type="submit" style={{
                background: '#9370DB',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}>
                Add Todo
              </button>
            </form>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {todos
                .filter(todo => todo.owner === user?.username)
                .map((todo) => (
                  <li key={todo.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{todo.content}</span>
                    <button onClick={() => deleteTodo(todo.id)} style={{
                      background: '#ff4d4d',
                      color: 'white',
                      border: 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      Delete
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
          <button onClick={signOut} style={{
            marginTop: '2rem',
            background: '#333',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Sign Out
          </button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
