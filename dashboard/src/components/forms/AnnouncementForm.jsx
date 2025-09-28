
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from 'react';
import InputField from '../ui/InputField';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/Button';
import { useToast } from "../../redux/useToast";
import z from 'zod';


 const announcementSchema =  z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long!" })
    .max(30, { message: "Title must be at most 20 characters long!" }),
  desc: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long!" })
    .max(120, { message: "Description must be at most 60 characters long!" }),
});

const AnnouncementForm = ({ 
  data, 
  type, 
  setOpen,
  onSuccess 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: data || {}
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
      className="flex flex-col gap-6 p-4" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold border-b-[#384e60] border-b-2 pb-2">
        {type === "create" ? "Create New" : "Edit"} Announcement
      </h1>
      
      <div className="flex flex-col gap-6">
        <InputField
          label="Title"
          name="title"
          type="text"
          register={register}
          error={errors.title}
          className="w-full"
        />
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Description</label>
          <Textarea
            name="desc"
            register={register}
            error={errors?.desc}
            rows={4}
            placeholder="Enter announcement description..."
            className="ring-gray-500 ring-[1.2px] w-full"
          />
          {errors?.desc?.message && (
            <p className="text-xs text-red-400">{errors.desc.message.toString()}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          onClick={() => setOpen(false)}
          disabled={submitting}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
           variant="primary"
          disabled={submitting}
        >
          {submitting ? "Processing..." : type === "create" ? "Create" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
