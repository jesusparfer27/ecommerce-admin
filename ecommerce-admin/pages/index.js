import Layout from '../components/Layout';
import { useSession } from "next-auth/react"

export default function Home() {

  const { data: session } = useSession();
  console.log({ session });
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }

  return <Layout>
    <div className='text-blue-900 flex justify-between'>
      <h2>
        Hello, <b>{session?.user?.email}</b>
      </h2>
      <div className='flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden'>
        <img src={session?.user?.image} alt="" className='w-6 h-6' />
        <span className='py-1 px-2'>
          {session?.user?.name}
        </span>
      </div>
    </div>
  </Layout>
}
