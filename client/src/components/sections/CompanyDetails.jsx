import React from 'react';
import { TiTick } from "react-icons/ti";

const CompanyDetails = () => {
  return (
    <div className='bg-[#ffeee8] px-2 md:px-4 lg:px-6 p-12'>
      <div className='font-robotos text-sm md:text-[15px] text-slate-700 font-normal leading-relaxed text-balance'>
        Myntra makes selling online extremely easy. After guiding sellers with their onboarding requirements, there is support in terms of fulfillment models, platform integration & prerequisites for operational readiness. Secure and timely payments on predefined days makes the entire process easier for sellers. There is also a lot of scope for growth with tailored support at every step of the selling journey if you sell in Myntra.

        Moreover, Myntra's Partner Insights provides real-time data with reporting dashboards and highly curated data insight tools. Product list ads, display ads, search banners and Myntra Live will also help promote your brands and products. Myntra's very own Partner University will help sellers understand Myntra's policies and processes through videos, courses, documents and more.

        So as a fashion or beauty brand, if you are selling in India, you should sell in Myntra!

        At Flipkart, we recognize that there may be times when you require additional assistance for your online business. That's why, with your Flipkart seller account, you gain access to a diverse range of tools and support functions designed to foster business growth. These include:
      </div>

      <div className='flex flex-col gap-5 pt-12 px-2'>
        <div className='flex flex-row gap-3 items-center'>
          <TiTick className='text-[#16755f] text-xl' />
          <div className='font-robotos text-[15px] text-slate-700'>
            <span className='font-bold pr-3'>Price Recommendation Tool:</span> Helps you determine optimal pricing for your products.
          </div>
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <TiTick className='text-[#16755f] text-xl' />
          <div className='font-robotos text-[15px] text-slate-700'>
            <span className='font-bold pr-3'>Product Recommendation Tool:</span> Suggests popular and trending products to expand your product selection.
          </div>
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <TiTick className='text-[#16755f] text-xl' />
          <div className='font-robotos text-[15px] text-slate-700'>
            <span className='font-bold pr-3'>Paid Account Management services:</span> Offers dedicated account management support for personalised guidance.
          </div>
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <TiTick className='text-[#16755f] text-xl' />
          <div className='font-robotos text-[15px] text-slate-700'>
            <span className='font-bold pr-3'>Shopping Festivals and more:</span> Participate in exciting sales events and promotional campaigns.
          </div>
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <TiTick className='text-[#16755f] text-xl' />
          <div className='font-robotos text-[15px] text-slate-700'>
            <span className='font-bold pr-3'>Catalog & Photoshoot services:</span> Assists with creating high-quality product catalogues and images.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;