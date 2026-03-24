import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const OtpInput = forwardRef(
  ({ length = 6, onComplete, error = false }, ref) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [isError, setIsError] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
      setIsError(error);
    }, [error]);

    // Expose reset method to parent component
    useImperativeHandle(ref, () => ({
      reset: () => {
        setOtp(new Array(length).fill(""));
        setIsError(false);
        inputRefs.current[0]?.focus();
      },
      setError: () => {
        setIsError(true);
      },
    }));

    const handleChange = (index, value) => {
      if (value && isNaN(value)) return;

      // Clear error state when user starts typing
      if (isError) {
        setIsError(false);
      }

      const newOtp = [...otp];
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const otpValue = newOtp.join("");
      if (
        otpValue.length === length &&
        otpValue.split("").every((char) => char !== "")
      ) {
        onComplete?.(otpValue);
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace") {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        } else {
          const newOtp = [...otp];
          newOtp[index] = "";
          setOtp(newOtp);
        }
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, length);
      const newOtp = [...otp];

      pastedData.split("").forEach((char, i) => {
        if (i < length && !isNaN(char)) {
          newOtp[i] = char;
        }
      });

      setOtp(newOtp);

      const lastFilledIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[lastFilledIndex]?.focus();

      const otpValue = newOtp.join("");
      if (
        otpValue.length === length &&
        otpValue.split("").every((char) => char !== "")
      ) {
        onComplete?.(otpValue);
      }
    };

    return (
      <div className="flex flex-col items-center w-full">
        <div
          className={`flex gap-2 justify-center w-full ${
            isError ? "animate-shake" : ""
          }`}
        >
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-12 bg-[#FFFFFF] border rounded text-black text-center text-xl font-semibold outline-none transition-colors ${
                isError
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#222222] focus:border-[#A9A9A9]"
              }`}
            />
          ))}
        </div>
        {isError && (
          <p className="text-red-500 text-sm mt-2">
            Invalid OTP. Please try again.
          </p>
        )}
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-5px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(5px);
            }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }
);

OtpInput.displayName = "OtpInput";

export default OtpInput;
