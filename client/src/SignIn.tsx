import { SignInButton } from '@clerk/clerk-react';

function SignInComponent() {
  return (
    <div id="SignInParentDiv">
      <h1>Please Sign In/Sign Up to start Collaborating on notes</h1>
      <div>
      <SignInButton />
      </div>
    </div>
  );
}

export default SignInComponent;
