import Image from "next/image";
import Link from "next/link";
import { LuMapPin, LuDollarSign, LuCalendar, LuBookOpen } from "react-icons/lu";

export default function TutorCard({ tutor }) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200 h-full flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="w-full h-48 relative overflow-hidden bg-base-200">
          <Image
            src={tutor.photo}
            alt={tutor.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 badge badge-primary font-semibold shadow-sm">
            {tutor.teachingMode}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-base-content line-clamp-1">{tutor.name}</h3>
            <p className="text-sm font-medium text-primary line-clamp-1">{tutor.institution}</p>
          </div>

          <div className="space-y-1.5 text-sm text-base-content/70">
            <p className="flex items-center gap-2">
              <LuBookOpen className="w-4 h-4 text-primary shrink-0" />
              <span className="line-clamp-1">Subject: {tutor.subject}</span>
            </p>
            <p className="flex items-center gap-2">
              <LuCalendar className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs line-clamp-1">Slots: {tutor.availableSlots}</span>
            </p>
            <p className="flex items-center gap-2">
              <LuMapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="line-clamp-1">{tutor.location}</span>
            </p>
          </div>

          <p className="text-xs text-base-content/60 line-clamp-2 pt-1 border-t border-base-100">
            {tutor.experience} years of  Experience
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between border-t border-base-200 pt-4 bg-base-100">
          <div className="flex items-center font-bold text-lg text-base-content">
            <LuDollarSign className="w-5 h-5 text-success -mr-1" />
            <span>{tutor.hourlyFee}</span>
            <span className="text-xs font-normal text-base-content/60 ml-0.5">/hr</span>
          </div>
          <div className="text-xs font-semibold text-base-content/70 bg-base-200 px-2 py-1 rounded-md">
            Available: {tutor.totalSlot}
          </div>
        </div>
        
        <div className="mt-4">
          <Link href={`/tutors/${tutor._id}`} className="btn btn-primary btn-sm w-full rounded-lg">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}