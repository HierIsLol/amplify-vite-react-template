import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [showClientIdPage, setShowClientIdPage] = useState(false);
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      const subscription = client.models.Todo.observeQuery({
        filter: { owner: { eq: user.username } }
      }).subscribe({
        next: ({ items }) => setTodos(items),
      });

      return () => subscription.unsubscribe();
    }
  }, [user]);

  async function createTodo() {
    const content = window.prompt("Todo content");
    if (content && user) {
      await client.models.Todo.create({
        content,
        owner: user.username
      });
    }
  }

  async function deleteTodo(id: string) {
    await client.models.Todo.delete({ id });
  }

  function ClientIdPage() {
    return (
      <div style={{width: "434px", height: "886px", position: "relative", background: "white", fontFamily: "Arial, sans-serif"}}>
        <div style={{width: "434px", height: "886px", left: "0px", top: "0px", position: "absolute", background: "#EEEEEE"}} />
        <div style={{width: "361px", height: "65px", left: "36px", top: "225px", position: "absolute", background: "white", borderRadius: "32.50px"}} />
        <div style={{width: "269px", height: "29px", left: "82px", top: "243px", position: "absolute", color: "black", fontSize: "26px", fontWeight: 700, lineHeight: "26px", wordWrap: "break-word"}}>
          ↓Volg de instructies
        </div>
        <div style={{width: "321px", height: "76px", left: "57px", top: "746px", position: "absolute", background: "#003366", borderRadius: "17px"}} />
        <div style={{width: "297px", height: "186px", left: "69px", top: "313px", position: "absolute", textAlign: "center", color: "black", fontSize: "20px", fontWeight: 700, lineHeight: "20px", wordWrap: "break-word"}}>
          Om verbinding te kunnen maken met je store hebben wij een koppelingsnummer nodig.
        </div>
        <div id="koppelButton" style={{width: "254px", height: "29px", left: "91px", top: "769px", position: "absolute", color: "white", fontSize: "26px", fontWeight: 700, lineHeight: "26px", wordWrap: "break-word", cursor: "pointer"}}>
          ↓Koppel mijn store!
        </div>
        <div style={{width: "153px", height: "76px", left: "224px", top: "600px", position: "absolute", background: "white", borderRadius: "17px"}} />
        <div style={{width: "122px", height: "29px", left: "240px", top: "614px", position: "absolute", textAlign: "center", color: "#003366", fontSize: "26px", fontWeight: 700, lineHeight: "26px", wordWrap: "break-word"}}>
          Client ID:
        </div>
        <div style={{width: "153px", height: "76px", left: "46px", top: "600px", position: "absolute", background: "white", borderRadius: "17px"}} />
        <div style={{width: "137px", height: "29px", left: "54px", top: "609px", position: "absolute", textAlign: "center", color: "#003366", fontSize: "26px", fontWeight: 700, lineHeight: "26px", wordWrap: "break-word"}}>
          Client secret:
        </div>
        <div style={{width: "361px", height: "0px", left: "37px", top: "394px", position: "absolute", border: "1px black solid"}} />
        <img src="/assets/AdPal_logo_no_white.png" style={{width: "188px", height: "188px", left: "123px", top: "37px", position: "absolute"}} />
        <img src="/assets/ezgif-5-675330dec9.gif" style={{width: "316px", height: "164px", left: "59px", top: "418px", position: "absolute"}} />
        <div id="result"></div>
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
                {todos.map((todo) => (
                  <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
                ))}
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
