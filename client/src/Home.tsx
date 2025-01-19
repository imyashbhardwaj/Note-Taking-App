import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import SignedInUI from './SignedInUI';
function Home() {
  return (
    <div>
      <center>
        <SignedOut>
          <h2>Please Sign In/Sign Up to start Collaborating on notes</h2>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignedInUI />
        </SignedIn>
      </center>
    </div>
  );
}

export default Home;
