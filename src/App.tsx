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
  const [showClientIdPage, setShowClientIdPage] = useState(false);
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    // Load todos from localStorage when the component mounts
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content && user) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        content,
        owner: user.username
      };
      setTodos([...todos, newTodo]);
    }
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function ClientIdPage() {
    return (
      <div style={{width: "434px", height: "886px", position: "relative", background: "white", fontFamily: "Arial, sans-serif"}}>
        {/* Rest of the ClientIdPage component remains unchanged */}
      </div>
    );
  }

  return (    
    <Authenticator>
      {({ signOut }) => (
        <main>
          {showClientIdPage ? (
            <ClientIdPage />
          ) : (
            <>
              <h1>My todos</h1>
              <button onClick={createTodo}>+ new</button>
              <ul>
                {todos
                  .filter(todo => todo.owner === user?.username)
                  .map((todo) => (
                    <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
                  ))
                }
              </ul>
              <div>
                🥳 App successfully hosted. Your personal todo list is ready!
              </div>
              <button onClick={() => setShowClientIdPage(true)}>Show Client ID Page</button>
            </>
          )}
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
