import PostFeed from '@/components/PostFeed';
import { UserContext } from '@/lib/context';
import { auth, db } from '@/lib/firebase';
import { collection, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { toast } from 'react-hot-toast';
import AuthCheck from '../../components/AuthCheck';


export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(db, 'users', auth.currentUser.uid, 'posts');
  const postsQuery = query(ref, orderBy('createdAt'));
  const [querySnapshot] = useCollection(postsQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
    <h1>Manage your posts</h1>
    <PostFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost () {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));

  const isValid = slug.length > 3 && slug.length < 100;


  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(db, 'users', uid, 'posts', slug)

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await setDoc(ref, data);
    toast.success('Post created!')
    router.push(`/admin/${slug}`)
  }
  return (
    <form onSubmit={createPost}>
      <input value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Article!"
      />
      <p><strong>Slug: </strong>{slug}</p>
      <button type='submit' disabled={!isValid} className='btn-green'>Create new post</button>
    </form>
  )
}