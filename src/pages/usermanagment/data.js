import { useMemo } from "react";

export const allUsers = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/40?img=32",
    firstName: "Jane",
    lastName: "Cooper",
    email: "janecooper123@gmail.com",
    accountCreatedOn: "30/09/2024",
    lastLogin: "30/09/2024",
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/40?img=12",
    firstName: "Jane",
    lastName: "Warren",
    email: "wadewarren123@gmail.com",
    accountCreatedOn: "28/09/2024",
    lastLogin: "28/09/2024",
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/40?img=20",
    firstName: "Brooklyn",
    lastName: "Simmons",
    email: "brooklynsimmons123@gmail.com",
    accountCreatedOn: "22/09/2024",
    lastLogin: "22/09/2024",
  },
  {
    id: "4",
    avatar: "https://i.pravatar.cc/40?img=7",
    firstName: "Leslie",
    lastName: "Alexander",
    email: "lesliealexander123@gmail.com",
    accountCreatedOn: "20/09/2024",
    lastLogin: "20/09/2024",
  },
  {
    id: "5",
    avatar: "https://i.pravatar.cc/40?img=44",
    firstName: "Esther",
    lastName: "Howard",
    email: "estherhoward123@gmail.com",
    accountCreatedOn: "12/09/2024",
    lastLogin: "12/09/2024",
  },
  {
    id: "6",
    avatar: "https://i.pravatar.cc/40?img=5",
    firstName: "Jacob",
    lastName: "Jones",
    email: "jacobjones123@gmail.com",
    accountCreatedOn: "16/09/2024",
    lastLogin: "16/09/2024",
  },
  {
    id: "7",
    avatar: "https://i.pravatar.cc/40?img=9",
    firstName: "Jenny",
    lastName: "Wilson",
    email: "jennywilson123@gmail.com",
    accountCreatedOn: "09/09/2024",
    lastLogin: "09/09/2024",
  },
  {
    id: "8",
    avatar: "https://i.pravatar.cc/40?img=15",
    firstName: "Robert",
    lastName: "Fox",
    email: "robertfox123@gmail.com",
    accountCreatedOn: "01/09/2024",
    lastLogin: "01/09/2024",
  },
  {
    id: "9",
    avatar: "https://i.pravatar.cc/40?img=16",
    firstName: "Robert",
    lastName: "Fox",
    email: "robertfox123@gmail.com",
    accountCreatedOn: "01/09/2024",
    lastLogin: "01/09/2024",
  },
  {
    id: "10",
    avatar: "https://i.pravatar.cc/40?img=21",
    firstName: "Robert",
    lastName: "Fox",
    email: "robertfox123@gmail.com",
    accountCreatedOn: "01/09/2024",
    lastLogin: "01/09/2024",
  },
  {
    id: "11",
    avatar: "https://i.pravatar.cc/40?img=22",
    firstName: "Robert",
    lastName: "Fox",
    email: "robertfox123@gmail.com",
    accountCreatedOn: "01/09/2024",
    lastLogin: "01/09/2024",
  },
  {
    id: "12",
    avatar: "https://i.pravatar.cc/40?img=23",
    firstName: "Robert",
    lastName: "Fox",
    email: "robertfox123@gmail.com",
    accountCreatedOn: "01/09/2024",
    lastLogin: "01/09/2024",
  },
];

  // const FilterDropdown = ({}) => (
  //   <Dropdown
  //     placement="bottom-start"
  //     shouldFlip={false}
  //     className="bg-[#FFFFFF] rounded-[12px] shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)]"
  //   >
  //     <DropdownTrigger>
  //       <HeroUIButton
  //         variant="solid"
  //         isIconOnly
  //         size="sm"
  //         className="h-10 w-10 bg-[#E6E6E6] rounded-lg"
  //       >
  //         <CiFilter size={16} className="text-[#000000]" />
  //       </HeroUIButton>
  //     </DropdownTrigger>

  //     <DropdownMenu
  //       aria-label="Filters"
  //       closeOnSelect={false}
  //       className="p-0 border-0"
  //     >
  //       <DropdownItem
  //         key="status"
  //         isReadOnly
  //         className="p-0 cursor-default bg-[#FFFFFF]"
  //       >
  //         <div className="px-4 pt-4 pb-3">
  //           <p className="text-center text-sm font-medium uppercase mb-3">
  //             Status
  //           </p>

  //           <div className="flex flex-col gap-2">
  //             {["pending", "approved", "rejected"].map((status) => (
  //               <label
  //                 key={status}
  //                 className="flex items-center gap-3 cursor-pointer"
  //               >
  //                 <input
  //                   type="checkbox"
  //                   checked={statusFilter.includes(status)}
  //                   onChange={() =>
  //                     setStatusFilter((prev) =>
  //                       prev.includes(status)
  //                         ? prev.filter((s) => s !== status)
  //                         : [...prev, status],
  //                     )
  //                   }
  //                   className="w-4 h-4 accent-[#214C65]"
  //                 />
  //                 <span className="text-sm capitalize text-[#545454]">
  //                   {status}
  //                 </span>
  //               </label>
  //             ))}
  //           </div>
  //         </div>
  //       </DropdownItem>

  //       <DropdownItem
  //         key="actions"
  //         isReadOnly
  //         className="hover:bg-transparent cursor-default p-3"
  //       >
  //         <div className="flex gap-2">
  //           <Button
  //             variant="secondary"
  //             size="sm"
  //             btnStyle="rounded-[25px] w-20 h-9"
  //             onClick={() => setStatusFilter([])}
  //           >
  //             Clear All
  //           </Button>
  //           <Button
  //             variant="primary"
  //             size="sm"
  //             btnStyle="rounded-[25px] w-20 h-9"
  //           >
  //             Apply
  //           </Button>
  //         </div>
  //       </DropdownItem>
  //     </DropdownMenu>
  //   </Dropdown>
  // );