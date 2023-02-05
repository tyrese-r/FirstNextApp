import Navbar from '@/components/Navbar'
import { useUserData } from '@/lib/hooks';
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';





export default function App({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
