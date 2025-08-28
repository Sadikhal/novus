import { MdOutlineAssignmentReturn } from "react-icons/md";
import CreateBrandBanner from '../components/CreateBrandBanner';
import { Button } from '../components/ui/Button';
import CompanyDetails from '../components/CompanyDetails';
import TestimonialSlider from "../components/Testimonial";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MobileBrandNav from "../components/MobileBrandNav";
import { useAuth } from "../hooks/useAuth";


const BecomeSeller = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }
  
  const sellingSteps = [
    {
      id: 1,
      title: 'Register',
      image: '/images/register.png',
      bgColor: 'bg-[#FFEBF0]',
      description: 'Find all the onboarding requirements to create your account here.',
      boldText: 'onboarding requirements'
    },
    {
      id: 2,
      title: 'Sell',
      image: '/images/sell.png',
      bgColor: 'bg-[#fff6e5]',
      description: 'Learn all about fulfilment models, platform integration & prerequisites for operational readiness here.',
      boldText: ['fulfilment models', 'prerequisites']
    },
    {
      id: 3,
      title: 'Earn',
      image: '/images/earn.png',
      bgColor: 'bg-[#e5f6f2]',
      description: 'Get secure & timely payments on predefined days. Find out about the payment cycle.',
      boldText: 'secure & timely'
    },
    {
      id: 4,
      title: 'Grow',
      image: '/images/grow.png',
      bgColor: 'bg-[#ffeee8]',
      description: 'Get tailored support at every step to steer your business.',
      boldText: 'tailored support'
    }
  ];

  const formatDescription = (description, boldText) => {
    if (Array.isArray(boldText)) {
      let formatted = description;
      boldText.forEach(text => {
        formatted = formatted.replace(
          text, 
          `<span class="font-bold">${text}</span>`
        );
      });
      return formatted;
    }
    return description.replace(
      boldText, 
      `<span class="font-bold">${boldText}</span>`
    );
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-col bg-white w-full px-3 sm:px-8 md:px-10 xl:px-12 h-full'>
      <div className='flex items-center justify-between p-4 bg-[#fff] ml-2 rounded-lg mb-3 md:gap-4 lg:gap-16 md:px-6 shadow-2xl'>
        <Link to="/" className="h-full w-[20%]">
          <img 
            src="/images/novus10.png" 
            className='w-20 h-20 rounded-full bg-transparent object-contain' 
            alt="logo"  
          />
        </Link>
        
        <div className="lg:flex items-center justify-between flex-row w-[50%] hidden">
          <div className='relative group'>
            <button 
              onClick={() => scrollToSection('sell-on-novus')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer"
            >
              sell on Novus
            </button>
            <div className='absolute w-full h-[2px] bg-[#107f89] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'/>
          </div> 
          <div className='relative group'>
            <button 
              onClick={() => scrollToSection('service')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer"
            >
              Services
            </button>
            <div className='absolute w-full h-[2px] bg-[#107f89] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'/>
          </div>
          <div className='relative group'>
            <button 
              onClick={() => scrollToSection('stories')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer"
            >
              success stories
            </button>
            <div className='absolute w-full h-[2px] bg-[#107f89] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'/>
          </div>
        </div>

        <div className='items-center justify-end w-[30%] hidden lg:flex'>
          {currentUser && (
          <Button onClick={handleLogout}  className="w-28 h-full border border-[#26858c] text-[#ffff] rounded-sm flex    flex-row gap-2 bg-[#26858c] hover:bg-lamaWhite hover:text-[#26858c] mx-2">
            Logout
          </Button>
          )}
          
          {(currentUser && !currentUser.isCustomer) ? (
            <Link to={`/${currentUser?.role}/dashboard`} >
              <Button className="w-full h-full border border-[#26858c] text-[#26858c] rounded-sm flex flex-row gap-2 hover:bg-[#26858c] hover:text-white">
                Dashboard
              </Button>
            </Link>
          ) :
          (currentUser && currentUser.isCustomer) ? (
           <Link to= "/create-brand">
              <Button className="w-full h-full border border-[#26858c] text-[#26858c] rounded-sm flex flex-row gap-2 hover:bg-[#26858c] hover:text-white">
                Becomer seller
              </Button>
            </Link>
            ) : (
            <div className="flex items-center justify-center gap-1">
              <Link to="/register">
                <Button className="w-full h-full border border-[#26858c] text-[#ffff] rounded-sm flex flex-row gap-2 bg-[#26858c] hover:bg-lamaWhite hover:text-[#26858c]">
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button className="w-full h-full border border-[#26858c] text-[#26858c] rounded-sm flex flex-row gap-2 hover:bg-[#26858c] hover:text-white">
                  Login
                </Button>
              </Link>
            </div> 
          )}
        </div> 

        <div className="lg:hidden flex justify-end items-center">
          <MobileBrandNav currentUser={currentUser} scrollToSection={scrollToSection} />
        </div>  
      </div>    

      <div id="sell-on-novus" className="h-full -mt-2">
        <CreateBrandBanner />
      </div>

      <div className='flex flex-col mt-10 items-center w-full'>
        <div className='flex flex-col items-center group'>
          <h2 className='text-xl text-slate-900 font-assistant font-bold'>
            Start Selling In 4 Simple Steps
          </h2>
          <div className='w-32 group-hover:w-full bg-[#ff3f6c] h-[2px] transition-all duration-500 ease-in-out'/>
        </div>
        
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-12 w-full gap-y-24 h-full pt-28'>
          {sellingSteps.map((step) => (
            <div 
              key={step.id}
              className={`${step.bgColor} px-3 flex flex-col items-center justify-evenly pt-[42px] relative h-[245px] rounded-md max-w-[250px] mx-auto`}
            >
              <img 
                className="h-32 absolute left-1/2 transform -translate-x-1/2 -top-20 w-32" 
                src={step.image} 
                alt={step.title} 
              />
              
              <div className='flex flex-col items-center gap-5'>
                <div className='text-[20px] font-bold text-slate-900 font-assistant'>
                  {step.title}
                </div>
                
                <div className='text-[14px] font-normal text-slate-700 font-assistant text-center'
                  dangerouslySetInnerHTML={{ 
                    __html: formatDescription(step.description, step.boldText) 
                  }} 
                />
                
                <Link to="/create-brand">
                  <Button 
                    size="xs" 
                    className="text-[#ff3f6c] border border-[#ff3f6c] rounded-sm flex flex-row gap-2 hover:bg-[#ff3f6c] hover:text-white"
                  >
                    <MdOutlineAssignmentReturn />
                    <span className='text-[11px] font-assistant font-medium'>
                      Enroll now
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id='service' className='flex flex-col items-center w-full mt-8'>
        <div className='flex flex-col items-center group mb-12'>
          <h2 className='text-xl text-slate-900 font-assistant font-bold'>
            Why Brands Love Novus
          </h2>
          <div className='w-32 group-hover:w-full bg-[#ff3f6c] h-[2px] transition-all duration-500 ease-in-out'/>
        </div>
        <CompanyDetails />
      </div>

      <div id="stories" className='pb-5 hidden xl:block mb-2 mt-8'>
        <TestimonialSlider number='2' />
      </div>
      <div id="stories" className='pb-5 xl:hidden mb-2 mt-8'>
        <TestimonialSlider number='1' />
      </div>
    </div>
  );
};

export default BecomeSeller;