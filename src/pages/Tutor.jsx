"use client";
import { useEffect, useState } from "react";
import { LuSearch, LuCalendar, LuFilterX, LuSlidersHorizontal, LuUserX } from "react-icons/lu";
import TutorCard from "../components/TutorCard";

export default function Tutors() {
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
        
        if (search.trim()) params.append("search", search.trim());
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setTutors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading tutors:", error);
        setTutors([]);
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
    <div className="min-h-screen bg-gradient-to-br from-base-200/40 via-base-100 to-base-200/20 py-12 px-4 md:px-8 text-base-content">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mx-auto mb-12 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 badge badge-primary badge-outline px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md">
            <LuSlidersHorizontal className="w-3.5 h-3.5" /> Explore Mentors
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-base-content md:text-5xl">
            Find Your Perfect Tutor
          </h1>
          <p className="text-sm md:text-base text-base-content/60 leading-relaxed">
            Search tutors by name or subject and filter by registration dates seamlessly with real-time updates.
          </p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 p-6 mb-12 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            
            <div className="form-control md:col-span-5">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                  <LuSearch className="w-3.5 h-3.5 text-primary" /> Search Tutor
                </span>
              </label>
              <div className="relative w-full">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Type name or subject to find tutors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered w-full pl-11 bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="form-control md:col-span-3">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-1">
                  <LuCalendar className="w-3.5 h-3.5 text-primary" /> Start Date
                </span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
              />
            </div>

            <div className="form-control md:col-span-3">
              <label className="label pt-0 pb-1.5">
                <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-1">
                  <LuCalendar className="w-3.5 h-3.5 text-secondary" /> End Date
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
              />
            </div>
          </div>

          {(search || startDate || endDate) && (
            <div className="flex justify-end mt-4 pt-3 border-t border-base-200">
              <button
                onClick={handleClearFilters}
                className="btn btn-ghost btn-xs text-error gap-1.5 hover:bg-error/10 rounded-lg normal-case font-medium"
              >
                <LuFilterX className="w-4 h-4" /> Clear Active Filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-semibold tracking-wider text-base-content/40 uppercase">Fetching Tutors...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl border border-dashed border-base-300 max-w-xl mx-auto shadow-xl">
            <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-base-300">
              <LuUserX className="w-8 h-8 text-base-content/40" />
            </div>
            <h3 className="text-xl font-bold text-base-content/80 mb-1">No Tutors Found</h3>
            <p className="text-sm text-base-content/50 max-w-xs mx-auto leading-relaxed">
              We couldn't find any tutor matching your current selection. Try resetting filters.
            </p>
            <button 
              onClick={handleClearFilters} 
              className="btn btn-sm btn-outline btn-primary mt-5 rounded-xl normal-case"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="h-full transform hover:-translate-y-1.5 transition-all duration-300 ease-out">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}