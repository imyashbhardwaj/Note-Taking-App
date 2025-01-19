import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import NoteUpdateWindow from './NoteUpdateWindow';
import Home from './Home';
import SignIn from './SignIn';

function App() {
  const { user } = useUser();
  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <BrowserRouter>
          <Routes>
            <Route path="/update" element={<NoteUpdateWindow />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <div id="avatarButton">
          {user ? `Hello, ${user.firstName}!` : null} <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}

export default App;
