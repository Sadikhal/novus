const BrandFormIntro = () => {
  return (
    <div className='px-7 h-full py-5'>
      <div className='flex flex-col lg:flex-row gap-12 h-full'>
        <div className='lg:flex-1 h-full'>
          <div className='sm:px-7 relative h-full'>
            <img 
              src="/images/createBrand5.webp" 
              className='object-cover lg:h-auto md:h-screen sm:h-full w-full rounded-xl hover:grayscale-[80%] min-h-[380px]' 
              alt="banner" 
            />
            <div className='flex absolute w-80 bottom-0 left-0 bg-[#3b706c] rounded-lg flex-row justify-around items-center sm:py-2 sm:px-5 py-1 px-2'>
              <div className='text-slate-100 text-[16px] font-robotos leading-6 uppercase tracking-wide'>
                Believe in the process, and greatness will unfold in time.
              </div>
              <div className='flex mt-12 mr-2 bg-black rounded-full px-4 py-4 text-base'>
                <img 
                  src="/icons/right1.png" 
                  alt="right arrow" 
                  className='object-cover w-3 h-3' 
                />
              </div>
            </div>
          </div>
        </div>
        <div className='lg:flex-1 px-1 pl-2 pt-4'>
          <div className='text-[15px] font-normal text-justify font-robotos text-slate-800 pb-4 leading-6'>
            <span className="font-bold text-[16px] text-cyan-600">Welcome to Novus</span> – Where Your Business Begins, Its Next Big Chapter
            At Novus, we believe every entrepreneur deserves a powerful platform to showcase their products, reach new customers, and grow without limits. That's why we've built more than just an e-commerce marketplace—we've created a thriving ecosystem where sellers like you can turn passion into profit.
            <br/><br/>
            Whether you're an established brand or just starting out, Novus offers the tools, support, and exposure you need to thrive in the digital marketplace. From seamless product listings and secure payments to powerful analytics and dedicated seller support, we equip you with everything to succeed—backed by a brand trusted by thousands.
            <br/><br/>
            Join the Novus Seller Community today and take the first step toward transforming your business. Let's grow together and redefine what success looks like in the world of e-commerce.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandFormIntro;