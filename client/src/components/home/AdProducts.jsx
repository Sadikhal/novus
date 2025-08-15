import Buttons from '../ui/Buttons';

const AdProducts = ({img}) => {
  return (
    <div className='bg-transparent lg:aspect-50/40 2xl:aspect-50/41 aspect-video z-100'>
      <div className="relative h-full  w-full bg-cover bg-center z-100 " style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${img}) `,borderRadius: '10px'}}>
      <div className="absolute inset-0  bg-black bg-opacity-50 flex  left-28 top-28 flex-col gap-5">
        <h1 className="text-white text-4xl font-assistant font-bold capitalize  ">Top selling smart Phones</h1>
        <div className='text-white text-2xl font-assistant font-normal  capitalize'>
         Latest Technology , Best Brands
        </div>
      </div>
      <div className='absolute bottom-36 left-28'>
        <Buttons className='btn text-slate-900 bg-white capitalize font-assistant font-bold text-[22px] '/>
      </div>
    </div>
    </div>
  )
}

export default AdProducts