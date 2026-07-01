"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  LuMapPin, 
  LuDollarSign, 
  LuCalendar, 
  LuBookOpen, 
  LuUsers,
  LuClock,
  LuArrowRight,
  LuStar,
  LuGraduationCap
} from "react-icons/lu";

export default function TutorCard({ tutor }) {
  const [imageError, setImageError] = useState(false);

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(tutor.sessionStartDate).getTime() - new Date().getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysRemaining <= 3 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/60 overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full pt-[75%] bg-gradient-to-br from-base-200 to-base-300 overflow-hidden">
        {tutor.photo && !imageError ? (
          <Image
            src={tutor.photo}
            alt={tutor.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <LuGraduationCap className="w-10 h-10 text-primary/40" />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {/* Status Badge */}
          {isExpired ? (
            <span className="badge badge-error gap-1.5 shadow-lg">
              <LuClock className="w-3 h-3" />
              Session Started
            </span>
          ) : isUrgent ? (
            <span className="badge badge-warning gap-1.5 shadow-lg">
              <LuClock className="w-3 h-3" />
              {daysRemaining} days left
            </span>
          ) : (
            <span className="badge badge-success gap-1.5 shadow-lg">
              <LuCalendar className="w-3 h-3" />
              Available
            </span>
          )}
          
          {/* Teaching Mode */}
          <span className="badge badge-primary badge-outline gap-1.5 shadow-lg ml-auto">
            {tutor.teachingMode}
          </span>
        </div>

        {/* Available Slots Badge */}
        {parseInt(tutor.totalSlot) > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="badge badge-accent gap-1.5 shadow-lg">
              <LuUsers className="w-3 h-3" />
              {tutor.totalSlot} slots left
            </div>
          </div>
        )}

        {/* Subject Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="badge badge-secondary gap-1.5 shadow-lg">
            <LuBookOpen className="w-3 h-3" />
            {tutor.subject}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-base-content line-clamp-1">
            {tutor.name}
          </h3>
          <p className="text-sm text-base-content/60 flex items-center gap-1.5">
            <LuGraduationCap className="w-3.5 h-3.5 text-primary/60" />
            <span className="line-clamp-1">{tutor.institution}</span>
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-base-content/70 bg-base-200/50 rounded-lg px-2.5 py-1.5">
            <LuBookOpen className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="line-clamp-1">{tutor.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/70 bg-base-200/50 rounded-lg px-2.5 py-1.5">
            <LuClock className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="line-clamp-1">{tutor.availableSlots}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/70 bg-base-200/50 rounded-lg px-2.5 py-1.5 col-span-2">
            <LuMapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <span className="line-clamp-1">{tutor.location}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-3 px-2.5 py-1 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/5">
          <p className="text-xs text-base-content/60 flex items-center gap-1.5">
            <LuStar className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="font-medium">{tutor.experience}</span>
            <span className="text-base-content/40">• Experience</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-base-200/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary">
                ৳{tutor.hourlyFee}
              </span>
              <span className="text-xs text-base-content/40 ml-1">/hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/50">
              <LuUsers className="w-3.5 h-3.5" />
              <span>Available</span>
            </div>
          </div>

          <Link 
            href={`/tutors/${tutor._id}`} 
            className="btn btn-primary w-full rounded-xl shadow-md shadow-primary/20"
          >
            View Details
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}