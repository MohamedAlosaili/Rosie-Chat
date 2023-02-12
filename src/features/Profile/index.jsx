import { useContext, useState } from "react";

import { AnimatePresence } from "framer-motion";
// import { BsFillTrashFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";

import EditInfoModal from "./EditInfoModal";
// import DeletePrompt from "./DeletePrompt";
import Image from "components/Image";
import Button from "components/Button";
import { UserContext } from "context/UserContext";

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
        <h3 className="text-center font-semibold text-primary-300">
          {displayName}
        </h3>
        <div className="flex flex-col gap-2 border-b border-t py-4 dark:border-primary-700">
          <p>
            <span className="dark:text-primary-200">About: </span>
            {about || "Write something about your self"}
          </p>
          <h4>
            <span className="dark:text-primary-200">Email: </span> {email}
          </h4>
          <p>
            <span className="dark:text-primary-200">Joined on: </span>{" "}
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
      <AnimatePresence>
        {showEditModal && <EditInfoModal setShowEditModal={setShowEditModal} />}
        {/* 
        TODO: Deleting account not ready yet
        {showDeletePrompt && (
          <DeletePrompt setShowDeletePrompt={setShowDeletePrompt} userInfo={{uid, displayName}} />
        )} 
        */}
      </AnimatePresence>
    </>
  );
}

export default Profile;
