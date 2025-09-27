
import  { useState } from "react";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { apiRequest } from '../../lib/apiRequest';
import { useDispatch } from 'react-redux';
import { resetCart } from '../../redux/cartSlice';
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/Separator";

const usePaymentProcessing = () => {
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processPayment = async ({ 
    stripe, 
    elements, 
    clientSecret, 
    address,
    onSuccess
  }) => {
    if (!stripe || !elements) {
      return { error: "Payment system is not ready. Please try again later." };
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      if (!address?.pincode) {
        throw new Error('Complete shipping address is required');
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/orders`,
          payment_method_data: {
            billing_details: {
              address: {
                line1: address.street || address.city,
                city: address.city,
                state: address.state,
                postal_code: address.pincode.toString()
              }
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) return { error: error.message };

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      
      if (paymentIntent.status === 'succeeded') {
        await onSuccess(paymentIntent.id);
        return { success: true };
      }

      return { error: 'Payment not completed' };
    } catch (err) {
      return { error: err.message || 'Payment processing failed' };
    } finally {
      setIsProcessing(false);
    }
  };

  return { message, setMessage, isProcessing, processPayment };
};

const ProductItem = ({ item }) => (
  <div className="flex items-center py-3 px-3 bg-white rounded-md">
    <img 
      src={item.image} 
      className="object-cover rounded-md h-28 w-28" 
      alt={item.name} 
      loading="lazy"
    />
    <div className="pl-2 flex flex-col gap-3">
      <h4 className="font-semibold capitalize text-[15px] sm:text-base  text-slate-950 font-poppins overflow-hidden px-2">
        {item.name}
      </h4>
      <p className="font-robotos font-bold text-[#593d3d] px-2 text-sm">Quantity: {item.quantity}</p>
      <p className="font-medium font-robotos text-sm text-slate-950 px-2">Shipping Fee: 0</p>
      <p className="font-medium font-robotos text-sm text-slate-950 px-2">
        Price: ₹{(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
);

export default function CheckoutForm({ products, address, total, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    message, 
    setMessage, 
    isProcessing, 
    processPayment 
  } = usePaymentProcessing();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await processPayment({
      stripe,
      elements,
      clientSecret,
      address,
      onSuccess: async (paymentId) => {
        await apiRequest.put('/orders/confirm', { payment_intent: paymentId });
        dispatch(resetCart());
        navigate('/dashboard/order-success', { 
          state: { orderId: paymentId, total } 
        });
      }
    });

    if (result.error) {
      setMessage(result.error);
    }
  };

  const paymentElementOptions = {
    layout: "accordion",
    fields: {
      billingDetails: {
        address: {
          postalCode: 'never'
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form" className="bg-cartBg p-4 rounded-lg flex flex-col lg:flex-row gap-3">
      <div className="mb-6 w-full lg:flex-1 gap-3 flex flex-col">
        {products.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
        
        <div className="flex justify-between pt-4 px-2 font-robotos">
          <h3 className="text-xl font-bold text-[#121403]">Total Amount : </h3>
          <h3 className="text-xl font-bold text-[#282c09]">₹{total.toFixed(2)}</h3>
        </div>
        <Separator className="mx-3 w-[97%] bg-slate-200 h-[1px]"/> 
      </div>
      
      <div className="payment-section flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-slate-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 font-poppins">
            Payment Details
          </h3>
          <div className="payment-container border border-gray-200 rounded-lg p-4">
            <PaymentElement 
              options={paymentElementOptions} 
              id="payment-element"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className={`w-full py-3 px-4 rounded-lg glass cursor-pointer font-semibold transition-colors tracking-wider
            ${isProcessing ? 'bg-white text-[#7c9107] cursor-not-allowed' : 
            'bg-[#8f9722] hover:bg-[#9f9100] text-lamaWhite'} 
            shadow-sm font-robotos`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner text-[#7c9107]"></span>
              <span className="ml-2">Processing...</span>
            </span>
          ) : `Pay - ₹${total.toFixed(2)}`}
        </button>

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
