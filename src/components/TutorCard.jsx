"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  LuMapPin, 
  LuCalendar, 
  LuArrowRight,
  LuStar
} from "react-icons/lu";

export default function TutorCard({ tutor }) {
  const [imageError, setImageError] = useState(false);

  const daysRemaining = Math.ceil(
    (new Date(tutor.sessionStartDate).getTime() - new Date().getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysRemaining <= 3 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const getUserInitial = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200/60 overflow-hidden h-full flex flex-col">
      <div className="relative w-full pt-[75%] bg-base-200 overflow-hidden">
        {tutor.photo && !imageError ? (
          <Image
            src={tutor.photo}
            alt={tutor.name || "Tutor Profile"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary select-none">
            <span className="text-3xl font-black tracking-wider">
              {getUserInitial(tutor.name)}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {isExpired ? (
            <span className="badge badge-error text-white gap-1.5 shadow-md">
              Session Started
            </span>
          ) : isUrgent ? (
            <span className="badge badge-warning text-warning-content gap-1.5 shadow-md">
              {daysRemaining} days left
            </span>
          ) : (
            <span className="badge badge-success text-white gap-1.5 shadow-md">
              Available
            </span>
          )}
          
          <span className="badge badge-primary gap-1.5 shadow-md ml-auto">
            {tutor.teachingMode}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-base-content line-clamp-1 mb-1">
            {tutor.name || "Unknown Tutor"}
          </h3>
          <p className="text-sm font-semibold text-primary line-clamp-1">
            {tutor.subject}
          </p>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <LuMapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="line-clamp-1">{tutor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <LuCalendar className="w-4 h-4 text-primary shrink-0" />
            <span className="line-clamp-1">{tutor.availableSlots}</span>
          </div>
          {tutor.experience && (
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <LuStar className="w-4 h-4 text-warning fill-warning shrink-0" />
              <span>{tutor.experience} Experience</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-base-200/60 flex items-center justify-between gap-4">
          <div className="flex items-baseline shrink-0">
            <span className="text-2xl font-black text-primary">
              ৳{tutor.hourlyFee}
            </span>
            <span className="text-xs text-base-content/50 ml-0.5">/hr</span>
          </div>

          <Link 
            href={`/tutors/${tutor._id}`} 
            className="btn btn-primary btn-sm px-4 rounded-xl flex-1 justify-center gap-1 normal-case"
          >
            View Details
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}