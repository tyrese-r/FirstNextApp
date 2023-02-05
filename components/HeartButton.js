import { auth, db } from "@/lib/firebase";
import { increment, writeBatch, doc } from "firebase/firestore";
import { useEffect } from "react";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";

export default function HeartButton({ postRef }) {
  const heartRef = doc(postRef, 'hearts', auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);


  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);

    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })

    await batch.commit();
  }

  const removeHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(db)

    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef, { uid })

    await batch.commit();
  }
  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}