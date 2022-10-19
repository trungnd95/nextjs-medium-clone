import Head from "next/head"
import Header from "./Header"

function Layout({ children } : { children: JSX.Element }) {
  return (
    <main>
        <Head>
            <title>Medium</title>
        </Head>

        {/* Header Nav */}
        <Header />

        {children}
    </main>
  )
}

export default Layout