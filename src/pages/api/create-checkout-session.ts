import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from '../../interfaces';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export const checkout = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, products } = req.body;

  const line_items = products.map(
    ({ title, image, description, price }: IProduct) => ({
      description,
      quantity: 1,
      price_data: {
        currency: 'gbp',
        product_data: {
          name: title,
          images: [image],
        },
        unit_amount: parseInt(price) * 100,
      },
    })
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_rates: ['shr_1Jvh3eLKx272rZ2PY8v4XzP4'],
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'CA'],
    },
    line_items,
    mode: 'payment',
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/cancel`,
    metadata: {
      email,
      images: JSON.stringify(products.map(({ image }: IProduct) => image)),
    },
  });

  res.status(200).json({ id: session.id });
};

export default checkout;
