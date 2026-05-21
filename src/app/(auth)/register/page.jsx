"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { signUp, signIn } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    await signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.photoUrl,
      },
      {
        onSuccess: () => {
          toast.success("Registration successful!");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Registration failed!");
        },
      }
    );
  };

   const handleGoogleLogin = async () => {
    await signInGoogle();
    toast.success("Login successfull with google")
    router.push("/")
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4 my-8">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-xl shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-center mb-6">Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <span className="text-error text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <span className="text-error text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Photo-URL</span>
            </label>
            <input
              type="url"
              {...register("photoUrl", { required: "Photo URL is required" })}
              className="input input-bordered w-full"
            />
            {errors.photoUrl && (
              <span className="text-error text-xs mt-1">
                {errors.photoUrl.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Length must be at least 6 characters",
                },
                validate: {
                  hasUpper: (v) =>
                    /[A-Z]/.test(v) || "Must have an Uppercase letter",
                  hasLower: (v) =>
                    /[a-z]/.test(v) || "Must have a Lowercase letter",
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <span className="text-error text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Register
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full mb-4"
        >
          Google
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}