import { FC } from 'react';
import Image from 'next/image';
import Currency from 'react-currency-formatter';
import { StarIcon } from '@heroicons/react/solid';
import { useDispatch } from 'react-redux';

import { IProduct } from '../interfaces';
import { addToCart, removeFromCart } from '../slices/cartSlice';

interface Props {
  product: IProduct;
}

const CheckoutProduct: FC<Props> = ({
  product: { id, image, title, rating, description, price, category, hasPrime },
}) => {
  const dispatch = useDispatch();

  const addItemToCart = () => {
    const product = {
      id,
      image,
      title,
      rating,
      description,
      price,
      category,
      hasPrime,
    };
    dispatch(addToCart(product));
  };

  const removeItemFromCart = () => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="grid grid-cols-5">
      <Image
        src={image}
        alt={title}
        height={200}
        width={200}
        objectFit="contain"
      />

      <div className="col-span-3 mx-5">
        <p>{title}</p>

        <div className="flex">
          {Array(rating)
            .fill('')
            .map((_, index) => (
              <StarIcon key={index} className="text-yellow-400 h-5" />
            ))}
        </div>

        <p className="text-xs my-2 line-clamp-3">{description}</p>

        <Currency quantity={parseInt(price)} currency="GBP" />

        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              src="/prime logo.png"
              loading="lazy"
              alt="prime-logo"
              className="w-12"
            />
            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button className="button mt-auto" onClick={addItemToCart}>
          Add to Cart
        </button>
        <button className="button mt-auto" onClick={removeItemFromCart}>
          Remove from Cart
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
