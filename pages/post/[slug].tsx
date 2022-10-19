import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PortableText from "react-portable-text";
import sanityClient, { urlFor } from "../../sanity";
import { PostType } from "../../types";

interface IFormInput {
  _id: string, 
  name: string, 
  email: string, 
  comment: string
}

function Post({ post }: { post: PostType }) {
  const [commented, setCommented] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();

  const onSubmit : SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST", 
      body: JSON.stringify(data)
    }).then(() => {
      setCommented(true);
    }).catch(err => {
      console.log(err);
      setCommented(false);
    })
  }
  return (
    <>
      <div className="w-full h-40 md:h-80 relative">
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
      {commented ? (
        <div className="flex flex-col space-y-2 bg-yellow-500 text-white my-10 p-10 max-w-2xl mx-auto">
          <h3 className="text-3xl text-bold">Thank you for submitting your comment! </h3>
          <p>Once it is approved, it will appear below!</p>
        </div>
      ) : (
          <div className="max-w-3xl mx-auto p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-sm text-yellow-500">Enjoyed this article ?</h3>
              <h4 className="text-3xl font-bold">Leave a comment below!</h4>
              <hr className="py-3 mt-2" />

              <input {...register("_id")} type="hidden" name="_id" value={post._id} />
              <label className="block mb-5">
                <span className="text-gray-700">Name</span>
                <input {...register("name", { required: true })} className="outline-none focus:ring shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input" type="text" placeholder="Jesica" />
              </label>
              <label className="block mb-5">
                <span className="text-gray-700">Email</span>
                <input {...register("email", { required: true })} className="outline-none focus:ring shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input" type="email" placeholder="Jesica" />
              </label>
              <label className="block mb-5">
                <span className="text-gray-700">Comment</span>
                <textarea {...register("comment", { required: true })} rows={8} placeholder="Leave your comment..." className="outline-none focus:ring shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500"/>
              </label>

              {/* Errors show here */}
              <div className="flex flex-col p-5">
                {errors.name && (
                  <span className="text-red-500">The Name field is required</span>
                )}
                {errors.email && (
                  <span className="text-red-500">The Email field is required</span>
                )}
                {errors.comment && (
                  <span className="text-red-500">The Comment field is required</span>
                )}
              </div>
              <input className="shadow bg-yellow-500 
                              hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer" type="submit" />
            </form>
          </div>
      )}
      
      {/* Comment */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2"/>
        {post.comments.map(comment => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name} </span>: {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </>
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