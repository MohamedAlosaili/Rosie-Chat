import { memo, useState, useContext } from "react"

import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, query, where } from "firebase/firestore"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BsExclamationCircleFill } from "react-icons/bs"

import Users from "./Users"
import { db } from "rosie-firebase"
import { UserContext } from "hooks/context"

function Contacts() {
    const { currentUser, updateDocument } = useContext(UserContext)
    const [contactTap, setContactTap] = useState("friends")

    const usersQuery = query(
        collection(db, "users"),
        where("uid", "!=", currentUser.uid)
    )

    const [allUsers, usersLoading, usersError] = useCollectionData(usersQuery)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex rounded-xl border border-primary-700 relative">
                <div
                    className={`transition-all absolute top-0 ${contactTap === "friends" ? "left-0" : "left-1/2"} 
                                h-full w-3/6 bg-accent rounded-xl -z-10
                    `}
                ></div>
                <button
                    disabled={usersLoading || usersError}
                    onClick={() => setContactTap("friends")}
                    className={`transition-colors rounded-xl flex-1 p-2 font-medium focus:outline-none
                                ${contactTap === "friends" ? "dark:text-primary-200" : "dark:hover:bg-primary-800 dark:focus:bg-primary-800"}
                    `}
                >
                    Friends
                </button>
                <button
                    disabled={usersLoading || usersError}
                    onClick={() => setContactTap("allUsers")}
                    className={`transition-colors rounded-xl flex-1 p-2 font-medium focus:outline-none
                                ${contactTap === "allUsers" ? "dark:text-primary-200" : "dark:hover:bg-primary-800 dark:focus:bg-primary-800"}
                    `}
                >
                    All users
                </button>
            </div>
            <Users
                currentUser={currentUser}
                updateDocument={updateDocument}
                results={{ allUsers, usersLoading, usersError }}
                contactTap={contactTap}
                setContactTap={setContactTap}
            />
        </div>
    )
}

export default memo(Contacts)