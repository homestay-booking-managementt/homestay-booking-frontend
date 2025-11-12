import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateUserInfo } from "@/auth/authSlice";
import { getProfileSimple } from "@/api/authApi";

/**
 * Hook để restore authentication state khi reload trang
 * Tự động fetch user profile nếu có token nhưng chưa có user info
 */
export const useAuthRestore = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((store) => store.auth.isAuthenticated);
  const currentUser = useAppSelector((store) => store.auth.currentUser);
  const hasAttempted = useRef(false);

  useEffect(() => {
    const restoreAuth = async () => {
      // Chỉ chạy 1 lần khi mount
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      // Nếu đã có authentication nhưng chưa có userId, fetch lại profile
      if (isAuthenticated && !currentUser.userId) {
        const idToken = localStorage.getItem("id_token");
        if (idToken) {
          try {
            console.log("🔄 Restoring user session from token...");
            const response = await getProfileSimple();
            const user = response.data;

            if (user) {
              dispatch(
                updateUserInfo({
                  id: user.id,
                  user_name: user.name,
                  role_id: user.roles?.includes("ADMIN")
                    ? 1
                    : user.roles?.includes("HOST")
                      ? 2
                      : 3,
                  is_admin: user.roles?.includes("ADMIN") || false,
                  is_active: user.status === 1,
                  role_permissions: user.role_permissions,
                })
              );
              console.log("✅ User session restored successfully");
            }
          } catch (error) {
            console.error("❌ Failed to restore user session:", error);
            // Nếu fetch profile fail (401), axios interceptor sẽ tự động xử lý
          }
        }
      }
    };

    restoreAuth();
  }, [isAuthenticated, currentUser.userId, dispatch]);
};
