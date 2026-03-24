import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroUIButton,
} from "@heroui/react";
import { CiFilter } from "react-icons/ci";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";

const FilterDropdown = ({
  open,
  setOpen,
  tempStatusFilter,
  setTempStatusFilter,
  onApply,
  onClear,
  activeTab,
  t,
}) => {
  const STATUS_OPTIONS =
    activeTab === "transactions"
      ? [
          { key: "success", label: t("transactionData.sucess") },
          { key: "failed", label: t("transactionData.failed") },
        ]
      : [
          { key: "completed", label: t("transactionData.complated") },
          { key: "processing", label: t("transactionData.processing") },
          { key: "failed", label: t("transactionData.failed") },
        ];

  return (
    <Dropdown
      placement="bottom-start"
      shouldFlip={false}
      isOpen={open}
      onOpenChange={setOpen}
      className="bg-[#FFFFFF] rounded-[12px] shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)]"
    >
      <DropdownTrigger>
        <HeroUIButton
          variant="solid"
          isIconOnly
          size="sm"
          className="h-10 w-10 bg-[#E6E6E6] rounded-lg"
        >
          <CiFilter size={16} className="text-[#000000]" />
        </HeroUIButton>
      </DropdownTrigger>

      <DropdownMenu closeOnSelect={false} className="p-0">
        <DropdownItem isReadOnly className="p-0 cursor-default">
          <div className="px-4 pt-4">
            <p className="text-center text-sm font-medium uppercase mb-2">
              Status
            </p>

            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={tempStatusFilter.includes(item.key)}
                    onChange={() =>
                      setTempStatusFilter((prev) =>
                        prev.includes(item.key)
                          ? prev.filter((v) => v !== item.key)
                          : [...prev, item.key],
                      )
                    }
                  />
                  <span className="text-sm text-[#545454]">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </DropdownItem>

        <DropdownItem isReadOnly className="p-0">
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onClear}
                className="bg-[#E9ECEE] text-[#333333] hover:text-black hover:bg-[#D4D4D4] active:bg-[#2C6587] active:text-white transition-all font-medium py-2 px-6 rounded-lg text-sm w-full"
              >
                {t("clear")}
              </button>
              <button
                onClick={onApply}
                className="bg-[#E9ECEE] text-[#333333] hover:text-black hover:bg-[#D4D4D4] active:bg-[#2C6587] active:text-white transition-all font-medium py-2 px-6 rounded-lg text-sm w-full"
              >
                {t("apply")}
              </button>
            </div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;
