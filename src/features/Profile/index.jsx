import { useContext, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { BsFillExclamationCircleFill, BsFillTrashFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";
import { useDeleteUser } from "react-firebase-hooks/auth";

import StatusMessage from "components/StatusMessage";
import Image from "components/Image";
import Input from "components/Input";
import Button from "components/Button";
import Modal from "components/Modal";
import { UserContext } from "context/UserContext";
import { auth } from "rosie-firebase";

function Profile() {
  const {
    currentUser: { uid, displayName, photoURL, email, about, joinedOn },
  } = useContext(UserContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [editValues, setEditValues] = useState({ displayName, about });
  const [deleteUser, deletingUser, deletingUserError] = useDeleteUser(auth);

  const joinedDate = `${joinedOn.toDate()}`.slice(0, 24);

  function deleteUserAccount() {
    if (auth.currentUser) deleteUser(auth.currentUser).then();
  }

  return (
    <>
      <AnimatePresence>
        {deletingUserError && (
          <StatusMessage type="error" message={deletingUserError?.code} />
        )}
      </AnimatePresence>
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
            <span className="dark:text-primary-200">About:</span>{" "}
            {about || "Write something about your self"}
          </p>
          <h4>
            <span className="dark:text-primary-200">Email:</span> {email}
          </h4>
          <p>
            <span className="dark:text-primary-200">Joined on:</span>{" "}
            {joinedDate}
          </p>
        </div>
        <Button
          additionClasses="w-[70%] mx-auto"
          handleClick={() => setShowEditModal(true)}
        >
          Edit
          <TbEdit />
        </Button>
        <Button
          additionClasses="w-[70%] mx-auto"
          bg="red"
          handleClick={() => setShowDeletePrompt(true)}
        >
          Delete Account
          <BsFillTrashFill />
        </Button>
      </div>
      <AnimatePresence>
        {showEditModal && (
          <Modal closeModal={() => setShowEditModal(false)}>
            <div className="flex min-w-[20rem] flex-col gap-4 rounded-xl p-6 dark:bg-primary-800">
              <h1 className="text-center font-semibold text-primary-200">
                Edit Information
              </h1>
              <Input
                label="Name:"
                type="text"
                name="displayName"
                id="name"
                value={editValues.displayName}
                setValue={setEditValues}
                placeholder="Display name"
              />
              <Input
                label="About:"
                type="text"
                name="about"
                id="about"
                value={editValues.about}
                setValue={setEditValues}
                placeholder="About"
              />
              <Button handleClick={() => setShowEditModal(false)}>Save</Button>
            </div>
          </Modal>
        )}
        {showDeletePrompt && (
          <Modal
            closeModal={() =>
              !deletingUser ? setShowDeletePrompt(false) : null
            }
          >
            <div className="min-w-[20rem] rounded-xl p-6 text-center dark:bg-primary-800">
              <BsFillExclamationCircleFill
                size="50"
                className="mx-auto mb-2 block text-red-800"
              />
              <h3 className="mb-4 text-center font-semibold leading-relaxed text-primary-200">
                This action will delete account <br /> permanently. Are you
                sure?
              </h3>
              <h3 className="mt-2 text-center font-semibold text-primary-200 "></h3>
              <div className="flex gap-4">
                <Button
                  disabled={deletingUser}
                  handleClick={() =>
                    deletingUser ? null : setShowDeletePrompt(false)
                  }
                  additionClasses="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  disabled={deletingUser}
                  handleClick={() =>
                    deletingUser ? null : deleteUserAccount()
                  }
                  additionClasses="flex-1"
                >
                  {deletingUser ? "Deleting..." : "I'm sure"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default Profile;
