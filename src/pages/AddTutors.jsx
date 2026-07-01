"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { useState } from "react";
import { LuUpload, LuUserPlus, LuCalendar, LuMapPin, LuBuilding, LuClock, LuDollarSign } from "react-icons/lu";

export default function AddTutors() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      photo: "",
      subject: "",
      availableDays: "",
      availableTime: "",
      hourlyFee: "",
      totalSlot: "",
      sessionStartDate: "",
      institution: "",
      experience: "",
      location: "",
      teachingMode: "Online",
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // You can set the photo URL to the base64 or handle upload to server
        // For now, we'll store the base64 in the form
        document.querySelector('input[name="photo"]').value = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { data: tokenData } = await authClient.token();

      // Combine days and time
      const formattedData = {
        ...data,
        availableSlots: `${data.availableDays} ${data.availableTime}`,
        hourlyFee: Number(data.hourlyFee),
        totalSlot: Number(data.totalSlot),
      };

      // Remove the individual fields
      delete formattedData.availableDays;
      delete formattedData.availableTime;

      const response = await fetch(process.env.NEXT_PUBLIC_URL + "/api/tutors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        toast.success("Tutor added successfully! 🎉");
        reset();
        setImagePreview(null);
        router.push("/my-tutors");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add tutor.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for image upload field changes
  const watchPhoto = watch("photo");

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200/40 via-base-100 to-base-200/20 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <LuUserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Add New Tutor
            </h1>
            <p className="text-base-content/60 text-sm mt-1">
              Fill in the details to register a new tutor
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Tutor Name & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tutor Name */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuUserPlus className="w-3.5 h-3.5" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter tutor's full name"
                  {...register("name", { required: "Name is required" })}
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.name ? "input-error" : ""}`}
                />
                {errors.name && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Photo Upload */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuUpload className="w-3.5 h-3.5" />
                    Profile Photo
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className={`w-16 h-16 rounded-full ring-2 ${imagePreview ? "ring-primary/40" : "ring-base-300"} flex items-center justify-center bg-base-200`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="object-cover rounded-full" />
                      ) : (
                        <LuUpload className="w-6 h-6 text-base-content/30" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input file-input-bordered w-full file-input-sm focus:file-input-primary transition-all"
                    />
                    <input
                      type="hidden"
                      {...register("photo", { required: "Photo is required" })}
                    />
                  </div>
                </div>
                {errors.photo && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.photo.message}
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                  Subject / Category
                </span>
              </label>
              <select
                {...register("subject", { required: "Select a subject" })}
                className={`select select-bordered w-full focus:select-primary transition-all ${errors.subject ? "select-error" : ""}`}
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Economics">Economics</option>
                <option value="Accounting">Accounting</option>
                <option value="Business Studies">Business Studies</option>
              </select>
              {errors.subject && (
                <span className="text-error text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                  {errors.subject.message}
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuCalendar className="w-3.5 h-3.5" />
                    Available Days
                  </span>
                </label>
                <select
                  {...register("availableDays", { required: "Select available days" })}
                  className={`select select-bordered w-full focus:select-primary transition-all ${errors.availableDays ? "select-error" : ""}`}
                >
                  <option value="">Select Days</option>
                  <option value="Mon-Fri">Monday - Friday</option>
                  <option value="Sat-Wed">Saturday - Wednesday</option>
                  <option value="Sun-Thu">Sunday - Thursday</option>
                  <option value="Weekend">Weekend (Sat-Sun)</option>
                  <option value="Daily">Daily</option>
                  <option value="Custom">Custom Schedule</option>
                </select>
                {errors.availableDays && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.availableDays.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuClock className="w-3.5 h-3.5" />
                    Available Time
                  </span>
                </label>
                <select
                  {...register("availableTime", { required: "Select available time" })}
                  className={`select select-bordered w-full focus:select-primary transition-all ${errors.availableTime ? "select-error" : ""}`}
                >
                  <option value="">Select Time</option>
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                  <option value="8:00 PM - 10:00 PM">8:00 PM - 10:00 PM</option>
                  <option value="Flexible">Flexible</option>
                </select>
                {errors.availableTime && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.availableTime.message}
                  </span>
                )}
              </div>
            </div>

            {/* Fee & Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuDollarSign className="w-3.5 h-3.5" />
                    Hourly Fee (৳)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  {...register("hourlyFee", {
                    required: "Fee is required",
                    min: { value: 0, message: "Fee must be positive" },
                  })}
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.hourlyFee ? "input-error" : ""}`}
                />
                {errors.hourlyFee && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.hourlyFee.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                    Total Slots Available
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  {...register("totalSlot", {
                    required: "Slot count is required",
                    min: { value: 1, message: "Must have at least 1 slot" },
                  })}
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.totalSlot ? "input-error" : ""}`}
                />
                {errors.totalSlot && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.totalSlot.message}
                  </span>
                )}
              </div>
            </div>

            {/* Session Start Date & Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuCalendar className="w-3.5 h-3.5" />
                    Session Start Date
                  </span>
                </label>
                <input
                  type="date"
                  {...register("sessionStartDate", {
                    required: "Start date is required",
                  })}
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.sessionStartDate ? "input-error" : ""}`}
                />
                {errors.sessionStartDate && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.sessionStartDate.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                    <LuBuilding className="w-3.5 h-3.5" />
                    Institution
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of Dhaka"
                  {...register("institution", {
                    required: "Institution is required",
                  })}
                  className={`input input-bordered w-full focus:input-primary transition-all ${errors.institution ? "input-error" : ""}`}
                />
                {errors.institution && (
                  <span className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                    {errors.institution.message}
                  </span>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                  Experience
                </span>
              </label>
              <select
                {...register("experience", {
                  required: "Experience level is required",
                })}
                className={`select select-bordered w-full focus:select-primary transition-all ${errors.experience ? "select-error" : ""}`}
              >
                <option value="">Select Experience Level</option>
                <option value="0-1 years">0-1 years (Fresher)</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2-3 years">2-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years (Expert)</option>
              </select>
              {errors.experience && (
                <span className="text-error text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                  {errors.experience.message}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                  <LuMapPin className="w-3.5 h-3.5" />
                  Location (Area/City)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                {...register("location", { required: "Location is required" })}
                className={`input input-bordered w-full focus:input-primary transition-all ${errors.location ? "input-error" : ""}`}
              />
              {errors.location && (
                <span className="text-error text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                  {errors.location.message}
                </span>
              )}
            </div>

            {/* Teaching Mode - Radio */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">
                  Teaching Mode
                </span>
              </label>
              <div className="flex gap-6 pt-1">
                {["Online", "Offline", "Both"].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      value={mode}
                      {...register("teachingMode", {
                        required: "Select teaching mode",
                      })}
                      className="radio radio-primary radio-sm checked:ring-2 checked:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>
              {errors.teachingMode && (
                <span className="text-error text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-error"></span>
                  {errors.teachingMode.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-base-200">
              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding Tutor...
                  </>
                ) : (
                  <>
                    <LuUserPlus className="w-4 h-4" />
                    Add Tutor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}