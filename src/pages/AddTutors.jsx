"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { useState } from "react";
import { LuUpload, LuUserPlus, LuCalendar, LuMapPin, LuBuilding, LuClock, LuDollarSign } from "react-icons/lu";
import { FiLoader } from "react-icons/fi";

const IMAGEBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

export default function AddTutors() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
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

  const uploadImageToImageBB = async (file) => {
    if (!IMAGEBB_API_KEY) {
      toast.error("ImgBB API Key is missing in environment variables!");
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Appending key to URL or body
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setImagePreview(imageUrl);
        setValue("photo", imageUrl); 
        clearErrors("photo"); // Remove validation error if any
        toast.success("Image uploaded successfully!");
        return imageUrl;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImageBB
    await uploadImageToImageBB(file);
  };

  const onSubmit = async (data) => {
    if (!data.photo) {
      toast.error("Please upload a profile photo");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: tokenData } = await authClient.token();

      const formattedData = {
        ...data,
        availableSlots: `${data.availableDays} ${data.availableTime}`,
        hourlyFee: Number(data.hourlyFee),
        totalSlot: Number(data.totalSlot),
      };

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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section - Modern Deep Blue Minimalist Style */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary 600 flex items-center justify-center shadow-md shadow-primary 200">
            <LuUserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Add New Tutor
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Fill in the details to register a new tutor to your program.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            
            {/* Tutor Name & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tutor Name */}
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuUserPlus className="w-3.5 h-3.5 text-primary 500" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter tutor's full name"
                  {...register("name", { required: "Name is required" })}
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Photo Upload */}
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuUpload className="w-3.5 h-3.5 text-primary 500" />
                    Profile Photo
                  </span>
                </label>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                  <div className="avatar">
                    <div className={`w-14 h-14 rounded-full ring-2 ${imagePreview ? "ring-primary 500/30" : "ring-slate-200"} flex items-center justify-center bg-slate-100 overflow-hidden`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <LuUpload className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="file-input file-input-bordered w-full file-input-sm bg-white border-slate-200 rounded-lg text-slate-600 file:bg-slate-100 file:text-slate-700 file:border-0"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                          <FiLoader className="w-5 h-5 animate-spin text-primary 600" />
                        </div>
                      )}
                    </div>
                    <input type="hidden" {...register("photo", { required: "Photo is required" })} />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Max: 5MB • JPEG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>
                {errors.photo && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.photo.message}
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500">
                  Subject / Category
                </span>
              </label>
              <select
                {...register("subject", { required: "Select a subject" })}
                className={`select select-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.subject ? "border-red-500" : ""}`}
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
                <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {errors.subject.message}
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuCalendar className="w-3.5 h-3.5 text-primary 500" />
                    Available Days
                  </span>
                </label>
                <select
                  {...register("availableDays", { required: "Select available days" })}
                  className={`select select-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.availableDays ? "border-red-500" : ""}`}
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
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.availableDays.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuClock className="w-3.5 h-3.5 text-primary 500" />
                    Available Time
                  </span>
                </label>
                <select
                  {...register("availableTime", { required: "Select available time" })}
                  className={`select select-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.availableTime ? "border-red-500" : ""}`}
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
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.availableTime.message}
                  </span>
                )}
              </div>
            </div>

            {/* Fee & Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuDollarSign className="w-3.5 h-3.5 text-primary 500" />
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
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.hourlyFee ? "border-red-500" : ""}`}
                />
                {errors.hourlyFee && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.hourlyFee.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500">
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
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.totalSlot ? "border-red-500" : ""}`}
                />
                {errors.totalSlot && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.totalSlot.message}
                  </span>
                )}
              </div>
            </div>

            {/* Session Start Date & Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuCalendar className="w-3.5 h-3.5 text-primary 500" />
                    Session Start Date
                  </span>
                </label>
                <input
                  type="date"
                  {...register("sessionStartDate", { required: "Start date is required" })}
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.sessionStartDate ? "border-red-500" : ""}`}
                />
                {errors.sessionStartDate && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.sessionStartDate.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <LuBuilding className="w-3.5 h-3.5 text-primary 500" />
                    Institution
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of Dhaka"
                  {...register("institution", { required: "Institution is required" })}
                  className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.institution ? "border-red-500" : ""}`}
                />
                {errors.institution && (
                  <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {errors.institution.message}
                  </span>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500">
                  Experience
                </span>
              </label>
              <select
                {...register("experience", { required: "Experience level is required" })}
                className={`select select-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.experience ? "border-red-500" : ""}`}
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
                <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {errors.experience.message}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <LuMapPin className="w-3.5 h-3.5 text-primary 500" />
                  Location (Area/City)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                {...register("location", { required: "Location is required" })}
                className={`input input-bordered w-full bg-slate-50 focus:bg-white border-slate-200 focus:border-primary 500 focus:ring-1 focus:ring-primary 500 rounded-xl transition-all ${errors.location ? "border-red-500" : ""}`}
                />
              {errors.location && (
                <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {errors.location.message}
                </span>
              )}
            </div>

            {/* Teaching Mode */}
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text font-medium text-xs uppercase tracking-wider text-slate-500">
                  Teaching Mode
                </span>
              </label>
              <div className="flex gap-6 pt-1">
                {["Online", "Offline", "Both"].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      value={mode}
                      {...register("teachingMode", { required: "Select teaching mode" })}
                      className="radio border-slate-300 checked:border-primary 600 radio-sm"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>
              {errors.teachingMode && (
                <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-full w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {errors.teachingMode.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                className="btn border-0 bg-primary 600 hover:bg-primary 700 text-white w-full rounded-xl shadow-md shadow-primary 100 font-medium transition-all duration-200 normal-case"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-white"></span>
                    <span className="text-white">{isUploading ? "Uploading Image..." : "Adding Tutor..."}</span>
                  </>
                ) : (
                  <>
                    <LuUserPlus className="w-4 h-4 text-white" />
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