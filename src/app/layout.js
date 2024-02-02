import { Inter } from 'next/font/google'
import './globals.css'
import { ChakraProvider } from '@chakra-ui/react'
const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Chatty',
  description: 'Chatty is a chat app',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body >
        <ChakraProvider>
        {children}
        </ChakraProvider>
        </body>
    </html>
  )
}
