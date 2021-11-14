import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
      </Head>

      <Header />

      <main className="max-w-screen-2xl mx-auto">
        <Banner />
        {/* <ProductFeed /> */}
      </main>
    </div>
  );
};

export default Home;
