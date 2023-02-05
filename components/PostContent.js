import { Timestamp } from "firebase/firestore"
import Link from "next/link"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import Metatags from "./Metatags"

export default function ({ post}) {

  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate()
  return (
    <div className="card">
      <Metatags title={post.title} description={`By @${post.username}`}/>
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by {' '}
        <Link className="text-info" href={`/${post.username}`}>@{post.username}</Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  )
}
