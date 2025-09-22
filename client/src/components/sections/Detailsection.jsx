import React, { useState } from 'react';
import BrandDetails from '../../components/sections/BrandDetails';
import Review from '../../components/sections/Review';
import { Button } from '../../components/ui/Button';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useUserActions } from '../../hooks/useUserActions';

const Detailsection = ({ product: initialProduct }) => {
  const { handleMessageSubmit } = useUserActions(initialProduct);
  const [product, setProduct] = useState(initialProduct);

  return (
    <div className="w-full pt-12 pb-5 bg-white">
      <TabGroup className="w-full">
        <TabList className="w-full px-4 flex md:flex-row flex-col xl:gap-16 gap-3">
          <Tab className="w-full rounded-sm py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-[#ffffff] data-[hover]:bg-white/3 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white shadow-[#305a4e] shadow-sm data-[selected]:border-b-[3px] cursor-pointer transition ease-in-out duration-75 border-b-[#1e7e98]">
            <Button asChild className="bg-transparent data-[hover]:bg-white/3 hover:bg-transparent w-full px-12 uppercase text-[#1a1b1b] text-[18px] font-[700] tracking-wide font-assistant border-none cursor-pointer">
              <span>about the brand</span>
            </Button>
          </Tab>
          <Tab className="w-full rounded-sm py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-[#ffffff] data-[hover]:bg-white/3 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white shadow-[#305a4e] shadow-sm data-[selected]:border-b-[3px] cursor-pointer transition ease-in-out duration-75 border-b-[#1e7e98]">
            <Button asChild className="bg-transparent data-[hover]:bg-white/3 hover:bg-transparent w-full px-12 uppercase text-[#1a1b1b] text-[18px] font-[700] tracking-wide font-assistant border-none cursor-pointer">
              <span>Reviews</span>
            </Button>
          </Tab>
          <Tab className="w-full rounded-sm py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-[#ffffff] data-[hover]:bg-white/3 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white shadow-[#305a4e] shadow-sm data-[selected]:border-b-[3px] cursor-pointer transition ease-in-out duration-75 border-b-[#1e7e98]">
            <Button asChild className="bg-transparent data-[hover]:bg-white/3 hover:bg-transparent w-full px-12 uppercase text-[#1a1b1b] text-[18px] font-[700] tracking-wide cursor-pointer font-assistant border-none">
              <span>Shipping and returns</span>
            </Button>
          </Tab>
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel className="rounded-xl bg-white/5 p-3">
            <BrandDetails />
          </TabPanel>
          <TabPanel className="rounded-xl bg-white/5 p-3">
            <Review product={product} />
          </TabPanel>
          <TabPanel className="rounded-xl bg-white/2 p-3">
            <div className="hero">
              <div className="hero-content h-full justify-center">
                <div className="text-left">
                  <h1 className="text-black text-[22px] font-bold tracking-wider font-robotos capitalize">Shipping Return and pickup</h1>
                  <p className="text-[#111111] pt-7 md:pt-10 text-[16px] font-[300] font-helvetica tracking-wide text-justify">
                    Our brand is committed to your happiness. We want you to be as pleased with your purchase as we are in serving you. If you're not happy for any reason, we will gladly accept your return within 14 days of your order delivery date. In order to make your return simple and inexpensive, it's on the house and we're picking up the tab
                  </p>
                  <div className="px-4 lg:px-6">
                    <li className="text-[#111111] pt-5 text-[16px] font-[300] font-helvetica tracking-wide">
                      Standard delivery 9–14 business days
                    </li>
                    <li className="text-[#111111] text-[16px] font-[300] font-helvetica tracking-wide">
                      Orders are processed and delivered Monday–Friday (excluding public holidays)
                    </li>
                    <li className="text-[#111111] text-[16px] font-[300] font-helvetica tracking-wide">
                      Refunds will be initiated in 48 hours and amount may take up to 5-15 working days depending upon your bank to reflect in your account.
                    </li>
                  </div>
                  <div className="text-[#111111] text-[16px] font-[300] font-helvetica tracking-wide pt-5">
                    For any queries, please contact Customer Service at chat section or via customercareindia@puma.com
                  </div>
                  <div className="pt-12">
                    <button
                      onClick={handleMessageSubmit}
                      className="btn hover:glass px-16 border-2 border-[#635d05] hover:bg-[#043e53] hover:text-lamaWhite hover:border-none uppercase text-[18px] bg-[#ffff] font-[700] tracking-wide font-assistant text-[#815504]"
                    >
                      chat to seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Detailsection;