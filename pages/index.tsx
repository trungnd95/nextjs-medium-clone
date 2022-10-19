import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import sanityClient, { urlFor } from "../sanity"
import { PostType } from "../types"

interface Props {
  posts: [PostType]
}

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="flex items-center justify-between bg-yellow-400 py-10 xl:py-0 px-10">
        <div className="flex-[1.5]">
          <h1 className="text-6xl max-w-2xl font-serif">
            <span className="underline decoration-black decoration-4">Medium</span> is a place to write, read and connect.
          </h1>
          <h2 className="mt-4 text-xl max-w-2xl">It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
        </div>
        <div className="hidden md:inline-flex relative flex-[0.8] py-14 xl:py-32 px-10 ">
          <Image src="/images/Medium-logo.png" className="" layout="fill" objectFit="contain" />
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts?.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="w-full border rounded-lg group cursor-pointer overflow-hidden">
                <div className="w-full h-48 relative group-hover:scale-105 transition-all duration-200 ease-in-out">
                  <Image 
                    src={urlFor(post.mainImage).url()!} 
                    alt="" 
                    layout="fill"
                    objectFit="cover" 
                  />
                </div>
                <div className="flex justify-between items-center p-5 bg-white space-x-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-xs">{post.description} by <a href="#">{post.author.name}</a></p>
                  </div>
                  <div className="relative w-12 h-12 rounded-full">
                    <Image 
                      src={urlFor(post.author.image).url()!}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                      className=""
                    />
                  </div>
                  
                </div>
              </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
    _id, 
    title, 
    author -> {
      name, 
      image
    }, 
    description, 
    mainImage, 
    slug
  }`
  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts
    }
  }
}

export default Home
