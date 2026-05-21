"use client";
import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, useSession } from "../../lib/auth-client";

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchMyBookings = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/my-bookings`, {
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyBookings();
    }
  }, [session]);

  const triggerCancelModal = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    
    setCancelLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${baseUrl}/api/bookings/${selectedBookingId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success("Booking canceled successfully!");
        setIsModalOpen(false);
        setSelectedBookingId(null);
        fetchMyBookings();
      } else {
        toast.error(responseData.message || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setCancelLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
          Loading Your Bookings...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">Please log in to view your bookings.</h2>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-base-content mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-300/60">
            <p className="text-base-content/60 font-medium">You haven't booked any sessions yet.</p>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300/60 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="bg-base-200/50 text-base-content/70 border-b border-base-300/60">
                    <th className="py-4 px-6 font-bold">Name</th>
                    <th className="py-4 px-6 font-bold">Phone</th>
                    <th className="py-4 px-6 font-bold">Tutor Name</th>
                    <th className="py-4 px-6 font-bold">Email</th>
                    <th className="py-4 px-6 font-bold text-center">Status</th>
                    <th className="py-4 px-6 text-center font-bold">Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-base-200/20 border-b border-base-200 last:border-none transition-colors">
                      <td className="py-4 px-6 font-medium text-base-content">{booking.studentName}</td>
                      <td className="py-4 px-6 text-base-content/80">{booking.phone}</td>
                      <td className="py-4 px-6 font-semibold text-base-content">{booking.tutorName}</td>
                      <td className="py-4 px-6 text-base-content/80">{booking.email}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`badge font-semibold text-xs px-3 py-2 border-none rounded-md ${
                            booking.status === "canceled"
                              ? "bg-error/10 text-error"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {booking.status === "canceled" ? "Canceled" : "Confirmed"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => triggerCancelModal(booking._id)}
                          disabled={booking.status === "canceled"}
                          className={`btn btn-sm btn-circle shadow-sm border ${
                            booking.status === "canceled"
                              ? "btn-ghost text-base-content/20 bg-base-200"
                              : "btn-ghost text-error hover:bg-error/10 border-base-200"
                          }`}
                        >
                          <LuX className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border border-base-200 text-center animate-fade-in">
            <button
              onClick={() => { setIsModalOpen(false); setSelectedBookingId(null); }}
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
            >
              <LuX className="w-5 h-5" />
            </button>

            <div className="mt-4">
              <h3 className="font-black text-xl text-base-content mb-2">
                Cancel Booking?
              </h3>
              <p className="text-sm text-base-content/60 px-2">
                Are you sure you want to cancel this tutor session? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedBookingId(null); }}
                className="btn btn-outline border-base-300"
                disabled={cancelLoading}
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                className="btn btn-error text-white"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}