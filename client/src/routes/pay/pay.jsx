
import  { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from "../../components/sections/checkoutForm";
import { ErrorFallback } from "../../components/sections/ErrorFallback";


let stripePromise = null;
const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISH_KEY
    ).catch(error => {
      console.error('Failed to load Stripe.js:', error);
      throw error;
    });
  }
  return stripePromise;
};

const Pay = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state?.clientSecret) {
      navigate('/cart', { replace: true });
      return;
    }

    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        setStripeError('Payment system is taking longer than expected. Please check your connection.');
        setIsLoading(false);
      }
    }, 15000);

    getStripePromise()
      .then(() => {
        if (isMounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStripeError('Failed to load payment system. Please check your internet connection.');
          console.error('Stripe loading error:', error);
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [state, navigate]);

  if (!state?.clientSecret) {
    return null;
  }

  return (
    <div className="min-h-screen bg-lamaWhite">
      {stripeError ? (
        <div className="flex items-center justify-center h-screen">
          <ErrorFallback
            error={stripeError}
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="loading loading-spinner text-[#7c9107] w-16 h-16"></div>
            <p className="mt-4 text-gray-600 font-helvetica">Loading payment system...</p>
          </div>
        </div>
      ) : (
        <Elements 
          options={{
            clientSecret: state.clientSecret,
            appearance: { theme: 'stripe' }
          }} 
          stripe={stripePromise}
        >
          <CheckoutForm 
            clientSecret={state.clientSecret}
            products={state.products} 
            address={state.address} 
            total={state.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)}
          />
        </Elements>
      )}
    </div>
  );
};

export default Pay;