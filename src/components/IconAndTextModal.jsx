import React, { useState, useEffect, useRef } from "react";
import { Image, Button } from "@heroui/react";
import { createRoot } from "react-dom/client";
import SuccessIcon from "../assets/image/Success.png";
import WarningIcon from "../assets/image/warning.png";
import ErrorIcon from "../assets/image/Error.png";

const getIconSrc = (icon) => {
  if (icon === "warning") return WarningIcon;
  if (icon === "error") return ErrorIcon;
  if (icon === "success") return SuccessIcon;
  return typeof icon === "string" ? icon : SuccessIcon;
};

// Component version (can still be used in JSX)
const IconAndTextModalComponent = ({
  title = "Success",
  description,
  icon = "success",
  isOpen = false,
  onOpenChange = () => {},
  size = "sm",
  btnLabel = "",
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    try {
      if (isOpen) {
        if (!dialogRef.current.open) dialogRef.current.showModal();
      } else {
        if (dialogRef.current.open) dialogRef.current.close();
      }
    } catch (err) {
      /* dialog not supported fallback: do nothing */
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal flex items-center justify-center rounded rounded-[25px] p-2 sm:p-4"
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
    >
      <div
        className="relative flex flex-col justify-center text-black bg-[#FFFFFF] rounded rounded-[25px] opacity-100 w-full max-w-[95%] p-6 gap-4 overflow-y-auto min-h-0"
        style={{
          width: "100%",
          maxWidth: "500px",
          minHeight: "200px",
          maxHeight: "90vh",
        }}
      >
        <button
          aria-label="Close"
          className="cursor-pointer absolute right-3 top-3 sm:right-5 sm:top-5 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] text-black font-bold"
          onClick={() => onOpenChange(false)}
        >
          ✕
        </button>

        <div className="flex flex-col text-center gap-3 sm:gap-4">
          <div className="mx-auto">
            <Image
              src={icon}
              width={80}
              height={80}
              alt="success"
              className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] mx-auto bg-black rounded-[30px]"
            />
          </div>

          <h2
            id="modal-title"
            className="uppercase text-xl sm:text-2xl md:text-[32px] font-bold tracking-wide"
          >
            {title}
          </h2>

          <p
            id="modal-description"
            className="text-[#6B7280] text-sm sm:text-base md:text-[16px] leading-snug break-words"
          >
            {description}
          </p>

          {btnLabel && (
            <Button
              onPress={() => onOpenChange(false)}
              className="bg-[#214C65] text-[#FFFFFF] py-2.5 px-8 rounded-md font-bold cursor-pointer"
            >
              {btnLabel}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  );
};

// Imperative function version (call it like a function)
const IconAndTextModal = ({
  title = "Success",
  description,
  icon = "success",
  onOpenChange = () => {},
  size = "md",
  autoCloseDuration = 0, // Auto close after 3 seconds by default
  btnLabel = "",
}) => {
  // Create a container for the modal
  const container = document.createElement("div");
  container.id = "modal-" + Date.now();
  document.body.appendChild(container);
  const root = createRoot(container);

  // Get the actual icon source from the icon string
  const iconSrc = getIconSrc(icon);

  // Component to handle the modal state
  const ModalWrapper = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isUnmounting, setIsUnmounting] = useState(false);

    const handleClose = () => {
      setIsUnmounting(true);
      // Wait for animation to complete before cleanup
      setTimeout(() => {
        try {
          root.unmount();
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        } catch (e) {
          console.warn("Modal cleanup error:", e);
        }
        onOpenChange();
      }, 300);
    };

    // Auto close after specified duration
    useEffect(() => {
      if (autoCloseDuration && autoCloseDuration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDuration);

        // Cleanup timer if component unmounts
        return () => clearTimeout(timer);
      }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        try {
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    }, []);

    return (
      <IconAndTextModalComponent
        title={title}
        description={description}
        icon={iconSrc}
        isOpen={isOpen}
        onOpenChange={handleClose}
        size={size}
        btnLabel={btnLabel}
      />
    );
  };

  // Render the modal
  root.render(<ModalWrapper />);
};

// Export both - function as default, component as named export
export default IconAndTextModal;
export { IconAndTextModalComponent };

/*

Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size} backdrop="blur" hideCloseButton>
            <ModalContent className='bg-[#141414] shadow-xl text-white border border-[#1B1B1B]'>
                <ModalBody className='justify-center items-center px-10 pt-10 pb-6'>
                    <Image src={icon} alt="success" height={80} width={80} />
                    <h1 className='md:text-4xl text-2xl font-bold text-center mt-6'>{title || 'Success'}</h1>
                    <p className='text-white text-center mt-4'>{description}</p>
                </ModalBody>
            </ModalContent>
        </Modal>

*/
