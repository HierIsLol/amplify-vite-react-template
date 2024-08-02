import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { TodoList } from './TodoList';  // We'll create this component next
import '@aws-amplify/ui-react/styles.css';

function App() {
  console.log("App component rendered");

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #9370DB 0%, #E6E6FA 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          color: '#333'
        }}>
          <h1 style={{ color: 'white', marginBottom: '2rem' }}>Welcome, {user?.username}!</h1>
          <TodoList user={user} />
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
