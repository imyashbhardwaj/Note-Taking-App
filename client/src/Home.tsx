import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignedInUI from './SignedInUI';
import SignInComponent from './SignIn';
function Home() {
  return (
    <div>
      <center>
        <SignedOut>
          <SignInComponent />
        </SignedOut>
        <SignedIn>
          <SignedInUI />
        </SignedIn>
      </center>
    </div>
  );
}

export default Home;
