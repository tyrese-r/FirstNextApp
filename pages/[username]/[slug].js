import AuthCheck from "@/components/AuthCheck";
import HeartButton from "@/components/HeartButton";
import PostContent from "@/components/PostContent";
import { db, postToJSON, getUserWithUsername } from "@/lib/firebase";
import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import styles from '../../styles/Post.module.css';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);


  let post;
  let path;

  if (userDoc) {
    const postRef = doc(userDoc.ref, 'posts', slug);

    console.log(slug)
    post = postToJSON(await getDoc(postRef));
    console.log(post)

    path = postRef.path;
    console.log(path)
  }

  return {
    props: { post, path },
    revalidate: 5000
  }
}

export async function getStaticPaths() {

  const snapshot = await getDocs(collectionGroup(db, 'posts'));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();

    return {
      params: { username, slug }
    }
  })


  return {
    paths,
    fallback: 'blocking'
  }
}


export default function Post(props) {
  const postRef = doc(db, props.path);
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post;
  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck>
          <HeartButton postRef={postRef}></HeartButton>
        </AuthCheck>

      </aside>
    </main>
  );
}