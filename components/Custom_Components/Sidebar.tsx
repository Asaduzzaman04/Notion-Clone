"use client";
import DocumentsButton from "./DocumentsButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { DocumentData, query } from "@firebase/firestore";
import { collectionGroup, where } from "@firebase/firestore/lite";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface Roomdata extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupData, setgroupData] = useState<{
    owner: Roomdata[];
    editor: Roomdata[];
  }>({
    owner: [],
    editor: [],
  });

  const [data] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );
  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: Roomdata[];
      editor: Roomdata[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as Roomdata;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }
        return acc;
      },
      {
        owner: [],
        editor: [],
      }
    );
    setgroupData(grouped);
  }, [data]);

  const menuOption = (
    <>
      <DocumentsButton />
      <div className="flex flex-col gap-3">


      {/* document */}
      {groupData.owner.length === 0 ? (
        <div className="text-center text-gray-600">No documents found.</div>
      ) : (
        groupData.owner.map((room) => (
          <div key={room.id} className="text-center text-gray-600">
            <SidebarOption data={room.id}/>
            {room.title}
          </div>
        ))
      )}
      </div>
    </>
  );

  return (
    <div className="">
      <div>
        {/* large-device-button */}
        <div className="p-2 md:py-5 md:px-2  hidden md:inline-flex">
          {menuOption}
        </div>
        {/* small-device-button */}
        <div className="p-2  inline-block md:hidden">
          <Sheet>
            <SheetTrigger className="p-2 bg-gray-300 active:bg-gray-400  active:scale-95 transition-all duration-100 ease-linear rounded-lg">
              <IoMenu size={25} />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                {/*option-menu*/}
                <div>{menuOption}</div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
