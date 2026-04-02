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

const UserTypeFilter = ({
  open,
  setOpen,
  filters,
  setFilters,
  onApply,
  onClear,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Dropdown
      placement="bottom-end"
      shouldFlip={false}
      isOpen={open}
      onOpenChange={setOpen}
      className="bg-white rounded-xl shadow-lg"
    >
      <DropdownTrigger>
        <HeroUIButton
          isIconOnly
          size="sm"
          className="h-10 w-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <CiFilter size={16} className="text-gray-600" />
        </HeroUIButton>
      </DropdownTrigger>

      <DropdownMenu closeOnSelect={false} className="p-0 min-w-[280px]">
        <DropdownItem isReadOnly className="p-0">
          <div className="px-4 pt-4">
            <p className="text-center text-sm font-medium uppercase mb-3 text-gray-700">
              User Type
            </p>

            <div className="flex flex-col gap-3">
              <label
                key="customer_individual"
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={localFilters.customer_individual}
                  onChange={() => handleFilterChange("customer_individual")}
                  className="w-4 h-4 accent-[#EC613D]"
                />
                <span className="text-sm text-gray-600">
                  Customer (Individual)
                </span>
              </label>

              <label
                key="customer_business"
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={localFilters.customer_business}
                  onChange={() => handleFilterChange("customer_business")}
                  className="w-4 h-4 accent-[#EC613D]"
                />
                <span className="text-sm text-gray-600">
                  Customer (Business)
                </span>
              </label>

              <label
                key="provider_individual"
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={localFilters.provider_individual}
                  onChange={() => handleFilterChange("provider_individual")}
                  className="w-4 h-4 accent-[#EC613D]"
                />
                <span className="text-sm text-gray-600">
                  Provider (Individual)
                </span>
              </label>

              <label
                key="provider_business"
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={localFilters.provider_business}
                  onChange={() => handleFilterChange("provider_business")}
                  className="w-4 h-4 accent-[#EC613D]"
                />
                <span className="text-sm text-gray-600">
                  Provider (Business)
                </span>
              </label>
            </div>
          </div>
        </DropdownItem>

        <DropdownItem isReadOnly className="p-0">
          <div className="p-3 grid grid-cols-2 gap-2 border-t border-gray-100">
            <button
              onClick={() => {
                setLocalFilters({
                  customer_individual: false,
                  customer_business: false,
                  provider_individual: false,
                  provider_business: false
                });
                setFilters({
                  customer_individual: false,
                  customer_business: false,
                  provider_individual: false,
                  provider_business: false
                });
                onClear();
              }}
              className="h-9 px-4 text-sm rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>

            <Button 
              onClick={() => {
                setFilters(localFilters);
                onApply();
              }}
              className="h-9 text-sm rounded-full bg-[#EC613D] text-white hover:bg-[#D6572B]"
            >
              Apply
            </Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserTypeFilter;
