import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalView from "../../components/Model";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import PasswordInput from "../../components/Password";
import { changePassword } from "../../apis/profile.api.js";
import { toast } from "sonner";
import axios from "axios";
import { logoutHard } from "../../redux/slice/authSlice";
import { Toaster } from "sonner";
import profileImage from "../../assets/image/ProfileImage.png";
import { useTranslation } from "react-i18next";

const Profile = ({ openEdit, setOpenEdit }) => {
  const [userdata, setuserData] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    title: "",
    message: "",
    messageType: "success",
    onClose: null,
  });
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const showModal = (
    title,
    message,
    messageType = "success",
    onClose = null,
  ) => {
    setModalConfig({
      open: true,
      title,
      message,
      messageType,
      onClose,
    });
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setuserData(storedUserData);
  }, []);

  const validatePasswords = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!oldPassword || oldPassword.trim() === "") {
      newErrors.oldPassword = t("ProfileData.oldPasswordRequired");
    } else if (oldPassword.trim().length < 8) {
      newErrors.oldPassword = t("ProfileData.oldPasswordMinLength");
    } else if (oldPassword.trim().length > 12) {
      newErrors.oldPassword = t("ProfileData.oldPasswordMaxLength");
    } else if (!passwordRegex.test(oldPassword)) {
      newErrors.oldPassword = t("ProfileData.oldPasswordPattern");
    }

    if (!newPassword || newPassword.trim() === "") {
      newErrors.newPassword = t("ProfileData.newPasswordRequired");
    } else if (newPassword.trim().length < 8) {
      newErrors.newPassword = t("ProfileData.passwordMinLength");
    } else if (newPassword.trim().length > 12) {
      newErrors.newPassword = t("ProfileData.passwordMaxLength");
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = t("ProfileData.passwordPattern");
    } else if (oldPassword === newPassword) {
      newErrors.newPassword = t("ProfileData.newPasswordDifferent");
    }
    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = t("ProfileData.confirmPasswordRequired");
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword = t("ProfileData.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, open: false }));
    if (modalConfig.onClose) modalConfig.onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        old_password: oldPassword,
        new_password: confirmPassword,
      };
      const response = await changePassword(params);

      if (
        response?.status === 200 ||
        response?.data?.status === "success" ||
        response?.status === "success"
      ) {
        toast.success(
          response?.data?.msg ||
            response?.data?.message ||
            t("ProfileData.passwordChangedSuccess"),
          {
            id: "change-password-success",
            style: {
              zIndex: 9999999999999999,
            },
          },
        );
        setTimeout(() => {
          setOpenEdit(false);
        }, 3000);

        setTimeout(() => {
          dispatch(logoutHard());
          // localStorage.removeItem("_dw_aat");
          // localStorage.removeItem("_dw_art");
          // localStorage.removeItem("userData");
          // window.location.href = "/login";
        }, 4000);
        // showModal(
        //   "Success!",
        //   "Your password has been changed successfully.",
        //   "success",
        //   () => {
        //     setOldPassword("");
        //     setNewPassword("");
        //     setConfirmPassword("");
        //   },
        // );
      } else {
        throw new Error(
          console.log("RES", response),
          response?.data?.message ||
            response?.message ||
            t("ProfileData.failedToChangePassword"),
        );
      }
    } catch (error) {
      console.log("ERR", error);
      let errorMessage = t("ProfileData.invalidOldPassword");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
      toast.error(errorMessage || "Error", {
        id: "change-password-error",
        style: {
          zIndex: 9999999999999999,
        },
      });
      // showModal("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalView openModel={openEdit} setOpenModel={setOpenEdit} width="720px">
      <Toaster richColors position="top-center" />

      <div className="px-10 py-8 space-y-8 h-[550px] mt-3 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">CoudPouss Admin</h2>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4EA] text-[#39753c]">
              Admin
            </span>
          </div>

          <div className="h-[110px] w-[110px] rounded-full bg-[#EEF2FA] flex items-center justify-center mt-4 overflow-hidden">
            {userdata?.profile_photo && !imgError ? (
              <img
                src={
                  userdata?.profile_photo || user.profile_photo || profileImage
                }
                alt={user?.name || "Profile"}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-12 w-12 rounded-full text-gray-500 flex items-center justify-center  text-[50px]">
                {user?.name.charAt(0).toUpperCase() || "A"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm">
            <MdEmail className="text-[#214C65]" />
            <div>
              <p className="font-medium">{userdata?.email || "--"}</p>
              <p className="text-gray-400 text-xs">Email Address</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-[500px]">
          <div className="flex items-center gap-2 text-[#214C65] font-medium">
            <FaLock />
            <p>{t("ProfileData.EditPassword")}</p>
          </div>

          <PasswordInput
            label={t("ProfileData.OldPassword")}
            placeholder={t("ProfileData.entercurrentpassword")}
            value={oldPassword}
            onChange={(e) => {
              if (e.target.value === " ") return;
              if (e.target.value.trim().length > 12) return;
              setOldPassword(e.target.value);
              if (errors.oldPassword) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.oldPassword;
                  return copy;
                });
              }
            }}
            errorMessage={errors.oldPassword}
          />

          <PasswordInput
            label={t("ProfileData.NewPassword")}
            placeholder={t("ProfileData.enternewpassword")}
            value={newPassword}
            onChange={(e) => {
              if (e.target.value === " ") return;
              if (e.target.value.trim().length > 12) return;
              setNewPassword(e.target.value);
              if (errors.newPassword) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.newPassword;
                  return copy;
                });
              }
            }}
            errorMessage={errors.newPassword}
          />

          <PasswordInput
            label={t("ProfileData.ConfirmPassword")}
            placeholder={t("ProfileData.confirmnewpassword")}
            value={confirmPassword}
            onChange={(e) => {
              if (e.target.value === " ") return;
              if (e.target.value.trim().length > 12) return;
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.confirmPassword;
                  return copy;
                });
              }
            }}
            errorMessage={errors.confirmPassword}
          />
        </form>

        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full h-[48px] text-base rounded-full"
        >
          {isLoading
            ? t("ProfileData.changing")
            : t("ProfileData.changePassword")}
        </Button>
      </div>

      <ModalView
        openModel={modalConfig.open}
        setOpenModel={(open) => setModalConfig((prev) => ({ ...prev, open }))}
        title={modalConfig.title}
        message={modalConfig.messageType}
        autoCloseDuration={modalConfig.messageType === "success" ? 3000 : 5000}
        onClose={handleCloseModal}
        textAlign="center"
        showClose={modalConfig.messageType === "error"}
        width="420px"
      >
        <div className="mt-2 text-center">
          <p className="mb-3">{modalConfig.message}</p>
          <Button
            onClick={handleCloseModal}
            className={"bg-[#285B7A] text-white hover:bg-[#1e465c]"}
          >
            {modalConfig.messageType === "success" ? "Continue" : "Try Again"}
          </Button>
        </div>
      </ModalView>
    </ModalView>
  );
};

export default Profile;
