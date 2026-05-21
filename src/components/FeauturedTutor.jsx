import TutorCard from "./TutorCard";

const FeauturedTutor = async () => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL+ "/api/tutor/feautured",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch tutors");
    }

    const tutors = await res.json();

    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-base-content mb-4">
              Available Tutors
            </h2>

            <p className="text-base-content/60 font-medium">
              Find the perfect tutor to help you achieve your learning goals.
            </p>
          </div>

          {tutors?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
              {tutors.map((tutor) => (
                <div
                  key={tutor._id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-base-content/50 py-10">
              No tutors found at the moment.
            </p>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.log(error);

    return (
      <p className="text-center text-red-500 py-10">
        Failed to load tutors
      </p>
    );
  }
};

export default FeauturedTutor;