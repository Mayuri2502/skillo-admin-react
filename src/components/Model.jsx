import React, { useEffect, useRef } from "react";
import success from "../assets/image/Success.png";
import error from "../assets/image/Error.png";
import warning from "../../public/assets/icons/WarningFigma.png";
import { Image } from "@heroui/react";

const ModalView = ({
  openModel,
  setOpenModel,
  title = "",
  subTitle = "",
  description = "",
  children,
  width = "1000px",
  minHeight = "200px",
  showClose = true,
  message,
  showStep,
  textAlign = "left",
  closeOnBackdrop = true,
  isAppLogo = false,
  ...props
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    try {
      if (openModel) {
        if (!dialogRef.current.open) dialogRef.current.showModal();
      } else {
        if (dialogRef.current.open) dialogRef.current.close();
      }
    } catch (err) {
      /* dialog not supported fallback: do nothing */
    }
  }, [openModel]);

  const imagePath = {
    success,
    error,
    warning
  };

  // map textAlign prop to safe Tailwind class
  const textAlignClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
        ? "text-right"
        : "text-left";

  // backdrop click handler (close when clicking outside content)
  const onBackdropClick = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === dialogRef.current) {
      setOpenModel(false);
    }
  };

  if (!openModel) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal flex items-center justify-center  rounded rounded-[25px] scrollbar-hide p-2 sm:p-4"
      onClose={(e) => {
        e.stopPropagation();
        setOpenModel(false);
      }}
      onClick={onBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
      {...props}
    >
      <div
        className={`relative flex flex-col justify-center text-black bg-[#FFFFFF] rounded rounded-[25px] opacity-100 w-full max-w-[95%] p-6 gap-4 overflow-y-hidden min-h-0 ${
          children ? "sm:max-w-[800px]" : ""
        }`}
        style={{
          width: "100%",
          maxWidth: width,
          minHeight: children ? minHeight : undefined,
          maxHeight: "90vh",
        }}
      >
        {/* Close Button */}
        {showClose && (
          <button
            aria-label="Close"
            className="cursor-pointer absolute right-3 top-3 sm:right-5 sm:top-5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-[8px]  text-black font-bold"
            onClick={() => setOpenModel(false)}
          >
            ✕
          </button>
        )}

        {showStep === "profile" && (
          <div className="w-full flex justify-start">
            <span className="italic uppercase text-2xl sm:text-4xl text-black font-medium">
              Profile
            </span>
          </div>
        )}

        {/* Header Section */}
        {(isAppLogo || message || title || description) && (
          <div className="flex flex-col text-center gap-3 sm:gap-4">
            {message && (
              <div className="mx-auto">
                <Image
                  src={imagePath[message] || "/png/Success.png"}
                  width={80}
                  height={80}
                  alt={message}
                  className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] mx-auto"
                />
              </div>
            )}

            {title && (
              <h2
                id="modal-title"
                className={`text-lg sm:text-xl md:text-[22px] font-semibold text-[#2C6587] tracking-wide ${textAlignClass}`}
              >
                {title}
              </h2>
            )}

            {subTitle && (
              <h2
                id="modal-subTitle"
                className={`italic uppercase text-xl sm:text-2xl md:text-[32px] font-bold tracking-wide ${textAlignClass}`}
                dangerouslySetInnerHTML={{ __html: subTitle }}
              />
            )}

            {description && (
              <p
                id="modal-description"
                className={`text-[#6B7280] text-sm sm:text-base md:text-[16px] leading-snug break-words ${textAlignClass}`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {children && (
          <div className="flex-1 w-full flex flex-col px-2 sm:px-4">
            {children}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default ModalView;
