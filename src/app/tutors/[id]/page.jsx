"use client";

import { useEffect, useState, use } from "react";
import {
  LuCalendar,
  LuMapPin,
  LuDollarSign,
  LuBookOpen,
  LuGraduationCap,
  LuX,
  LuClock,
  LuUsers,
  LuPhone,
  LuMail,
  LuUser,

  
} from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, useSession } from "../../../lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function TutorDetailsPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const user = session?.user;

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const fetchTutorDetails = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/tutors/${params.id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tutor");
      }

      const data = await res.json();
      setTutor(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load tutor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="relative">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <div className="absolute inset-0 animate-pulse bg-primary/5 rounded-full blur-xl"></div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
          Loading Tutor Details...
        </p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-10 h-10 text-error" />
        </div>
        <h2 className="text-2xl font-bold text-base-content">Tutor not found!</h2>
        <p className="text-base-content/60 mt-2">The tutor you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push("/tutors")}
          className="btn btn-primary mt-6"
        >
          Browse Tutors
        </button>
      </div>
    );
  }

  const bookingExpired = new Date().getTime() >= new Date(tutor.sessionStartDate).getTime();
  const noSlotsLeft = parseInt(tutor.totalSlot) <= 0;
  const isOwner = user?.id === tutor.userId;

  const handleBookingClick = () => {
    if (!user) {
      toast.error("Please log in first to book a session!");
      return;
    }

    if (isOwner) {
      toast.error("You cannot book your own tutor profile!");
      return;
    }

    if (noSlotsLeft) {
      toast.error("No slots available right now!");
      return;
    }

    if (bookingExpired) {
      toast.error("Booking is closed because the session has started!");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^(?:\+88|01)[0-9]{11}$/.test(phone.trim())) {
      toast.error("Please enter a valid Bangladesh phone number");
      return;
    }

    setBookingLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const bookingInfo = {
        tutorId: tutor._id,
        studentName: user?.name || "Anonymous Student",
        studentEmail: user?.email,
        studentPhone: phone.trim(),
      };

      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(bookingInfo),
      });

      const responseData = await res.json();

      if (res.ok) {
        setIsBookingSuccess(true);
        toast.success("Session booked successfully! 🎉");
        setPhone("");
        
        setTimeout(() => {
          setIsModalOpen(false);
          setIsBookingSuccess(false);
          fetchTutorDetails();
          router.push("/my-bookings");
        }, 1500);
      } else {
        toast.error(responseData?.message || "Booking failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-base-200/40 via-base-100 to-base-200/20 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm mb-6 gap-2 hover:bg-base-200/50 transition-all"
        >
          ← Back to Tutors
        </button>

        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Side - Image */}
            <div className="lg:col-span-5 relative bg-gradient-to-br from-base-300 to-base-200 min-h-[300px] lg:min-h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
              {tutor.photo ? (
                <Image
                  fill
                  src={tutor.photo}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <LuUser className="w-16 h-16 text-primary/40" />
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 z-20">
                <span className={`badge ${noSlotsLeft ? 'badge-error' : bookingExpired ? 'badge-warning' : 'badge-success'} gap-2 shadow-lg`}>
                  {noSlotsLeft ? (
                    <>
                      <FiAlertCircle className="w-3 h-3" />
                      No Slots
                    </>
                  ) : bookingExpired ? (
                    <>
                      <LuClock className="w-3 h-3" />
                      Session Started
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-3 h-3" />
                      Available
                    </>
                  )}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="badge badge-primary badge-lg shadow-lg">
                  {tutor.subject}
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:col-span-7 p-8 md:p-10 lg:p-12">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                    {tutor.name}
                  </h1>
                  <p className="text-base-content/60 text-sm flex items-center gap-2">
                    <LuGraduationCap className="w-4 h-4" />
                    {tutor.institution}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/40 hover:bg-base-200/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <LuBookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Experience</p>
                      <p className="text-sm font-medium text-base-content">{tutor.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/40 hover:bg-base-200/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <LuMapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Location</p>
                      <p className="text-sm font-medium text-base-content">
                        {tutor.location} 
                        <span className="text-xs text-base-content/40 ml-1">
                          ({tutor.teachingMode})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/40 hover:bg-base-200/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <LuDollarSign className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Hourly Fee</p>
                      <p className="text-lg font-bold text-success">৳{tutor.hourlyFee} <span className="text-xs font-normal text-base-content/40">/hr</span></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/40 hover:bg-base-200/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                      <LuClock className="w-4 h-4 text-info" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Availability</p>
                      <p className="text-sm font-medium text-base-content">{tutor.availableSlots}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-base-200/30 rounded-xl border border-base-300/30 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-2">
                      <LuUsers className="w-4 h-4" />
                      Available Slots
                    </p>
                    <p className={`text-2xl font-bold ${noSlotsLeft ? 'text-error' : 'text-primary'}`}>
                      {tutor.totalSlot} <span className="text-xs font-normal text-base-content/40">slots left</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-2 justify-end">
                      <LuCalendar className="w-4 h-4" />
                      Session Starts
                    </p>
                    <p className="text-sm font-medium text-base-content">
                      {new Date(tutor.sessionStartDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {bookingExpired && (
                  <div className="alert alert-warning mb-4 shadow-md border border-warning/20">
                    <FiAlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Booking is closed because the session has already started.</span>
                  </div>
                )}

                {noSlotsLeft && !bookingExpired && (
                  <div className="alert alert-error mb-4 shadow-md border border-error/20">
                    <FiAlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">All slots are already booked. Please check back later.</span>
                  </div>
                )}

                {isOwner && (
                  <div className="alert alert-info mb-4 shadow-md border border-info/20">
                    <LuCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">This is your tutor profile. You cannot book your own sessions.</span>
                  </div>
                )}

                <button
                  onClick={handleBookingClick}
                  disabled={bookingExpired || noSlotsLeft || isOwner}
                  className={`btn btn-primary w-full md:w-auto px-10 py-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 ${
                    (bookingExpired || noSlotsLeft || isOwner) ? 'btn-disabled opacity-50' : ''
                  }`}
                >
                  {isOwner ? (
                    "Your Profile"
                  ) : noSlotsLeft ? (
                    "No Slots Available"
                  ) : bookingExpired ? (
                    "Session Started"
                  ) : (
                    <>
                      <LuCalendar className="w-4 h-4" />
                      Book Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-base-100 w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-base-200 animate-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsBookingSuccess(false);
              }}
              className="btn btn-ghost btn-sm btn-square absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>

            {isBookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <LuCheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="font-bold text-xl text-base-content mb-2">Booking Confirmed! 🎉</h3>
                <p className="text-sm text-base-content/60">
                  Your session has been successfully booked. You can view it in your bookings.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-2xl text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Book Session
                </h3>
                <p className="text-xs text-base-content/50 text-center mb-6">
                  Review session details before confirming your booking.
                </p>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                        <LuUser className="w-3.5 h-3.5" />
                        Student Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="input input-bordered w-full bg-base-200/60 font-medium"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                        <LuMail className="w-3.5 h-3.5" />
                        Student Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input input-bordered w-full bg-base-200/60 font-medium"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                        <LuGraduationCap className="w-3.5 h-3.5" />
                        Tutor Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={tutor.name}
                      disabled
                      className="input input-bordered w-full bg-base-200/60 font-medium"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                        <LuPhone className="w-3.5 h-3.5" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="017XX-XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input input-bordered w-full focus:input-primary transition-all"
                    />
                    <span className="text-xs text-base-content/40 mt-1">
                      Enter a valid Bangladesh phone number
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost hover:bg-base-200"
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="btn btn-primary shadow-lg shadow-primary/20"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}