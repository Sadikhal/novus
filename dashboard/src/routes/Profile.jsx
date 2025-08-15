import  { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { apiRequest } from '../lib/apiRequest'
import { updateUser } from "../redux/userSlice"
import ImageCropModal from '../components/ImageCropper'
import { cn } from '../lib/utils'
import { AiFillEdit } from "react-icons/ai";
import { Button } from '../components/ui/Button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { ChevronDown } from 'lucide-react'
import { toast } from '../redux/useToast'
import { format, parseISO } from 'date-fns'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(currentUser?.image || '')
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    dateOfBirth: '',
    defaultAddress: '',
  })
  const [age, setAge] = useState(0)

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        number: currentUser.number || '',
        dateOfBirth: currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
        defaultAddress: currentUser.defaultAddress || '',
      })
      setUploadedImage(currentUser.image || '')
      
      if (currentUser.dateOfBirth) {
        const birthDate = new Date(currentUser.dateOfBirth)
        const today = new Date()
        let calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }
        setAge(calculatedAge)
      }
    }
  }, [currentUser])

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setFormData({ ...formData, dateOfBirth: newDate })
    
    if (newDate) {
      const birthDate = new Date(newDate)
      const today = new Date()
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
      }
      setAge(calculatedAge)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUploadComplete = (url) => {
    setUploadedImage(url)
    setShowCropModal(false)
    setSelectedImage(null)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setShowCropModal(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await apiRequest.put(
        `/users/update/${currentUser._id}`,
        {
          ...formData,
          image: uploadedImage,
          age: undefined 
        }
      )
      dispatch(updateUser(res.data))
      toast({
        variant : "primary",
        title : 'Profile updated successfully!'})
      setIsEditing(false)
    } catch (error) {
      console.log(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const userAddress = currentUser?.addresses?.find(a => a._id === formData?.defaultAddress)

  return (
    <div className='flex items-center justify-center w-full flex-col relative bg-lamaWhite'>
      {/* Background Container - Full width */}
      <div 
        className='w-full bg-center bg-cover bg-no-repeat relative' 
        style={{ 
          backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1)), url('/images/gr9.jpg')",
          height: '470px',
        }}
      >
        <div className="text-center text-[20px] font-bold font-robotos uppercase leading-[30px] tracking-widest items-center justify-center flex h-full flex-col mb-10">
          <div className='items-center text-[20px] sm:text-[23px] md:text-[28px]  font-assistant uppercase tracking-widest font-bold text-[#f1eded] mb-4'>
            hello {currentUser.name}
          </div>

      {currentUser.isAdmin ? 
      (
        <div className='items-center lg:text-[35px] md:text-[30px] sm:text-[25px] text-[20px] font-robotos uppercase  font-bold justify-center text-[#fff] mb-4 w-[90%] md:w-[70%] md:leading-8 lg:0 '>
               Simple solutions, strong success—Novus shines.
         </div>
        ):
              <div className='items-center lg:text-[60px] md:text-[52px] sm:text-[42px] text-[40px] font-robotos uppercase leading-[40px] font-bold justify-center text-[#fff] mb-4'>
                Let's Grow up Together" 
              </div>
      }
        </div>
      </div>

      {/* Profile Card Container */}
      <div className='w-full flex items-center justify-center -mt-32 mb-16 px-4 relative z-10'>
        <div className='w-full max-w-3xl'>
          <form onSubmit={handleSubmit} className='flex py-5 pb-16 w-full flex-1 items-center p-5 shadow-xl shadow-slate-500/50 bg-white rounded-md group transition ease-in-out delay-0 duration-500 flex-col relative'>
            <div className='w-full flex justify-end mb-4'>
              {isEditing ? (
                <div className='flex gap-2 font-poppins'>
                  <Button type='button' onClick={() => setIsEditing(false)} className='btn bg-[#5c3e3e] border-none btn-sm text-lamaWhite hover:bg-[#321d1d]'>
                    Cancel
                  </Button>
                  <Button type='submit' className='btn bg-teal-800 hover:bg-teal-900 text-lamaWhite btn-sm border-none'>
                    Save
                  </Button>
                </div>
              ) : (
                <Button type='button' onClick={() => setIsEditing(true)} className='btn text-lamaWhite font-poppins hover:bg-[#0e5069]/80 glass border-none  h-9 bg-[#0e5069] btn-sm'>
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Image */}
            <div className='w-full flex items-center justify-center py-12'>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="relative group">
                <img 
                  src={currentUser.image || "/images/avatar.png"} 
                  className='md:h-36 md:w-36 h-32 w-32 object-cover rounded-full cursor-pointer'
                  alt="profile"
                  onClick={() => isEditing && fileInputRef.current.click()}
                />
                {isEditing && (
                  <>
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className="text-white font- text-xs text-nowrap">Change Photo</span>
                     <AiFillEdit className=' h-6 w-4 text-lamaWhite'/>
                  </div>
                
                 </>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            <div className='w-full space-y-7'>
              <ProfileField 
                label="Name"
                name="name"
                value={formData.name}
                editing={isEditing}
                onChange={handleInputChange}
              />
              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                seller ID
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  <div className='capitalize w-full border p-2 border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline'>
                    {currentUser._id}
                  </div>
                </div>
              </div>
              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                email
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  <div className='capitalize w-full border p-2 border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline'>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <ProfileField 
                label="Phone Number"
                name="number"
                value={formData.number}
                editing={isEditing}
                onChange={handleInputChange}
                type="tel"
              />

              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                  Date of Birth
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      className='p-2 capitalize w-full border border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline'
                    />
                  ) : (
                    <div className={cn('p-2 capitalize w-full border border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline ',!formData.dateOfBirth && 'italic')}>
                      {formData.dateOfBirth || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                  Age
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  <div className={cn('p-2 capitalize w-full border border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline ',!age && 'italic')}>
                    {age || 'Calculate from birth date'}
                  </div>
                </div>
              </div>
           
              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                role
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  <div className='capitalize w-full border p-2 border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline'>
                    {currentUser.role || 'Not set'}
                  </div>
                </div>
              </div>

              <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                 Joined At
                  <span>: </span>
                </label>
                <div className='flex-1'>
                  <div className='capitalize w-full border p-2 border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline'>
                    {format(parseISO(currentUser.createdAt),'MM/dd/yy')}
                  </div>
                </div>
              </div>

              {currentUser?.addresses?.length > 0 && (
                <div className='md:flex-row flex-col md:gap-3 flex gap-1 md:items-center text-slate-600 w-full'>
                  <label className='md:flex-[0.9] gap-2 md:gap-0 flex  md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
                    Default Address
                    <span>: </span>
                  </label>
                  <div className='flex-1'>
                    {isEditing ? (
                      <Select 
                        value={formData.defaultAddress}
                        onValueChange={(value) => setFormData({...formData, defaultAddress: value})}
                      >
                        <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-full flex flex-row font-poppins text-slate-800 font-medium justify-between items-center capitalize">
                          <SelectValue placeholder="Default Address" />
                          <ChevronDown className="h-6 w-6" />
                        </SelectTrigger>
                        <SelectContent className="bg-lamaWhite">
                          <SelectGroup className='w-full'>
                            {currentUser.addresses.map(address => (
                              <SelectItem className="font-poppins text-slate-800 text-wrap flex-wrap" key={address._id} value={address._id}>
                                {address.name} - {address.address1},
                                {address.address2} - {address.pincode}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className={cn(
                        'p-2 capitalize w-full border border-gray-100 text-sm h-auto text-slate-900', 
                        'placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200',
                        'font-poppins font-medium shadow-sm rounded-sm btn-outline text-left',
                        !formData.defaultAddress && 'italic'
                      )}>
                        {formData.defaultAddress ? (
                          userAddress ? 
                            `${userAddress.name}, ${userAddress.address1}, 
                            ${userAddress.address2 ? userAddress.address2 + ', ' : ''}
                            ${userAddress.state}, ${userAddress.pincode}-${userAddress.city + ',  '} ${userAddress.number} `
                            : 'Address not found'
                        ) : 'No default address'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
        <ImageCropModal
    isOpen={showCropModal}
    onClose={() => setShowCropModal(false)}
    onUploadComplete={handleImageUploadComplete}
    file={selectedImage}
    queue={selectedImage ? [selectedImage] : []} 
  />
    </div>
  )
}

const ProfileField = ({ label, name, value, editing, onChange, type = 'text' }) => (
  <div className='flex md:flex-row flex-col md:gap-3 gap-1 md:items-center text-slate-600 w-full'>
    <label className='md:flex-[0.9] gap-2 md:gap-0  flex md:justify-between items-center capitalize font-poppins md:text-md text-sm font-medium text-slate-800'>
      {label}
      <span>: </span>
    </label>
    <div className='flex-1'>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className='p-2 capitalize w-full border border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm text-center'
        />
      ) : (
        <div className={cn('p-2 capitalize w-full border border-gray-100 text-sm text-slate-900 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm btn-outline ',!value && 'italic')}>
          {value || `No ${label.toLowerCase()}`}
        </div>
      )}
    </div>
  </div>
)

export default Profile