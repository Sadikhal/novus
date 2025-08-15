import React from 'react';
import { Button } from './ui/Button';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export const BannerSectionHeader = ({
  title,
  navigateTo,
  warningText
}) => {
  const navigate = useNavigate();
  
  return (
    <div className='flex flex-col rounded-sm gap-3 md:gap-0 mx-2 bg-[#a0b2ba] shadow-sm shadow-slate-200 py-2'>
      <div className='md:text-[25px] text-[20px] sm:text-[23px] font-bold text-[#1f1a1a] capitalize px-2'>
        {title}
      </div>
      <div className='w-full flex gap-3 md:gap-0 justify-between md:flex-row flex-col md:items-center -mt-2'>
        <div className='text-[12px] font-poppins font-bold text-[#9e0000] px-2'>
          {warningText}
        </div>
        <div className="flex justify-end md:px-4 px-2">
          <Button 
            onClick={() => navigate(navigateTo)}
            className="bg-[#fff] text-cyan-800 hover:bg-[#ffff]/70 justify-between items-center flex flex-row shadow-sm cursor-pointer"
          >
            {`Create ${title}`}
            <span><IoIosAdd className='text-xl' /></span>
          </Button>
        </div>
      </div>
    </div>
  );
};