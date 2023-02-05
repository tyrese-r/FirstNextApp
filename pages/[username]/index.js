import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { db, getUserWithUsername, postToJSON } from '@/lib/firebase';
import { collection, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';


export async function getServerSideProps ({query: queryProp}) {

  // Get username from query
  const {username} = queryProp;


  const userDoc = await getUserWithUsername(username);

  if(!userDoc) {
    return {
      notFound: true,
    }
  }

  let user = null;
  let posts = null;

  if(userDoc) {
    user = userDoc.data()
    const postsQuery = query(collection(userDoc.ref, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(5));
    
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
    //console.log(postsA)
    console.log(posts)
    //console.log((await (await getDocs(collection(userDoc.ref, 'posts'))).docs.map((d) => d.data())))
    
  }

  return {
    props: {user, posts},
  };
}

export default function UserProfilePage({user, posts}) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}