import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="flex justify-between max-w-7xl mx-auto py-3 px-2">
      <div className="flex items-center space-x-10 px-3 py-2">
        <div className="relative flex items-center w-52 h-10 cursor-pointer">
          <Link href="/">
            <Image 
                src="/images/logo.svg" 
                alt="Medium Logo" 
                layout="fill" 
                objectFit="contain"
                objectPosition="left" 
            />
          </Link>
        </div>
        <ul className="hidden md:inline-flex space-x-5 items-center">
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li className="text-white bg-green-600 py-1 px-2 rounded-full"><a href="#">Follow</a></li>
        </ul>
      </div>
      <div className="flex space-x-5 items-center text-green-600">
        <h3>Sign in</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">Get Started</h3>
      </div>
    </header>
  )
}

export default Header