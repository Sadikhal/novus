import React from 'react';
import { Link } from 'react-router-dom';

const ProfileModal = () => {
  return (
    <>
      <div className='flex justify-end w-full' onClick={() => document.getElementById('my_modal_3').showModal()}>
        <button className='btn hover:bg-teal-700 border-none text-teal-100 capitalize font-rubik bg-cyan-800'>
          edit
        </button>
      </div>

      <dialog id="my_modal_3" className="modal overflow-hidden">
        <div className="modal-box bg-[#ffff] overflow-hidden">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <form action="" className='flex flex-col gap-4 w-full'>
            <div className='flex flex-col justify-center items-center'>
              <div className='text-black text-[22px] font-bold tracking-wider  font-robotos capitalize'>
                Update your profile
              </div>
            </div>
            
            <div className='flex flex-col'>    
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-black">Your name</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Type here" 
                  className="input bg-[#ffff] input-bordered w-full text-black focus:border-black focus:outline-black border-black" 
                />
                <div className="label">
                  <span className="label-text-alt text-black">Bottom Left label</span>
                </div>
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-black">Gmail</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Type here" 
                  className="bg-[#ffff] input input-bordered w-full text-black focus:border-black focus:outline-black border-black" 
                />
                <div className="label">
                  <span className="label-text-alt text-black">Summarise your review in 150 characters or less.</span>
                </div>
              </label>

              <label className="form-control w-full h-full">
                <div className="label">
                  <span className="label-text text-black capitalize">Your Address</span>
                </div>
                <textarea 
                  className="textarea textarea-Foreground text-black textarea-bordered bg-[#ffff] h-[50px] w-full focus:border-black focus:outline-black border-black" 
                  placeholder=""
                ></textarea>
                <div className="label">
                  <span className="label-text-alt text-error">Describe what you liked, what you didn't like and other key things shoppers should know. Minimum 30 characters.</span>
                </div>
              </label>
            </div>
            
            <button className='btn btn-block'>submit</button>
          </form>  
        </div>
      </dialog>      
    </>
  );
};

export default ProfileModal;