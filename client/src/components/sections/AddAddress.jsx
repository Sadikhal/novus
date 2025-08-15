import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/Accordion';

const AddAddress = ({ type }) => {
  return (
    <Accordion className="items-center">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-normal text-[#222222] text-base font-poppins w-full capitalize">
          <button className="btn btn-sm px-6 h-10 bg-[#fff] border-gray-300 items-center flex rounded-md text-teal-800 capitalize">
            {type}
          </button>
        </AccordionTrigger>

        <AccordionContent className="flex items-center justify-center pt-20 mt-4">
          <div 
            style={{ animation: 'slideInFromLeft 1s ease-out' }}
            className="w-full bg-[#ffff] rounded-xl shadow-2xl p-8 space-y-8 border z-50 mb-12"
          >
            <h2
              style={{ animation: 'appear 2s ease-out' }}
              className="text-center text-4xl font-extrabold text-black capitalize font-helvetica"
            >
              {type === "edit" ? "Edit Your Address" : "Add Your Address"}
            </h2>

            <form method="POST" action="#" className="space-y-6 overflow-y-scroll">
              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  Mobile Number
                </label>
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  Gmail
                </label>
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 capitalize peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  birthday(dd/mm/yy)
                </label>
              </div>
              
              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="profile"
                  name="profile"
                  type='file'
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-500 transition-all px-1 text-sm peer-placeholder-shown:text-xs placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 capitalize peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="profile"
                >
                  profile photo
                </label>
              </div>

              <div className='capitalize font-bold text-black'>
                alternate contact details
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  Mobile Number
                </label>
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  className="peer h-10 w-full border border-gray-300 text-sm text-slate-900 p-2 -z-50 placeholder-transparent focus:outline-none focus:border-slate-600"
                  required
                  id="password"
                  name="password"
                />
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin placeholder-slate-500 bg-[#ffff] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-500 peer-focus:text-xs font-normal"
                  htmlFor="password"
                >
                  Address
                </label>
              </div>

              <button
                className="w-full h-10 px-4 bg-teal-700 hover:bg-cyan-700 rounded-md shadow-lg text-white font-semibold transition capitalize duration-200"
                type="submit"
              >
                save details
              </button>
            </form>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AddAddress;