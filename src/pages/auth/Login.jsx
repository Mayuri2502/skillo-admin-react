import React, { useState } from "react";
import { Alert } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import PasswordInput from "../../components/Password";
import GuestLayout from "../../layouts/GuestLayout";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slice/authSlice.js";
import IconAndTextModal from "../../components/IconAndTextModal.jsx";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (value) => {
    if (!value) return t("emailRequired");

    if (/\s/.test(value)) return t("spacesNotAllowedInEmail");
    if (value !== value.trim()) return t("leadingTrailingSpacesNotAllowed");
    const email = value.trim();
    if (email.length < 6 || email.length > 100)
      return t("emailMustBeBetween6And100");

    const atParts = email.split("@");
    if (atParts.length !== 2) return t("emailMustContainExactlyOneAt");

    const [local, domain] = atParts;
    if (local.length < 1) return t("emailMustHaveCharactersBeforeAt");

    if (/^[^A-Z0-9]|[^A-Z0-9]$/i.test(email))
      return t("emailCannotStartOrEndWithSpecialCharacters");
    if (email.includes("..")) return t("consecutiveDotsNotAllowed");

    if (domain.startsWith(".")) return t("domainCannotStartWithDot");

    if (!domain.includes(".")) return t("domainMustContainDot");
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,6}$/i;

    if (!emailRegex.test(email)) return t("pleaseEnterValidEmail");

    return null;
  };

  const validatePassword = (value) => {
    if (!value || value.trim() === "") return t("passwordRequired");
    if (value.trim().length < 8) return t("passwordMinLength");
    if (value.trim().length > 12) return t("passwordMaxLength");
    if (!/[a-z]/.test(value)) return t("passwordLowercase");
    if (!/[A-Z]/.test(value)) return t("passwordUppercase");
    if (!/\d/.test(value)) return t("passwordNumber");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const formValues = Object.fromEntries(new FormData(form));
    // client-side validation
    const emailError = validateEmail(formValues.email);
    const passwordError = validatePassword(formValues.password);
    const newFieldErrors = {};
    if (emailError) newFieldErrors.email = emailError;
    if (passwordError) newFieldErrors.password = passwordError;

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      // focus first invalid field
      const firstInvalid = form.querySelector(
        "input[name='" + Object.keys(newFieldErrors)[0] + "']",
      );
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const response = await dispatch(login(formValues));

    if (login.rejected.match(response)) {
      const message =
        response?.payload?.message ||
        response?.error?.message ||
        t("loginFailed");

      setErrors(message);
      toast.error(message);
      return;
    }

    if (login.fulfilled.match(response)) {
      setErrors(null);
      toast.success(t("loginSuccessful"));
      navigate("/");
    }
  };

  return (
    <GuestLayout
      title={t("welcomeToSkillo")}
      description={t("pleaseSignIn")}
    >
      {errors && <Alert color="danger" title={errors} className="mb-4" />}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 items-center w-full"
      >
        <div className="flex flex-col gap-2 w-full">
          {/* Email Field */}
          <Input
            type="email"
            label={t("email")}
            placeholder={t("enterEmail")}
            name="email"
            minLength={6}
            maxLength={100}
            onKeyDown={(e) => {
              if (e.key === " " && e.target.value.length === 0) {
                e.preventDefault();
              }
            }}
            errorMessage={fieldErrors.email}
            onBlur={(e) => {
              const err = validateEmail(e.target.value);
              setFieldErrors((prev) => {
                const copy = { ...prev };
                if (err) copy.email = err;
                else delete copy.email;
                return copy;
              });
            }}
          />

          {/* Password Field */}
          <PasswordInput
            label={t("password")}
            name="password"
            placeholder={t("enterPassword")}
            errorMessage={fieldErrors.password}
            minLength={8}
            maxLength={12}
            onKeyDown={(e) => {
              if (e.key === " " && e.target.value.length === 0) {
                e.preventDefault();
              }
            }}
            onBlur={(e) => {
              const err = validatePassword(e.target.value);
              setFieldErrors((prev) => {
                const copy = { ...prev };
                if (err) copy.password = err;
                else delete copy.password;
                return copy;
              });
            }}
          />

          {/* <Link
            to="/login/forgot-password"
            className="text-[#285B7A] text-sm font-medium text-right hover:opacity-80 transition-opacity no-underline"
          >
            {t("forgotPassword")}
          </Link> */}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-11 py-3 bg-[#EC613D] text-[#FFFFFF] text-base font-bold capitalize h-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4" />
              {t("loggingIn")}
            </>
          ) : (
            t("login")
          )}
        </button>
      </form>
    </GuestLayout>
  );
};

export default Login;
