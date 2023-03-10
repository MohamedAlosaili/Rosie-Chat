import { lazy, Suspense, useContext, useState } from "react";

import { AnimatePresence } from "framer-motion";
// import { BsFillTrashFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";

// import DeletePrompt from "./DeletePrompt";
import Image from "components/Image";
import Button from "components/Button";
import { UserContext } from "context/UserContext";

const EditInfoModal = lazy(() => import("./EditInfoModal"));

function Profile() {
  const {
    currentUser: { displayName, photoURL, email, about, joinedOn },
  } = useContext(UserContext);
  const [showEditModal, setShowEditModal] = useState(false);
  // const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const joinedDate = `${joinedOn.toDate()}`.slice(0, 24);

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <div className="relative">
          <Image
            img={{ url: photoURL, name: displayName }}
            className="mx-auto block aspect-square w-24 rounded-full md:w-32"
          />
        </div>
        <h3 className="text-center font-semibold text-primary-900 dark:text-primary-200">
          {displayName}
        </h3>
        <div className="flex flex-col gap-2 border-b-2 border-t-2 border-primary-400/50 py-4 dark:border-primary-800">
          <p>
            <span className="font-semibold text-primary-900 dark:text-primary-200">
              About:{" "}
            </span>
            {about || "Write something about your self"}
          </p>
          <h4>
            <span className="font-semibold text-primary-900 dark:text-primary-200">
              Email:{" "}
            </span>{" "}
            {email}
          </h4>
          <p>
            <span className="font-semibold text-primary-900 dark:text-primary-200">
              Joined on:{" "}
            </span>{" "}
            {joinedDate}
          </p>
        </div>
        <Button
          className="mx-auto w-[70%]"
          onClick={() => setShowEditModal(true)}
        >
          Edit
          <TbEdit />
        </Button>
        {/* 
        TODO: Deleting account not ready yet
        <Button
          className="mx-auto w-[70%]"
          bg="red"
          onClick={() => setShowDeletePrompt(true)}
        >
          Delete Account
          <BsFillTrashFill />
        </Button>
        */}
      </div>

      <Suspense
        fallback={<StatusMessage message="Loading..." type="loading" />}
      >
        <AnimatePresence>
          {showEditModal && (
            <EditInfoModal setShowEditModal={setShowEditModal} />
          )}
          {/* 
        TODO: Deleting account not ready yet
        {showDeletePrompt && (
          <DeletePrompt setShowDeletePrompt={setShowDeletePrompt} userInfo={{uid, displayName}} />
          )} 
        */}
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default Profile;
