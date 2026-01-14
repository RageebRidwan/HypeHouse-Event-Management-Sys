import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";
import { setCredentials, logout as logoutAction } from "@/store/slices/authSlice";
import type { LoginInput, RegisterInput } from "@/types/auth";

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = async (credentials: LoginInput) => {
    try {
      const response = await loginMutation(credentials).unwrap();

      // Dispatch to Redux store
      dispatch(
        setCredentials({
          token: response.data.token,
          user: response.data.user,
        })
      );

      // Show success toast
      toast.success(response.message || "Login successful!");

      // Redirect to dashboard
      router.push("/dashboard");

      return response;
    } catch (error: unknown) {
      // Handle error
      const apiError = error as { data?: { error?: string }; error?: string };
      const errorMessage =
        apiError?.data?.error || apiError?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  return { login, isLoading };
};

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const register = async (credentials: RegisterInput) => {
    try {
      // Extract only the fields needed for the backend (exclude confirmPassword)
      const { name, email, password } = credentials;
      const response = await registerMutation({ name, email, password }).unwrap();

      // Dispatch to Redux store
      dispatch(
        setCredentials({
          token: response.data.token,
          user: response.data.user,
        })
      );

      // Show success toast
      toast.success(response.message || "Registration successful!");

      // Redirect to dashboard
      router.push("/dashboard");

      return response;
    } catch (error: unknown) {
      // Handle error
      const apiError = error as { data?: { error?: string }; error?: string };
      const errorMessage =
        apiError?.data?.error || apiError?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  return { register, isLoading };
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = () => {
    // Dispatch logout action
    dispatch(logoutAction());

    // Show success toast
    toast.success("Logged out successfully");

    // Redirect to login
    router.push("/login");
  };

  return { logout };
};
