import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

import Loader from '../components/Loader'
import { toast } from 'react-hot-toast'
import { collectionGroup, query, where, orderBy, limit, getDocs, getDoc, Timestamp, startAfter } from 'firebase/firestore'
import { db, postToJSON } from '@/lib/firebase'
import PostFeed from '@/components/PostFeed'
import { useState } from 'react'
import Metatags from '@/components/Metatags'

const LIMIT = 1;
export async function getServerSideProps(context) {
  const postsQuery = query(collectionGroup(db, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT));

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON)

  return {
    props: { posts },
  };
}


export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    const postsQuery = query(
      collectionGroup(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(LIMIT),
      startAfter(cursor)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data())
    setPosts(posts.concat(newPosts))
    setLoading(false);
    if(newPosts.length < LIMIT) {
      setPostsEnd(true)
    }

  }
  return (
    <main>
      <Metatags title='Blog'/>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts} >Load more</button>}
      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}
