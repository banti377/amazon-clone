import { NextPage } from 'next';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Currency from 'react-currency-formatter';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { loadStripe } from '@stripe/stripe-js';

import Header from '../components/Header';
import CheckoutProduct from '../components/CheckoutProduct';
import { selectProducts, selectTotal } from '../slices/cartSlice';

import { IProduct } from '../interfaces';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout: NextPage = () => {
  const products = useSelector(selectProducts);
  const total = useSelector(selectTotal);

  const [session] = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post('/api/create-checkout-session', {
      products,
      email: session?.user?.email,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) alert(result.error.message);
  };

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="/advertisement 2.png"
            alt="advertisement-2"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {products.length
                ? 'Shopping Cart'
                : 'Your Shopping Cart is empty.'}
            </h1>

            {products.map((product: IProduct) => (
              <CheckoutProduct key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white p-10 shadow-md">
          {products.length ? (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({products.length} products:)
                <span className="ml-1 font-bold">
                  <Currency quantity={total} currency="GBP" />
                </span>
              </h2>

              <button
                onClick={createCheckoutSession}
                role="link"
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                {!session ? 'Sign in to Checkout' : 'Proceed to Checkout'}
              </button>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
