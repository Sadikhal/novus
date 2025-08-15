
const Heading = ({ 
  title,  
  listings ,
  center,
  loading
}) => {
  return ( 
    <div className={center ? 'text-center' : 'text-start px-3 lg:px-5'}>
      {loading ? (
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      ): listings.length > 0 ?
    (
    
      <div className="text-2xl font-helvetica text-black font-extrabold capitalize">
        {title}
      </div>
        ) : null}
    </div>
   );
}
 
export default Heading;