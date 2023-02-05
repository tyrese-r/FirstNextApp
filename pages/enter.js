import { signInWithPopup, signOut } from "firebase/auth";
import { app, auth, db, googleAuthProvider } from "@/lib/firebase";
import { useEffect, useState, useCallback, useContext } from 'react';
import { UserContext } from '../lib/context';
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";


export default function EnterPage() {
  const { user, username } = useContext(UserContext)
  return (
    <main>
      {
        user ?
          !username ? <UsernameForm /> : <SignOutButton />
          :
          <SignInButton />
      }
    </main>
  )
}

function SignInButton() {


  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      Sign In with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>
}

function UsernameForm(params) {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState('')
  const [isLoading, setLoading] = useState('')
  const { user, username } = useContext(UserContext)


  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true);
      setIsValid(false);
    }

  }

  const checkUsername = useCallback(debounce(async (username) => {
    if (username.length >= 3) {
      const ref = doc(db, `usernames/${username}`)
      console.log("Firestore read")
      const data = await getDoc(ref);
      setIsValid(!data.exists())
      setLoading(false)
    }
  }, 500), [])
  
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);
  const onSubmit = async (e) => {
    e.preventDefault()

    const userDoc = doc(db, `users/${user.uid}`)
    const usernameDoc = doc(db, `usernames/${formValue}}`)

    //Commit baoth docs

    const batch = writeBatch(db);
  
    batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName})
    batch.set(usernameDoc, {uid: user.uid})

    await batch.commit()
  }

  return (
    <>

    {!username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} isLoading={isLoading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {isLoading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )}
    </>
  );
}

function UsernameMessage({ username, isValid, isLoading }) {
  console.log(username)
  console.log(isValid)
  if (isLoading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}