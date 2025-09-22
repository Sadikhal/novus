import { Link } from 'react-router-dom';
import { social } from '../../lib/data';

const Footer = () => {
  return (
    <div className='cards h-full w-full py-5 bg-novusHome'>
      <div className='px-20 flex lg:flex-row gap-12 flex-col'>
        <div className='flex lg:gap-8 justify-between'>
          <div className='px-2'>
            <div className='text-[#282c3f] font-assistant font-bold text-[12px] uppercase whitespace-nowrap'>
              online shopping
            </div>
            <div className='mt-5 flex flex-col gap-5'>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>men</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>women</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>perfumes</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>mobiles</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>electronics</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>accessories</Link>
            </div>
          </div>
          
          <div className='px-2'>
            <div className='text-[#282c3f] font-assistant font-bold text-[12px] uppercase whitespace-nowrap'>
              customer policies
            </div>
            <div className='mt-5 flex flex-col gap-5'>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>contact</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>faq</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>T&C</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>terms of use</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>profile</Link>
              <Link to='/' className='text-[#696b79] leading-normal text-[15px] cursor-pointer capitalize font-assistant'>privacy policy</Link>
            </div>
          </div>
        </div>  

        <div className='flex flex-col lg:flex-row gap-10'>
          <div className='px-2'>
            <div className='text-[#282c3f] font-assistant font-bold text-[12px] uppercase'>
              mail us:
            </div>
            <div className='mt-5 flex flex-col gap-5'>
              <div className='text-[#696b79] leading-normal text-[15px] cursor-pointer font-assistant capitalize'>
                Novus internet private limited buildings alyssa, begonia & clove embassy, Tech village, outer Ring Road, Bengaluru, 560103, karnataka, india
              </div>
            </div>
          </div>

          <div className='px-2'>
            <div className='text-[#282c3f] font-assistant font-bold text-[12px] uppercase'>
              registered office address:
            </div>
            <div className='mt-5 flex flex-col gap-5'>
              <div className='text-[#696b79] leading-normal text-[15px] cursor-pointer font-assistant capitalize'>
                Novus internet private limited buildings alyssa, begonia & clove embassy, Tech village, outer Ring Road, Bengaluru, 560103, karnataka, india
              </div>
              <div className='text-[#696b79] leading-normal text-[15px] cursor-pointer font-assistant uppercase'>
                CIN: U511676PToctOPLKHDHB65
              </div>
              <div className='text-[#696b79] leading-normal text-[15px] cursor-pointer font-assistant uppercase'>
                TELEPHONE: 044-645614700 / 044-67415800
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2 text-center py-5'>
        <div className="divider"></div>
        <div className='flex justify-center'>
          <img src="/novus9.png" alt="logo" className="w-28 h-28 rounded-full bg-transparent object-contain" />
        </div>
        <div className='px-4 sm:px-1 text-slate-900 text-[14px]'>
          © Copyright 1995-2024 novus Inc. All Rights Reserved. Accessibility, User Agreement, Privacy, Payments Terms of Use, Cookies, CA Privacy Notice, Your Privacy Choices and AdChoice
        </div>
        <div className='flex flex-row gap-2 pt-4 text-center items-center justify-center'>
          {social.map((item) => (       
            <Link to='' key={item.name}>
              <button className="btn border-none bg-[#2aa488] rounded-full hover:bg-[#1a924c]">
                <img src={item.url} alt={item.name} className="w-[18px] h-[22px] object-contain cursor-pointer" />
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;