import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useToast } from "../../redux/useToast";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/Button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";

const orderSchema = z.object({
  customerName: z
    .string()
    .min(3, { message: "Customer name must be at least 3 characters long!" })
    .max(30, { message: "Customer name must be at most 30 characters long!" }),
  number: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number (10 digits required)'),
  status: z.enum(["processing", "shipped", "delivered"], {
    message: "Status is required!"
  }),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pin code (must be 6 digits)'),
  address: z.string().min(1, { message: "Address is required!" }),
});

const OrderForm = ({
  data,
  type,
  setOpen,
  onSuccess
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = {
    customerName: "",
    number: "",
    status: "processing",
    pincode: "",
    address: "",
    ...(data || {})
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await onSuccess(formData);
      toast({
        variant: "success",
        title: "Order updated successfully",
        description: "Your changes have been saved"
      });
      setOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Operation failed",
        description: err.message || "Please try again later"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-6 p-2 sm:p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold border-b-[#384e60] border-b-2 pb-2">
        {type === "create" ? "Create New" : "Edit"} Order
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Customer Name"
          name="customerName"
          type="text"
          register={register}
          error={errors.customerName}
        />

        <InputField
          label="Phone Number"
          name="number"
          type="number"
          register={register}
          error={errors.number}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Order Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border-gray-200 rounded-lg px-2 py-3 text-sm bg-white shadow-sm items-center capitalize text-nowrap flex flex-row justify-between font-medium focus:ring-[#424848]">
                  <SelectValue placeholder="Order Status" />
                  <ChevronDown className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem className="cursor-pointer hover:bg-[#44655c] py-2 hover:text-white" value="processing">
                      Processing
                    </SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-[#44655c] py-2 hover:text-white" value="shipped">
                      Shipped
                    </SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-[#44655c] py-2 hover:text-white" value="delivered">
                      Delivered
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm font-medium text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>

        <InputField
          label="Pincode"
          name="pincode"
          type="number"
          register={register}
          error={errors.pincode}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Address"
            name="address"
            register={register}
            error={errors?.address}
            rows={4}
            placeholder="Enter delivery address..."
            className="ring-gray-500 ring-[1.2px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
        >
          {submitting ? "Processing..." : type === "create" ? "Create Order" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;