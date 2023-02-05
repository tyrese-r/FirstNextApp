import Head from "next/head";

export default function ({title, description, image}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  )
}