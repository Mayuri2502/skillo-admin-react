import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroUIButton,
} from "@heroui/react";
import { CiFilter } from "react-icons/ci";
import Button from "../../../components/Button";

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Assigned" },
  { key: "cancelled", label: "Cancelled" },
];

const FilterDropdown = ({
  open,
  setOpen,
  tempStatusFilter,
  setTempStatusFilter,
  onApply,
  onClear,
}) => {
  const [localFilter, setLocalFilter] = useState("all");

  useEffect(() => {
    setLocalFilter(tempStatusFilter);
  }, [tempStatusFilter]);

  return (
    <Dropdown
      placement="bottom-start"
      shouldFlip={false}
      isOpen={open}
      onOpenChange={setOpen}
      className="bg-white rounded-xl shadow-lg"
    >
      <DropdownTrigger>
        <HeroUIButton
          isIconOnly
          size="sm"
          className="h-10 w-10 bg-[#E6E6E6] rounded-lg"
        >
          <CiFilter size={16} />
        </HeroUIButton>
      </DropdownTrigger>

      <DropdownMenu closeOnSelect={false} className="p-0">
        <DropdownItem isReadOnly className="p-0">
          <div className="px-4 pt-4">
            <p className="text-center text-sm font-medium uppercase mb-2">
              Pool Status
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
                    checked={localFilter === item.key}
                    onChange={() => {
                      setLocalFilter(item.key);
                      setTempStatusFilter(item.key);
                    }}
                    className="w-4 h-4 accent-[#214C65]"
                  />
                  <span className="text-sm text-[#545454]">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </DropdownItem>

        <DropdownItem isReadOnly className="p-0">
          <div className="p-3 grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                setLocalFilter("all");
                setTempStatusFilter("all");
                onClear();
              }}
            >
              Clear All
            </Button>

            <Button onClick={onApply}>Apply</Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;
