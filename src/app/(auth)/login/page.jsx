"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router=useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/")

        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login failed!");
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
    <div className="flex justify-center items-center min-h-[75vh] px-4">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-xl shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <span className="text-error text-xs mt-1">
                {errors.password.message}
              </span>
            )}
            <label className="label justify-end">
              <button type="button" className="label-text-alt link link-hover">
                Forget Password?
              </button>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Login
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
          Don't have an account?{" "}
          <Link href="/register" className="link link-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}