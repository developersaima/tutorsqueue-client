"use client";
import { useEffect, useState, use, useContext } from "react";
import {
  LuCalendar,
  LuMapPin,
  LuDollarSign,
  LuBookOpen,
  LuGraduationCap,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, useSession } from "../../../lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TutorDetailsPage({ params: paramsPromise }) {

  const router=useRouter()
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const user = session?.user;
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTutorDetails = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/tutors/${params.id}`);
      const data = await res.json();
      setTutor(data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorDetails();
  }, [params.id]);

  const handleBookingClick = () => {
    if (!user) {
      toast.error("Please log in first to book a session!");
      return;
    }

    const currentDate = new Date();
    const sessionDate = new Date(tutor.sessionStartDate);

    if (parseInt(tutor.totalSlot) <= 0) {
      toast.error(
        "This session is fully booked. You can’t join at the moment.",
      );
      return;
    }

    if (currentDate < sessionDate) {
      toast.error("Booking is not available yet for this tutor");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setBookingLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const bookingInfo = {
        tutorId: tutor._id,
        studentName: user?.name || "Anonymous Student",
        studentEmail: user?.email,
        studentPhone: phone,
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
        setIsModalOpen(false);
        toast.success("Session booked successfully!");
        setPhone("");
        router.push("/my-bookings")
        fetchTutorDetails();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
          Loading Details...
        </p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Tutor not found!</h2>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-base-100 rounded-3xl shadow-sm border border-base-300/60 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 relative bg-base-300 min-h-[340px] md:min-h-full">
          <Image
            fill
            src={tutor.photoURL}
            alt={tutor.tutorName}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
          <div>
            <div className="badge badge-primary badge-outline text-xs font-semibold uppercase tracking-wider mb-3">
              {tutor.subject}
            </div>
            <h1 className="text-3xl font-black text-base-content mb-4">
              {tutor.tutorName}
            </h1>

            <div className="space-y-3.5 text-sm text-base-content/80">
              <div className="flex items-center gap-3">
                <LuGraduationCap className="w-5 h-5 text-primary" />
                <span>
                  <strong>Institution:</strong> {tutor.institution}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LuBookOpen className="w-5 h-5 text-secondary" />
                <span>
                  <strong>Experience:</strong> {tutor.experience}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LuMapPin className="w-5 h-5 text-accent" />
                <span>
                  <strong>Location:</strong> {tutor.location} (
                  {tutor.teachingMode})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LuCalendar className="w-5 h-5 text-info" />
                <span>
                  <strong>Available Slot:</strong> {tutor.availableDaysAndTime}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LuDollarSign className="w-5 h-5 text-success" />
                <span>
                  <strong>Hourly Fee:</strong> ৳{tutor.hourlyFee}/hr
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-base-200/60 rounded-xl inline-block">
              <span className="text-xs font-bold text-base-content/50 uppercase block mb-0.5">
                Total Slot Availability
              </span>
              <span
                className={`text-2xl font-black ${parseInt(tutor.totalSlot) === 0 ? "text-error" : "text-primary"}`}
              >
                {tutor.totalSlot} Slots Left
              </span>
            </div>
          </div>

          <button
            onClick={handleBookingClick}
            className="btn btn-primary w-full md:w-auto px-8 shadow-md shadow-primary/20"
          >
            Book Session
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-base-100 w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-base-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>

            <h3 className="font-black text-xl text-center mb-1">
              Book Session
            </h3>
            <p className="text-xs text-base-content/50 text-center mb-6">
              Review session details before confirming your booking.
            </p>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs text-base-content/60">
                    Student Name
                  </span>
                </label>
                <input
                  type="text"
                  value={user?.name || "User Name"}
                  disabled
                  className="input input-bordered w-full bg-base-200 font-medium"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs text-base-content/60">
                    Student Email
                  </span>
                </label>
                <input
                  type="email"
                  value={user?.email || "user@email.com"}
                  disabled
                  className="input input-bordered w-full bg-base-200 font-medium"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs text-base-content/60">
                    Tutor Name
                  </span>
                </label>
                <input
                  type="text"
                  value={tutor.name}
                  disabled
                  className="input input-bordered w-full bg-base-200 font-medium"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs text-base-content/70">
                    Phone Number
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="017XX-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="btn btn-neutral"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
