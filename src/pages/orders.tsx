import moment from 'moment';
import { NextPage, NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/client';
import React from 'react';
import Stripe from 'stripe';

import Header from '../components/Header';
import Order from '../components/Order';
import firebaseAdmin from '../firebaseAdmin';
import { IOrder } from '../interfaces';

interface Props {
  orders: IOrder[];
}

const Orders: NextPage<Props> = ({ orders }) => {
  const [session] = useSession();

  return (
    <div>
      <Header />

      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>{orders.length} orders</h2>
        ) : (
          'Please sign in to see your orders'
        )}

        <div className="mt-5 space-y-4">
          {orders?.map((order: IOrder) => (
            <Order key={order.id} order={order} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;

export const getServerSideProps = async (context: NextPageContext) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
  });

  // Get users logged in credentials
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  const stripeOrders = await firebaseAdmin
    .firestore()
    .collection('users')
    .doc(session.user?.email!)
    .collection('order')
    .orderBy('timestamp', 'desc')
    .get();

  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => {
      const { data: products } = await stripe.checkout.sessions.listLineItems(
        order.id,
        {
          limit: 100,
        }
      );

      return {
        id: order.id,
        amount: order.data().amount,
        amountShipping: order.data().amount_shipping,
        images: order.data().images,
        timestamp: moment(order.data().timestamp.toDate()).unix(),
        products,
      };
    })
  );

  return {
    props: {
      orders,
      session,
    },
  };
};
