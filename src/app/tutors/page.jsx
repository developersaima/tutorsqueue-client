"use client";
import { useEffect, useState } from "react";
import { LuSearch, LuCalendar, LuFilterX, LuSlidersHorizontal } from "react-icons/lu";
import TutorCard from "../../components/TutorCard";


export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        let url = (process.env.NEXT_PUBLIC_URL || "http://localhost:5000") + "/api/tutors";
        const params = new URLSearchParams();
        
        if (search) params.append("search", search);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setTutors(data);
      } catch (error) {
        console.error("Error loading tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [search, startDate, endDate]);

  const handleClearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-base-200/40 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="badge badge-primary badge-outline gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
            <LuSlidersHorizontal className="w-3.5 h-3.5" /> Explore Mentors
          </div>
          <h1 className="text-3xl font-black tracking-tight text-base-content md:text-5xl">
            Find Your Perfect Tutor
          </h1>
          <p className="text-sm md:text-base text-base-content/60 leading-relaxed">
            Search tutors by name and filter by registration dates seamlessly with realtime updates.
          </p>
        </div>

        {/* Live Filter Panel */}
        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300/60 max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            
            {/* Live Search Input */}
            <div className="form-control md:col-span-5">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs text-base-content/70">Search Tutor</span>
              </label>
              <div className="relative w-full">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Type name to find tutors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered w-full pl-11 bg-base-200/50 focus:bg-base-100 transition-colors"
                />
              </div>
            </div>

            {/* Live Start Date */}
            <div className="form-control md:col-span-3">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs text-base-content/70 flex items-center gap-1">
                  <LuCalendar className="w-3.5 h-3.5 text-primary" /> Start Date
                </span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered w-full bg-base-200/50"
              />
            </div>

            {/* Live End Date */}
            <div className="form-control md:col-span-3">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs text-base-content/70 flex items-center gap-1">
                  <LuCalendar className="w-3.5 h-3.5 text-secondary" /> End Date
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered w-full bg-base-200/50"
              />
            </div>
          </div>

          {/* Active Filter Clear Badge */}
          {(search || startDate || endDate) && (
            <div className="flex justify-end mt-4 pt-3 border-t border-base-200">
              <button
                onClick={handleClearFilters}
                className="btn btn-ghost btn-xs text-error gap-1.5 hover:bg-error/10 rounded-lg normal-case"
              >
                <LuFilterX className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-semibold tracking-wider text-base-content/40 uppercase">Fetching Tutors...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl border border-dashed border-base-300 max-w-3xl mx-auto shadow-inner">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuFilterX className="w-8 h-8 text-base-content/30" />
            </div>
            <h3 className="text-xl font-bold text-base-content/80 mb-1">No Tutors Match Your Search</h3>
            <p className="text-sm text-base-content/50 max-w-sm mx-auto">
              Try adjusting your date range or keywords to search again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}