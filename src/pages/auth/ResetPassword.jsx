import React, { useState } from "react";
import { Form } from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "../../components/Password";
import Button from "../../components/Button";
import GuestLayout from "../../layouts/GuestLayout";
import authServices from "../../services/authServices";
import ModalView from "../../components/Model";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || "";
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    title: "",
    message: "",
    messageType: "success",
  });
  const { t } = useTranslation();

  const validatePassword = (password) => {
    if (!password || password.trim() === "")
      return t("pleaseEnterYourPassword");
    if (password.length < 6) return t("passwordMustBeAtLeast6Characters");
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword.trim() === "")
      return t("pleaseConfirmYourPassword");
    if (password !== confirmPassword) return t("passwordsDoNotMatch");
    return null;
  };

  const showModal = (title, message, messageType = "success") => {
    setModalConfig({
      open: true,
      title,
      message,
      messageType,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // Validation
    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(
      newPassword,
      confirmPassword,
    );

    const newErrors = {};
    if (passwordError) newErrors.newPassword = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: userEmail,
        password: newPassword,
        confirm_password: confirmPassword,
      };

      const response = await authServices.resetPassword(payload);

      if (response?.status === 200 || response?.status === "success") {
        toast.success(t("passwordResetSuccessRedirecting"));
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(response?.data?.message || t("failedToResetPassword"));
      }
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage =
        error.message || t("failedToResetPasswordPleaseTryAgain");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, open: false }));
    if (modalConfig.messageType === "success") {
      navigate("/login");
    }
  };

  return (
    <GuestLayout
      title={t("createNewPassword")}
      description={t("passwordShouldBeDifferentFromPrevious")}
    >
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 items-center"
        validationBehavior="native"
      >
        <div className="flex flex-col gap-4 w-full">
          <PasswordInput
            label={t("newPassword")}
            name="newPassword"
            placeholder={t("enterNewPassword")}
            isRequired
            isInvalid={!!errors.newPassword}
            errorMessage={errors.newPassword}
            onBlur={(e) => {
              const err = validatePassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                newPassword: err,
              }));
            }}
            onChange={() => {
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: null }));
              }
            }}
          />

          <PasswordInput
            label={t("confirmPassword")}
            name="confirmPassword"
            placeholder={t("confirmYourPassword")}
            isRequired
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            onBlur={(e) => {
              const newPassword = document.querySelector(
                'input[name="newPassword"]',
              )?.value;
              const err = validateConfirmPassword(newPassword, e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword: err,
              }));
            }}
            onChange={() => {
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }
            }}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t("resetting") : t("resetPassword")}
        </Button>
      </Form>
    </GuestLayout>
  );
};

export default ResetPassword;
