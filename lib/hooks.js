import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from '../lib/firebase';

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      console.log(db)
      const ref = doc(db, "/users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user])

  return {user, username}
}