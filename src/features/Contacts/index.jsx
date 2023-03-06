import { memo, useState, useContext } from "react";
import PropTypes from "prop-types";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";

import Users from "./Users";
import { db } from "rosie-firebase";
import { UserContext } from "context/UserContext";

function Contacts({ defaultContactTap }) {
  const { currentUser, updateDocument } = useContext(UserContext);
  const [contactTap, setContactTap] = useState(defaultContactTap);

  const usersQuery = query(
    collection(db, "users"),
    where("uid", "!=", currentUser.uid)
  );

  const [allUsers, usersLoading, usersError] = useCollectionData(usersQuery);

  return (
    <div className="flex h-[calc(100%-50px)] flex-col gap-4">
      <div className="relative flex rounded-xl border border-primary-400/50 dark:border-primary-700">
        <div
          className={`absolute top-0 transition-all ${
            contactTap === "friends" ? "left-0" : "left-1/2"
          } 
                                -z-10 h-full w-3/6 rounded-xl bg-accent
                    `}
        ></div>
        <button
          disabled={usersLoading || usersError}
          onClick={() => setContactTap("friends")}
          className={`flex-1 rounded-xl p-2 font-medium transition-colors focus:outline-none
                                ${
                                  contactTap === "friends"
                                    ? "text-white"
                                    : "hover:bg-primary-300 focus:hover:bg-primary-300 dark:hover:bg-primary-800 dark:focus:bg-primary-800"
                                }
                    `}
        >
          Friends
        </button>
        <button
          disabled={usersLoading || usersError}
          onClick={() => setContactTap("allUsers")}
          className={`flex-1 rounded-xl p-2 font-medium transition-colors focus:outline-none
                                ${
                                  contactTap === "allUsers"
                                    ? "text-white"
                                    : "hover:bg-primary-300 focus:hover:bg-primary-300 dark:hover:bg-primary-800 dark:focus:bg-primary-800"
                                }
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
  );
}

Contacts.propTypes = {
  defaultContactTap: PropTypes.string,
};

Contacts.defaultProps = {
  defaultContactTap: "friends",
};

export default memo(Contacts);
