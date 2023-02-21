import { memo, useState } from "react";
import PropTypes from "prop-types";

import { HiUserGroup } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import { query, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import useError from "hooks/useError";
import useUploadFile from "hooks/useUploadFile";
import useValidateFile from "hooks/useValidateFile";
import Modal from "components/Modal";
import Input from "components/Input";
import Image from "components/Image";
import SkeletonLoader from "components/SkeletonLoader";
import Button from "components/Button";
import StatusMessage from "components/StatusMessage";
import InputFile from "components/InputFile";
import { db } from "rosie-firebase";

function EditGroupInfoModal({
  setShowGroupInfoModal,
  selectedChat,
  currentUser,
  changeChat,
}) {
  const [fileUploader] = useUploadFile("photoURL");
  const [file, changeFile, invalidFile] = useValidateFile();

  const [updateGroupInfoLoading, setUpdateGroupInfoLoading] = useState(false);
  const [updateGroupInfoError, setUpdateGroupInfoError] = useError();

  const [groupInfo, setGroupInfo] = useState({
    name: selectedChat.chatInfo.name,
  });
  const [membersList, setMembersList] = useState(selectedChat.members);

  const [showNewMembersBox, setShowNewMembersBox] = useState(false);

  const usersQuery = query(collection(db, "users"));
  const [usersList, usersListLoading, usersListError] =
    useCollectionDataOnce(usersQuery);

  const currentMembers = usersList?.filter((user) =>
    membersList.includes(user.uid)
  );

  const friendsNotMembers = usersList?.filter(
    (user) =>
      currentUser.friends.includes(user.uid) && !membersList.includes(user.uid)
  );

  async function updateGroupInfo() {
    if (groupInfo.name.trim() === "") {
      setUpdateGroupInfoError("Group name cannot be blank.");
      return;
    }

    const membersNotChanged =
      membersList.every((memberId) =>
        selectedChat.members.includes(memberId)
      ) && membersList.length === selectedChat.members.length;
    const nameNotChanged = groupInfo.name.trim() === selectedChat.chatInfo.name;

    if (nameNotChanged && !file.validFile && membersNotChanged) {
      setShowGroupInfoModal(false);
      return;
    }
    setUpdateGroupInfoError(undefined);
    setUpdateGroupInfoLoading(true);
    try {
      const fieldsToBeUpdated = {};
      if (file.validFile) {
        fieldsToBeUpdated["chatInfo.photoURL"] = (
          await fileUploader(file.validFile, selectedChat.id)
        ).url;
      }
      if (!nameNotChanged) fieldsToBeUpdated["chatInfo.name"] = groupInfo.name;
      if (!membersNotChanged) fieldsToBeUpdated.members = membersList;

      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, { ...fieldsToBeUpdated });
      const updateCurrentChat = (await getDoc(chatRef)).data();

      changeChat(updateCurrentChat);
      setUpdateGroupInfoLoading(false);
      setShowGroupInfoModal(false);
    } catch (error) {
      console.log(error);
      setUpdateGroupInfoError(
        typeof error === "object" ? error.message : error
      );
      setUpdateGroupInfoLoading(false);
    }
  }

  function toggleMember(memberId) {
    if (membersList.length === 10 && !membersList.includes(memberId)) {
      setUpdateGroupInfoError("Oops, You can't add more than 10 members");
      return;
    }

    setMembersList((prevMembers) => {
      if (prevMembers.includes(memberId)) {
        return prevMembers.filter((mId) => mId !== memberId);
      } else {
        return [...prevMembers, memberId];
      }
    });
  }

  const membersListElements = (arrOfMembers, isCurrentMembers = false) =>
    arrOfMembers?.map((member) => (
      <div
        key={member.uid}
        className="flex items-center gap-2 px-4 py-2 dark:hover:bg-primary-700/75"
      >
        <Image
          img={{ url: member.photoURL, name: member.displayName }}
          className="aspect-square w-12 rounded-full"
        />
        <h3 className="mr-auto">{member.displayName}</h3>
        {member.uid !== currentUser.uid &&
          (isCurrentMembers ? (
            <MdOutlineRemoveCircle
              size={18}
              className="cursor-pointer text-red-600"
              title="Remove from group"
              onClick={() =>
                updateGroupInfoLoading ? null : toggleMember(member.uid)
              }
            />
          ) : (
            <BsCheckCircleFill
              size={16}
              className="cursor-pointer text-accent"
              title="Add to group"
              onClick={() =>
                updateGroupInfoLoading ? null : toggleMember(member.uid)
              }
            />
          ))}
      </div>
    ));

  return (
    <>
      <AnimatePresence>
        {(usersListError || invalidFile || updateGroupInfoError) && (
          <StatusMessage
            type="error"
            message={usersListError ?? invalidFile ?? updateGroupInfoError}
          />
        )}
      </AnimatePresence>
      <Modal
        closeModal={() =>
          updateGroupInfoLoading ? null : setShowGroupInfoModal(false)
        }
        actionButtonName={updateGroupInfoLoading ? "Updating..." : "Update"}
        actionButtonHandler={() =>
          updateGroupInfoLoading ? null : updateGroupInfo()
        }
        modalTitle={{ text: "Group Info", icon: <HiUserGroup /> }}
      >
        <div className="flex items-center gap-4">
          <InputFile
            changeFile={changeFile}
            loading={updateGroupInfoLoading}
            img={{
              url: file.previewUrl || selectedChat.chatInfo.photoURL,
              ...groupInfo,
            }}
            isPreviewUrl={file.previewUrl !== ""}
          />
          <Input
            label="Group name"
            type="text"
            name="name"
            disabled={updateGroupInfoLoading}
            value={groupInfo.name}
            setValue={setGroupInfo}
            placeholder="e.g. My friends 💖"
          />
        </div>
        <div>
          <h2 className="mb-2 flex justify-between font-medium">
            Members <span>{membersList.length} / 10</span>
          </h2>
          <div className="no-scrollbar relative h-32 overflow-y-auto overflow-x-hidden rounded-xl border-2 dark:border-primary-700">
            {usersListLoading || !usersList ? (
              <SkeletonLoader.Div height="100%" borderRadius={0} />
            ) : (
              membersListElements(currentMembers, true)
            )}
          </div>
        </div>
        {!showNewMembersBox && (
          <Button
            onClick={() => setShowNewMembersBox(true)}
            disabled={updateGroupInfoLoading}
          >
            Add members
          </Button>
        )}
        {showNewMembersBox && (
          <div>
            <h2 className="mb-2 flex justify-between font-medium">
              Add Members
            </h2>
            <div className="no-scrollbar relative h-32 overflow-y-auto overflow-x-hidden rounded-xl border-2 dark:border-primary-700">
              {friendsNotMembers?.length > 0 ? (
                membersListElements(friendsNotMembers)
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center">
                  <p className="mb-2 w-full px-2">
                    Oops, it looks like all your friends are already members of
                    this group. To add more friends, please go to the Contacts
                    tab.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

EditGroupInfoModal.propTypes = {
  setShowGroupInfoModal: PropTypes.func,
};

export default memo(EditGroupInfoModal);
