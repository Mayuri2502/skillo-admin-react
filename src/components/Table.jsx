import React, { Fragment, useState } from "react";
import {
  Table as HeroUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  DateRangePicker,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { BiSolidSearch } from "react-icons/bi";
import { CiFilter } from "react-icons/ci";
import { getLocalTimeZone, today } from "@internationalized/date";
import OverviewTabs from "./OverviewTabs";
import { TableSkeleton } from "./TableSkeleton";
import { useTranslation } from "react-i18next";
import { useRef, useEffect } from "react";

const Table = ({
  data = [],
  columns = [],
  isLoading = false,
  title = "Table",
  searchable = true,
  exportable = true,
  showDatePicker = true,
  pagination = { page: 1, size: 10, total: 0 },
  onPageChange,
  onPageSizeChange,
  onExport,
  onSearch,
  onDateChange,
  renderActions,
  filter,
  isHeaderVisible = false,
  freezeActionColumn = false,
  frozenColumnKey = "action",
  showtabs = false,
  onTabChange,
  activeTab,
  setActiveTab,
  textStyle,
  tabs,
  isCompact = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(pagination.size || 10);
  const rowIndexRef = useRef(0);
  const { t } = useTranslation();

  // Reset index when data changes
  useEffect(() => {
    rowIndexRef.current = 0;
  }, [data]);

  const loadingRows = Array.from({ length: pagination.size || 5 }, (_, i) => ({
    id: `loading-${i}`,
  }));

  // Calculate display indices for server-side pagination
  const page = pagination.page || 1;
  const size = pagination.size || 10;
  const total = pagination.total || 0;
  const pages = Math.ceil(total / size);
  // Add index to each item for proper tracking (must be defined before 'items')
  const itemsWithIndex =
    data?.map((item, idx) => ({
      ...item,
      _rowIndex: idx,
    })) || [];

  // Use itemsWithIndex for proper row indexing
  const items = itemsWithIndex;

  // Calculate display indices
  const startIndex = (page - 1) * size + 1;
  const endIndex = Math.min(page * size, total);

  const renderCell = (row, column, index) => {
    const cellValue = row[column.key];
    // If column has custom render function, use it
    if (column.render) {
      return column.render(cellValue, row, index);
    }

    // Handle action column
    if (column.key === "action" && renderActions) {
      return renderActions(row);
    }

    // Default text rendering with column formatting
    const className = column.className || "text-[#1F2128] font-light text-sm";
    // return <span className={className}>{cellValue || '-'}</span>;
    const stickyClass =
      freezeActionColumn && column.key === frozenColumnKey
        ? "sticky-col sticky-col-dark"
        : "";

    return (
      <span className={`${className} ${stickyClass}`}>{cellValue || "-"}</span>
    );
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="w-full bg-[#FFFFFF]  rounded-[28px] p-4 flex flex-col">
      {/* Table */}
      {items?.length > 0 || showtabs || filter || isLoading ? (
        <Fragment>
          {/* Header Section */}
          {isHeaderVisible && (
            <div
              className={`flex items-center flex-col xl:flex-row gap-4 md:gap-2 mb-5`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <h2 className="text-black text-xl capitalize">{title}</h2>
                {/* Search Input */}
                {searchable && (
                  <Input
                    size="sm"
                    placeholder={t("Table.searchPlaceholder")}
                    value={searchValue}
                    onValueChange={(value) => {
                      setSearchValue(value);
                      onSearch(value);
                    }}
                    startContent={<BiSolidSearch className="text-white" />}
                    classNames={{
                      base: "w-56 md:w-[280px]",
                      input: "text-xs text-[#fff!important]",
                      inputWrapper:
                        "bg-[#343434!important] border-none rounded-xl",
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between xl:justify-end gap-2 w-full xl:max-w-fit">
                {/* Export Button */}
                {exportable && (
                  <Button
                    size="sm"
                    startContent={<FaCloudDownloadAlt size={18} />}
                    className="bg-[#343434] text-white text-xs h-8 px-3 rounded-xl capitalize font-medium xl:w-full"
                    onPress={onExport}
                  >
                    {t("Table.export")}
                  </Button>
                )}

                {/* Date Picker */}
                {showDatePicker && (
                  <DateRangePicker
                    aria-label="Date range picker"
                    className="max-w-56"
                    defaultValue={{ start: today(), end: today() }}
                    classNames={{
                      inputWrapper:
                        "bg-[#343434!important] text-[#fff!important] border-none rounded-xl",
                      segment: "text-[#fff!important]",
                    }}
                    calendarProps={{
                      classNames: {
                        headerWrapper:
                          "bg-[#343434!important] border-none after:bg-[#343434!important]",
                        gridHeaderRow: "bg-[#343434!important] border-none",
                        content: "bg-[#343434!important] border-none",
                        prevButton: "text-white hover:bg-[#f4c462!important]",
                        nextButton: "text-white hover:bg-[#f4c462!important]",
                        gridHeaderCell: "text-[#fff!important]",
                        cell: "m-0.5 text-white",
                        pickerWrapper: "bg-[#343434!important] border-none",
                        pickerItem: "text-white",
                        pickerHighlight: "bg-[#f4c462!important]",
                        header:
                          "bg-[#343434!important] border-none text-[#f4c462!important]",
                        title: "text-[#f4c462!important]",
                        cellButton: [
                          "data-[selected=true]:bg-[#f4c462!important] data-[selected=true]:text-[#010101!important]",
                          "data-[range-selection=true]:before:bg-[#343434!important]",
                          "data-[react-aria-pressable=true]:text-white",
                          "data-[slot='header-wrapper']:text-white eee",
                        ],
                      },
                    }}
                    showMonthAndYearPickers
                    size="sm"
                    variant="solid"
                    onChange={(value) => {
                      const fromDate = value?.start
                        ?.toDate(getLocalTimeZone())
                        .toLocaleDateString("en-CA");
                      const toDate = value?.end
                        ?.toDate(getLocalTimeZone())
                        .toLocaleDateString("en-CA");
                      onDateChange({ fromDate, toDate });
                    }}
                  />
                )}

                {showtabs && (
                  <div className="flex items-center gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "bg-[#EC613D] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {tab.isFilter && <CiFilter size={16} />}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Filter Button */}
                {filter && filter}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <HeroUITable
              aria-label="Pools table"
              classNames={{
                base: "min-w-max",
                wrapper:
                  "relative bg-transparent shadow-none p-0 max-h-full overflow-hidden",
                th: "bg-[#F5F5F5] text-[#1F2128] text-sm font-bold font-poppins first:rounded-l-xl last:rounded-r-xl border-b-0 h-[60px]",
                td: "text-sm text-[#1F2128] font-light py-3",
                tr: "hover:bg-[#F5F5F5]/100 text-[#1F2128]",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    width={column.width}
                    className={`text-left ${
                      freezeActionColumn && column.key === frozenColumnKey
                        ? "sticky-col sticky-col-dark"
                        : ""
                    }`}
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={isLoading ? loadingRows : items}
                emptyContent={
                  !isLoading && (
                    <div className="p-7">{t("Table.nodatafound")}</div>
                  )
                }
              >
                {(item) => {
                  // Use the row index from the item itself
                  const currentRefIndex = item._rowIndex || 0;
                  const page = pagination.page || 1;
                  const size = pagination.size || 10;
                  const currentIndex = (page - 1) * size + currentRefIndex;

                  return isLoading ? (
                    <TableRow key={item.id}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ) : (
                    <TableRow
                      key={item.id || currentIndex}
                      className={
                        currentRefIndex % 2 !== 0 ? "bg-[#F5F5F5]" : ""
                      }
                    >
                      {(columnKey) => {
                        const column = columns.find((c) => c.key === columnKey);

                        return (
                          <TableCell
                            className={`
                ${currentRefIndex % 2 !== 0 ? "bg-[#F5F5F5]" : ""}
                first:rounded-l-xl
                last:rounded-r-xl
              `}
                          >
                            {renderCell(item, column, currentIndex)}
                          </TableCell>
                        );
                      }}
                    </TableRow>
                  );
                }}
              </TableBody>
            </HeroUITable>
          </div>

          {/* Pagination - Show if there's data OR if it's loading */}
          {(pagination.total > 0 || isLoading) && (
            <div
              className={`flex flex-col sm:flex-row justify-between items-end gap-3 px-4 pt-4 bg-white mt-auto ${isCompact ? "py-2" : ""}`}
            >
              <div className="flex flex-wrap items-end gap-x-3 gap-y-2 mb-auto">
                <span className="text-[#1F2128] font-medium text-sm">
                  {t("Table.showing")} {startIndex} {t("Table.to")} {endIndex}{" "}
                  {t("Table.of")} {pagination.total} {t("Table.items")}
                </span>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <Select
                    size="sm"
                    selectedKeys={[String(pageSize)]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      const newSize = selectedKey
                        ? Number(selectedKey)
                        : pagination.size || 10;
                      if (!isNaN(newSize) && newSize > 0) {
                        setPageSize(newSize);
                        if (onPageSizeChange) {
                          onPageSizeChange(newSize);
                        }
                      }
                    }}
                    classNames={{
                      trigger:
                        "bg-[#F5F5F5] text-[#1F2128] h-8 rounded-lg border border-[#E6E6E6]",
                      value: "text-[#1F2128] text-xs",
                      popoverContent:
                        "bg-white border border-[#E6E6E6] rounded-lg",
                      listbox: "bg-white",
                      selectorIcon: "hidden",
                    }}
                    aria-label="Select page size"
                    startContent={
                      <span className="text-[#1F2128] text-xs mr-1">
                        {t("Table.rows")}
                      </span>
                    }
                  >
                    <SelectItem key="5" className="text-[#1F2128] text-xs">
                      5
                    </SelectItem>
                    <SelectItem key="10" className="text-[#1F2128] text-xs">
                      10
                    </SelectItem>
                    <SelectItem key="30" className="text-[#1F2128] text-xs">
                      30
                    </SelectItem>
                    <SelectItem key="50" className="text-[#1F2128] text-xs">
                      50
                    </SelectItem>
                  </Select>
                </div>
              </div>

              <div
                className={
                  isCompact
                    ? "overflow-hidden"
                    : "overflow-x-auto w-full sm:w-auto"
                }
              >
                <Pagination
                  isCompact={isCompact}
                  isDisabled={isLoading}
                  showControls
                  page={page}
                  total={pages || 1}
                  onChange={onPageChange}
                  siblings={1}
                  boundaries={1}
                  classNames={{
                    wrapper:
                      "gap-1 bg-[#E6E6E666] border border-[#D1D1D1] rounded-xl",
                    item: "w-8 h-8 text-xs font-medium bg-transparent text-[#1F2128] hover:bg-[#B1B1B1!important]",
                    cursor: "bg-[#EC613D] w-8 h-[38px] text-black font-medium",
                    prev: "bg-transparent text-[#B1B1B1]",
                    next: "bg-transparent text-[#B1B1B1]",
                  }}
                />
              </div>
            </div>
          )}
        </Fragment>
      ) : (
        <div className="flex justify-center items-center h-96">
          <p
            className={
              textStyle
                ? `${textStyle}`
                : "text-black text-2xl md:text-4xl font-medium"
            }
          >
            {t("Table.noData")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Table;
