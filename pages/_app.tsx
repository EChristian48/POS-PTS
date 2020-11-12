import Head from 'next/head'
import { CssBaseline } from '@material-ui/core'
import '@root/firebase/init'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
