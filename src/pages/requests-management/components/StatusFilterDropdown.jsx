import { CiFilter } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroUIButton,
} from "@heroui/react";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";

const STATUS_OPTIONS = ["all", "open", "accepted" , "pending", "completed", "cancelled", "expired"];

const StatusFilterDropdown = ({
  statusFilter,
  setStatusFilter,
  setPage,
  onApply,
}) => {
  const [localFilter, setLocalFilter] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    setLocalFilter(statusFilter);
  }, [statusFilter]);

  return (
    <Dropdown
      placement="bottom-start"
      shouldFlip={false}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
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

      <DropdownMenu
        aria-label="Filters"
        closeOnSelect={false}
        className="p-0 border-0"
      >
        {/* Status section */}
        <DropdownItem
          key="status"
          isReadOnly
          className="p-0 cursor-default bg-[#FFFFFF]"
        >
          <div className="px-4 pt-4 pb-3">
            <p className="text-center text-sm font-medium uppercase mb-3">
              Status
            </p>

            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilter.includes(status)}
                    onChange={() => {
                      setLocalFilter(status)
                    }
                    }
                    className="w-4 h-4 accent-[#214C65]"
                  />
                  <span className="text-sm capitalize text-[#545454]">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </DropdownItem>

        {/* Actions */}
        <DropdownItem
          key="actions"
          isReadOnly
          className="hover:bg-transparent cursor-default p-3"
        >
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              btnStyle="rounded-[25px] w-20 h-9"
              onClick={() => {
                setLocalFilter([]);
                setStatusFilter([]);
                setPage(1);
                setIsOpen(false); // optional
              }}
            >
              Clear All
            </Button>

            <Button
              variant="primary"
              size="sm"
              btnStyle="rounded-[25px] w-20 h-9"
              onClick={() => {
                setStatusFilter(localFilter); // pass selected filters
                setPage(1);
                onApply();                   // trigger API
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default StatusFilterDropdown;
