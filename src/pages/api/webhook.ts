import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

import firebaseAdmin from '../../firebaseAdmin';

// Establish connection to Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const endpointSecret = process.env.STRIPE_SIGNING_SECRET!;

const fulfillOrder = async (session: any) => {
  return firebaseAdmin
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('order')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() =>
      console.log(`Success: Order ${session.id} has been added to db.`)
    )
    .catch(() => console.log(`Failure: Order failed`));
};

export const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const reqBuffer = await buffer(req);
    const payload = reqBuffer.toString();
    const signature = req.headers['stripe-signature']!;
    let event;

    // Verify if event came from stripe
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the order
      fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export default webhook;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
