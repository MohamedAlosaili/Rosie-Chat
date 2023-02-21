import { memo, useState } from "react";
import PropTypes from "prop-types";

import { HiUserGroup } from "react-icons/hi";
import { BsCheckCircleFill, BsFillPersonPlusFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";
import { AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  serverTimestamp,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { nanoid } from "nanoid";

import useValidateFile from "hooks/useValidateFile";
import useUploadFile from "hooks/useUploadFile";
import useError from "hooks/useError";
import Modal from "components/Modal";
import Input from "components/Input";
import Image from "components/Image";
import Button from "components/Button";
import StatusMessage from "components/StatusMessage";
import InputFile from "components/InputFile";
import SkeletonLoader from "components/SkeletonLoader";
import { db } from "rosie-firebase";

function NewGroupModal({
  setTap,
  setShowNewGroupModal,
  currentUserId,
  currentUserFriends,
}) {
  const [file, changeFile, invalidFile] = useValidateFile();
  const [fileUploader] = useUploadFile("photoURL");

  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [createGroupError, setCreateGroupError] = useError();

  const [groupInfo, setGroupInfo] = useState({ name: "" });
  const [membersList, setMembersList] = useState([currentUserId]);

  const membersQuery = query(
    collection(db, "users"),
    where("uid", "in", [...currentUserFriends, ""]) // empty Item prevent this error "Invalid Query. A non-empty array is required for 'in' filters."
  );
  const [usersList, usersListLoading, usersListError] =
    useCollectionDataOnce(membersQuery);

  async function createNewGroup() {
    if (groupInfo.name.trim() === "") {
      setCreateGroupError("Group name cannot be blank.");
      return;
    }
    if (membersList.length < 3) {
      setCreateGroupError("Group must have at least 3 members.");
      return;
    }
    if (membersList.length > 10) {
      setCreateGroupError("Group members cannot be over 10.");
      return;
    }
    if (!file.validFile) {
      setCreateGroupError("Please upload an image for the group.");
      return;
    }

    setCreateGroupLoading(true);
    setCreateGroupError(undefined);
    try {
      const id = nanoid();

      const { url: photoURL } = await fileUploader(file.validFile, id);

      const chat = {
        id,
        chatInfo: { ...groupInfo, photoURL },
        isGroup: true,
        lastMsg: {
          message: "Group created",
          createdAt: serverTimestamp(),
        },
        members: membersList,
        admin: currentUserId,
      };

      const chatRef = doc(db, "chats", id);
      await setDoc(chatRef, chat);

      setCreateGroupLoading(false);
      setShowNewGroupModal(false);
    } catch (error) {
      console.log(error);
      setCreateGroupError(typeof error === "object" ? error.message : error);
      setCreateGroupLoading(false);
    }
  }

  function toggleMember(memberId) {
    setMembersList((prevMembers) => {
      if (prevMembers.includes(memberId)) {
        return prevMembers.filter((mId) => mId !== memberId);
      } else {
        return [...prevMembers, memberId];
      }
    });
  }

  const membersListElements = usersList?.map((member) => (
    <div
      key={member.uid}
      onClick={() => (createGroupLoading ? null : toggleMember(member.uid))}
      className="flex cursor-pointer items-center gap-2 px-4 py-2 dark:hover:bg-primary-700/75"
    >
      <Image
        img={{ url: member.photoURL, name: member.displayName }}
        className="aspect-square w-12 rounded-full"
      />
      <h3 className="mr-auto">{member.displayName}</h3>
      {membersList.includes(member.uid) && (
        <BsCheckCircleFill className="text-accent" />
      )}
    </div>
  ));

  return (
    <>
      <AnimatePresence>
        {(usersListError || invalidFile || createGroupError) && (
          <StatusMessage
            type="error"
            message={usersListError ?? invalidFile ?? createGroupError}
          />
        )}
      </AnimatePresence>
      <Modal
        closeModal={() =>
          createGroupLoading ? null : setShowNewGroupModal(false)
        }
        actionButtonName={createGroupLoading ? "Creating..." : "Create"}
        actionButtonHandler={() =>
          createGroupLoading ? null : createNewGroup()
        }
        className="text-sm dark:text-primary-200"
        modalTitle={{ text: "New Group", icon: <HiUserGroup /> }}
      >
        <div className="flex items-center gap-4">
          <InputFile
            changeFile={changeFile}
            img={{ url: file.previewUrl, ...groupInfo }}
            loading={createGroupLoading}
            isPreviewUrl={file.previewUrl !== ""}
          />
          <Input
            label="Group name"
            type="text"
            name="name"
            disabled={createGroupLoading}
            value={groupInfo.name}
            setValue={setGroupInfo}
            placeholder="e.g. My friends 💖"
          />
        </div>
        <div>
          <h2 className="mb-2 flex justify-between">
            Add Members <span>{membersList.length} / 10</span>
          </h2>
          <div className="no-scrollbar relative h-52 overflow-y-auto overflow-x-hidden rounded-xl border-2 dark:border-primary-700">
            {usersListLoading || !usersList ? (
              <SkeletonLoader.Div height="100%" borderRadius={0} />
            ) : usersList?.length > 0 ? (
              membersListElements
            ) : (
              <div className="absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2">
                <p className="mb-2">You don't have any friends</p>{" "}
                <Button className="w-full" onClick={() => setTap("contacts")}>
                  Add friends <BsFillPersonPlusFill size={20} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

NewGroupModal.propTypes = {
  setTap: PropTypes.func,
  setShowNewGroupModal: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
  currentUserFriends: PropTypes.array,
};

export default memo(NewGroupModal);
