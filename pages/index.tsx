import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { Header } from "../components"

const Home: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Nav */}
      <Header />

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
    </div>
  )
}

export default Home
