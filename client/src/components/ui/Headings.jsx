
const Heading = ({ 
  title,  
  listings ,
  center,
  loading
}) => {
  return ( 
    <div className={center ? 'text-center' : 'text-start px-1 md:px-3'}>
      {loading ? (
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      ): listings.length > 0 ?
    (
      <div className="sm:text-2xl text-xl font-helvetica text-black font-extrabold capitalize">
        {title}
      </div>
        ) : null}
    </div>
   );
}
 
export default Heading;