import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import  { useEffect, useState } from 'react';
import InputField from '../ui/InputField';
import { useToast } from "../../redux/useToast";
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/Button';
import z from 'zod';



export const eventschema = z.object({
  title: z
    .string()
    .min(4, { message: "title must be at least 4 characters long!" })
    .max(30, { message: "Username must be at most 20 characters long!" }),
  desc: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long!" })
    .max(120, { message: "Description must be at most 60 characters long!" }),
  startingDate : z.string({message : "Starting Date is required!"}),
  startingTime : z.string({message : "Starting time is required!"}),
  endingDate : z.string({message : "Ending date is required!"}),
  endingTime : z.string({message : "Ending time is required!"})
});



const EventForm = ({
  data,
  type,
  setOpen,
  onSuccess
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = {
    startingDate: new Date().toISOString().split('T')[0],
    endingDate: new Date().toISOString().split('T')[0],
    startingTime: '09:00',
    endingTime: '17:00',
    ...(data || {})
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(eventschema),
    defaultValues
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        startingDate: data.startingDate.split('T')[0],
        endingDate: data.endingDate.split('T')[0]
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await onSuccess(formData);
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
        {type === "create" ? "Create New" : "Edit"} Event
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Event title"
          name="title"
          type="text"
          register={register}
          error={errors.title}
          className="md:col-span-2"
        />

        <InputField
          label="Starting Date"
          name="startingDate"
          type="date"
          register={register}
          error={errors.startingDate}
        />

        <InputField
          label="Starting Time"
          name="startingTime"
          type="time"
          register={register}
          error={errors.startingTime}
        />

        <InputField
          label="Ending Date"
          name="endingDate"
          type="date"
          register={register}
          error={errors.endingDate}
        />

        <InputField
          label="Ending Time"
          name="endingTime"
          type="time"
          register={register}
          error={errors.endingTime}
        />
      </div>

      <Textarea
        label="Description *"
        name="desc"
        register={register}
        error={errors?.desc}
        rows={4}
        placeholder="Enter event description..."
        className="ring-gray-500 ring-[1.2px]"
      />

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
          {submitting ? "Processing..." : type === "create" ? "Create Event" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
export default EventForm;