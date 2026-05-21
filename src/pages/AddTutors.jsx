"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export default function AddTutors() {
    const router=useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: tokenData } = await authClient.token();

      const response = await fetch(process.env.NEXT_PUBLIC_URL+"/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({
          ...data,
          hourlyFee: Number(data.hourlyFee),
          totalSlot: Number(data.totalSlot),
        }),
      });

      if (response.ok) {
        toast.success("Tutor added successfully!");
        router.push("/my-tutors")
        reset();
      } else {
        toast.error("Failed to add tutor.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="bg-base-100 p-8 rounded-xl shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-center mb-8">Add New Tutor</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Tutor Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Tutor Name</span>
            </label>
            <input
              type="text"
              placeholder="Saima Akter"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <span className="text-error text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Photo URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Photo URL</span>
            </label>
            <input
              type="url"
              placeholder="imgbb / postimage link"
              {...register("photo", { required: "Photo URL is required" })}
              className="input input-bordered w-full"
            />
            {errors.photo && (
              <span className="text-error text-xs mt-1">
                {errors.photo.message}
              </span>
            )}
          </div>

          {/* Subject / Category Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Subject / Category
              </span>
            </label>
            <select
              defaultValue=""
              {...register("subject", { required: "Select a subject" })}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select Subject
              </option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="ICT">ICT</option>
            </select>
            {errors.subject && (
              <span className="text-error text-xs mt-1">
                {errors.subject.message}
              </span>
            )}
          </div>

          {/* Available Days and Time */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Available Days and Time
              </span>
            </label>
            <input
              type="text"
              placeholder="Sun - Thu 5:00 PM - 8:00 PM"
              {...register("availableSlots", {
                required: "Available schedule is required",
              })}
              className="input input-bordered w-full"
            />
            {errors.availableSlots && (
              <span className="text-error text-xs mt-1">
                {errors.availableSlots.message}
              </span>
            )}
          </div>

          {/* Grid Layout for Fee and Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hourly Fee */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Hourly Fee</span>
              </label>
              <input
                type="number"
                placeholder="500"
                {...register("hourlyFee", {
                  required: "Fee is required",
                  min: 0,
                })}
                className="input input-bordered w-full"
              />
              {errors.hourlyFee && (
                <span className="text-error text-xs mt-1">
                  {errors.hourlyFee.message}
                </span>
              )}
            </div>

            {/* Total Slot */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Total Slot</span>
              </label>
              <input
                type="number"
                placeholder="10"
                {...register("totalSlot", {
                  required: "Slot count is required",
                  min: 1,
                })}
                className="input input-bordered w-full"
              />
              {errors.totalSlot && (
                <span className="text-error text-xs mt-1">
                  {errors.totalSlot.message}
                </span>
              )}
            </div>
          </div>

          {/* Session Start Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Session Start Date
              </span>
            </label>
            <input
              type="date"
              {...register("sessionStartDate", {
                required: "Start date is required",
              })}
              className="input input-bordered w-full"
            />
            {errors.sessionStartDate && (
              <span className="text-error text-xs mt-1">
                {errors.sessionStartDate.message}
              </span>
            )}
          </div>

          {/* Institution */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Institution</span>
            </label>
            <input
              type="text"
              placeholder="Dhaka University"
              {...register("institution", {
                required: "Institution is required",
              })}
              className="input input-bordered w-full"
            />
            {errors.institution && (
              <span className="text-error text-xs mt-1">
                {errors.institution.message}
              </span>
            )}
          </div>

          {/* Experience */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Experience</span>
            </label>
            <textarea
              placeholder="3 years teaching experience..."
              {...register("experience", {
                required: "Experience details are required",
              })}
              className="textarea textarea-bordered w-full h-24"
            />
            {errors.experience && (
              <span className="text-error text-xs mt-1">
                {errors.experience.message}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Location (Area/City)
              </span>
            </label>
            <input
              type="text"
              placeholder="Khulna"
              {...register("location", { required: "Location is required" })}
              className="input input-bordered w-full"
            />
            {errors.location && (
              <span className="text-error text-xs mt-1">
                {errors.location.message}
              </span>
            )}
          </div>

          {/* Teaching Mode Dropdown */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Teaching Mode</span>
            </label>
            <select
              defaultValue=""
              {...register("teachingMode", {
                required: "Select teaching mode",
              })}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select Mode
              </option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Both">Both</option>
            </select>
            {errors.teachingMode && (
              <span className="text-error text-xs mt-1">
                {errors.teachingMode.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control pt-4">
            <button type="submit" className="btn btn-primary w-full">
              Submit Tutor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
