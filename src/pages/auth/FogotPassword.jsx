import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import GuestLayout from "../../layouts/GuestLayout";
import authServices from "../../services/authServices";
import ModalView from "../../components/Model";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    title: "",
    message: "",
    messageType: "success",
    onClose: null,
  });
  const { t } = useTranslation();

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

  const validateEmail = (value) => {
    if (!value || value.trim() === "") return t("pleaseEnterYourEmail");
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) return t("pleaseEnterValidEmail");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email")?.trim() || "";

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      const emailInput = form.querySelector("input[name='email']");
      if (emailInput) emailInput.focus();
      return;
    }

    setIsLoading(true);
    try {
      const response = await authServices.forgotPassword(email);
      console.log("Forgot Password Response:", response);
      if (
        response?.status === 200 ||
        response?.data?.status === "success" ||
        response?.status === "success"
      ) {
        toast.success(t("resetCodeSentToEmail"));
        navigate("/login/verify-otp", { state: { email }, replace: true });
      } else {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            t("failedToSendResetCode"),
        );
      }
    } catch (error) {
      let errorMessage = t("failedToSendResetCodePleaseTryAgain");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
      toast.error(errorMessage || t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, open: false }));
    if (modalConfig.onClose) modalConfig.onClose();
  };

  return (
    <GuestLayout
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordDesc")}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 items-center"
      >
        <div className="flex flex-col gap-4 w-full">
          <Input
            type="email"
            label={t("email")}
            labelPlacement="outside-top"
            name="email"
            placeholder={t("enterEmail")}
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            onBlur={(e) => {
              const err = validateEmail(e.target.value);
              setErrors((prev) => {
                const copy = { ...prev };
                if (err) copy.email = err;
                else delete copy.email;
                return copy;
              });
            }}
            onChange={() => {
              if (errors.email) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.email;
                  return copy;
                });
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
          {isLoading ? t("sending") : t("sendResetCode")}
        </Button>

        <Link
          to="/login"
          className="text-[#285B7A] text-base font-medium capitalize text-center w-full hover:opacity-80 transition-opacity no-underline"
        >
          {t("backToLogin")}
        </Link>
      </form>
    </GuestLayout>
  );
};

export default ForgotPassword;
