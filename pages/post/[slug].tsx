import Image from "next/image";
import Link from "next/link";
import PortableText from "react-portable-text";
import { Header } from "../../components";
import sanityClient, { urlFor } from "../../sanity";
import { PostType } from "../../types";

function Post({ post }: { post: PostType }) {
  return (
    <main>
      <Header />
      <div className="w-full h-40 relative">
        <Image
          src={urlFor(post.mainImage).url()!}
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>

      <article className="max-w-3xl mx-auto p-3">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full">
            <Image
              src={urlFor(post.author.image).url()!}
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="font-extralight text-sm">
            Blog post by <Link href="#"><span className="text-green-600">{post.author.name}</span></Link> - Published at {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset="production" //{process.env.SANITY_DATASET!}
            projectId="xidv70eb"//{process.env.SANITY_PROJECT_ID!}
            content={post.body}
            serializers={
              {
                h1: (props: any) => (
                  <h1 className="text-2xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                  <h1 className="text-xl font-bold my-5" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">{children}</a>
                ),
              }
            }
          >

          </PortableText>
        </div>
      </article>
      <hr className="max-w-lg mx-auto border border-yellow-500 my-10" />
      <div className="max-w-3xl mx-auto p-3">
        <form>
          <h3 className="text-sm text-yellow-500">Enjoyed this article ?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />
          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input" type="text" placeholder="Jesica" />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input" type="email" placeholder="Jesica" />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea rows={8} placeholder="Leave your comment..." />
          </label>
        </form>
      </div>
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
        _id,
        slug {
            current
        }
    }`
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: PostType) => ({
    params: { slug: post.slug.current }
  }))
  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
        description,
        mainImage,
        slug,
        body
    }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  });

  if (!post) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      post
    },
    revalidate: 60 // after 60 seconds, it'll update the old cache version
  }
}

export default Post