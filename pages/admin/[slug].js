import AuthCheck from "@/components/AuthCheck";
import styles from '../../styles/Admin.module.css';
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";


export default function AdminPostEdit({ }) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();

  const { slug } = router.query;

  const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug);
  // const postRef = doc(db, 'users', 'Ne9e7vnkr7drkhVUJCIBWeKQuHw1', 'posts', 'hello-world');

  const [post] = useDocumentDataOnce(postRef);
  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!')
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

        <textarea {...register('content', { required: true })}></textarea>
        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register('published', { required: { value: true }, maxLength: { value: 2000, message: 'Too long' }, minLength: { value: 10, message: 'too short' } })} />
          <label>Published</label>
        </fieldset>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}
        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}