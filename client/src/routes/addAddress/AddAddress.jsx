import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../lib/apiRequest';
import { updateUser } from '../../redux/userSlice';
import { toast } from '../../redux/useToast';
import { Loader } from '../../components/ui/Loaders';
import { Button } from '../../components/ui/Button';

const AddAddress = () => {
    const { addressId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tempOrder } = useSelector((state) => state.cart);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!addressId) return;
            setIsLoading(true);
            try {
                const res = await apiRequest.get("/users/profile");
                const address = res.data?.addresses?.find(addr => addr._id === addressId);
                
                if (address) {
                    reset(address);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Address Not Found",
                        description: "The requested address could not be found"
                    });
                    navigate("/dashboard/address/new");
                }
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Failed to Load Address",
                    description: err.response?.data?.message || "Could not fetch address details"
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAddress();
    }, [addressId, reset, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const url = addressId 
                ? `/users/address/${addressId}`
                : '/users/address';
            
            const method = addressId ? 'put' : 'post';
            const res = await apiRequest[method](url, data);
            
            dispatch(updateUser(res.data));
            
            toast({
                variant: "tertiary",
                title: `Address ${addressId ? 'Updated' : 'Added'}`,
                description: `Your address has been ${addressId ? 'updated' : 'added'} successfully`
            });
            
            const checkoutPath = tempOrder ? `/dashboard/checkout/${tempOrder.id}` : "/dashboard/checkout";
            navigate(checkoutPath);
        } catch (err) {
            toast({
                variant: "destructive",
                title: `Address ${addressId ? 'Update' : 'Add'} Failed`,
                description: err.response?.data?.message || "An unexpected error occurred"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex items-center justify-center pt-8 h-full w-full bg-[#809691]'>
            {isLoading ? (
                <div className='w-full sm:h-[60vh] h-[50vh] justify-center items-center flex'>
                    <Loader/>
                </div>
            ) : (
                <div 
                    style={{ animation: 'slideInFromLeft 1s ease-out' }} 
                    className="max-w-2xl w-full bg-white rounded-lg shadow-md overflow-hidden p-8 space-y-8 md:px-12 lg:px-16 lg:min-w-[500px] border border-borderSlate z-50 mb-12 font-poppins mx-2"
                >
                    <div className='flex flex-col gap-1 items-center justify-center group'>
                        <h5
                            style={{ animation: 'appear 2s ease-out' }}
                            className="text-center text-2xl font-bold text-[#268098] capitalize font-robotos"
                        >
                            {addressId ? 'Edit Address' : 'Add New Address'}
                        </h5>
                        <div className='w-24 group-hover:w-52 bg-[#b1b1ad] h-[2px] transition-all duration-500 ease-in-out'/>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-12 h-full">
                        <div className="relative">
                            <input
                                {...register('name', { 
                                    required: 'Full name is required',
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 correcteds"
                                    }
                                })}
                                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                id="name"
                                disabled={isSubmitting}
                            />
                            <label
                                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                htmlFor="name"
                            >
                                Full Name
                            </label>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                {...register('number', { 
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Invalid mobile number"
                                    }
                                })}
                                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                id="number"
                                disabled={isSubmitting}
                            />
                            <label
                                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                htmlFor="number"
                            >
                                Mobile Number
                            </label>
                            {errors.number && (
                                <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    {...register('state', { required: 'State is required' })}
                                    className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                    id="state"
                                    disabled={isSubmitting}
                                />
                                <label
                                    className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                    htmlFor="state"
                                >
                                    State
                                </label>
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    {...register('city', { required: 'City is required' })}
                                    className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                    id="city"
                                    disabled={isSubmitting}
                                />
                                <label
                                    className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                    htmlFor="city"
                                >
                                    City
                                </label>
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                {...register('pincode', { 
                                    required: 'Pincode is required',
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: 'Invalid pin code'
                                    }
                                })}
                                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                id="pincode"
                                disabled={isSubmitting}
                            />
                            <label
                                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                htmlFor="pincode"
                            >
                                Pincode
                            </label>
                            {errors.pincode && (
                                <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                {...register('address1', { required: 'Address is required' })}
                                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                id="address1"
                                disabled={isSubmitting}
                            />
                            <label
                                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                htmlFor="address1"
                            >
                                Address Line 1
                            </label>
                            {errors.address1 && (
                                <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                {...register('address2', { required: 'Area/Street is required' })}
                                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-poppins font-medium shadow-sm rounded-sm"
                                id="address2"
                                disabled={isSubmitting}
                            />
                            <label
                                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm text-xs bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                                htmlFor="address2"
                            >
                                Area, Road Name or Street
                            </label>
                            {errors.address2 && (
                                <p className="text-red-500 text-sm mt-1">{errors.address2.message}</p>
                            )}
                        </div>

                        <Button 
                            loading={isSubmitting}
                            type="submit"
                            className="w-full h-12 px-4 rounded-md shadow-lg text-white font-semibold bg-cyan-700 hover:bg-cyan-800 transition duration-200"
                        >
                            {addressId ? 'Update Address' : 'Save Address'}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddAddress;