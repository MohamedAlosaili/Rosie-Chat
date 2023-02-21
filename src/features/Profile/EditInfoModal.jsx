import { memo, useContext, useState } from "react";
import PropTypes from "prop-types";

import { TbEdit } from "react-icons/tb";
import { AnimatePresence } from "framer-motion";
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  doc,
  where,
  writeBatch,
} from "firebase/firestore";

import useValidateFile from "hooks/useValidateFile";
import useUploadFile from "hooks/useUploadFile";
import useError from "hooks/useError";
import Input from "components/Input";
import Modal from "components/Modal";
import InputFile from "components/InputFile";
import StatusMessage from "components/StatusMessage";
import { UserContext } from "context/UserContext";
import { db } from "rosie-firebase";

function EditInfoModal({ setShowEditModal }) {
  const { currentUser } = useContext(UserContext);

  const [fileUploader] = useUploadFile("photoURL");
  const [file, changeFile, invalidFile] = useValidateFile();

  const { displayName, about, photoURL } = currentUser;
  const [editValues, setEditValues] = useState({ displayName, about });
  const [updateUserInfoLoading, setUpdateUserInfoLoading] = useState(false);
  const [updateUserInfoError, setUpdateUserInfoError] = useError();

  async function updateUserInfo() {
    if (editValues.displayName === "") {
      setUpdateUserInfoError("Name can't be empty!");
      return;
    } else if (editValues.displayName.length > 64) {
      setUpdateUserInfoError("Name is too long. Choose shorter one");
      return;
    }
    if (
      editValues.displayName === currentUser.displayName &&
      editValues.about === currentUser.about &&
      !file.validFile
    ) {
      setUpdateUserInfoError("Nothing change in your info");
      return;
    }

    try {
      const { displayName, about } = editValues;

      let newValues = {};

      if (displayName !== currentUser.displayName)
        newValues.displayName = displayName;
      if (about !== currentUser.about) newValues.about = about;
      if (
        displayName === currentUser.displayName &&
        about === currentUser.about
      )
        newValues = null;

      setUpdateUserInfoLoading(true);
      setUpdateUserInfoError(undefined);

      const batch = writeBatch(db);
      const currentUserRef = doc(db, "users", currentUser.uid);

      let photoURL;
      if (file.validFile) {
        photoURL = (await fileUploader(file.validFile, currentUser.uid)).url;
        const info = newValues ? newValues : {};
        await batch.update(currentUserRef, {
          photoURL,
          ...info,
        });
      } else if (newValues) {
        await batch.update(currentUserRef, {
          ...newValues,
        });
      }

      if (newValues?.displayName || photoURL) {
        const newDisplayName = newValues?.displayName
          ? { name: displayName }
          : {};
        const newPhotoURL = photoURL ? { photoURL } : {};
        const newUserInfo = { ...newDisplayName, ...newPhotoURL };

        await updateMessagesDocs(newUserInfo, batch);
        await updateChatsDocs(newUserInfo, batch);
      }

      batch.commit();
      setUpdateUserInfoLoading(false);
      setShowEditModal(false);
    } catch (error) {
      console.log(error);
      setUpdateUserInfoError(typeof error === "object" ? error.message : error);
      setUpdateUserInfoLoading(false);
    }
  }

  async function updateMessagesDocs(newUserInfo, batch) {
    const senderName = newUserInfo?.name
      ? { senderName: newUserInfo.name }
      : {};
    const senderPhotoURL = newUserInfo?.photoURL
      ? { senderPhotoURL: newUserInfo.photoURL }
      : {};

    const messagesRef = collectionGroup(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("isGroupMessage", "==", true),
      where("senderId", "==", currentUser.uid)
    );
    const messages = await getDocs(messagesQuery);

    messages.forEach(async (doc) => {
      await batch.update(doc.ref, {
        ...senderName,
        ...senderPhotoURL,
      });
    });
  }

  async function updateChatsDocs(newUserInfo, batch) {
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      where("isGroup", "==", false)
    );
    const chats = await getDocs(chatsQuery);

    chats.forEach(async (chat) => {
      await batch.update(chat.ref, {
        [currentUser.uid]: { ...chat.data()[currentUser.uid], ...newUserInfo },
      });
    });
  }

  return (
    <>
      <AnimatePresence>
        {(invalidFile || updateUserInfoError) && (
          <StatusMessage
            type="error"
            message={invalidFile ?? updateUserInfoError}
          />
        )}
        {updateUserInfoLoading && (
          <StatusMessage type="loading" message="Updating info..." />
        )}
      </AnimatePresence>
      <Modal
        kay="EditInfoModal"
        closeModal={() =>
          updateUserInfoLoading ? null : setShowEditModal(false)
        }
        actionButtonName={updateUserInfoLoading ? "Updating..." : "Update"}
        actionButtonHandler={() =>
          updateUserInfoLoading ? null : updateUserInfo()
        }
        className="min-w-[20rem]"
        modalTitle={{ text: "Edit Information" }}
      >
        <InputFile
          changeFile={changeFile}
          img={{ url: file.previewUrl || photoURL, name: displayName }}
          loading={updateUserInfoLoading}
          isPreviewUrl={file.previewUrl !== ""}
          className="self-center"
        />
        <Input
          label="Name"
          type="text"
          name="displayName"
          disabled={updateUserInfoLoading}
          value={editValues.displayName}
          setValue={setEditValues}
          placeholder="Display name"
        />
        <Input
          label="About"
          type="text"
          name="about"
          disabled={updateUserInfoLoading}
          value={editValues.about}
          setValue={setEditValues}
          placeholder="About"
        />
      </Modal>
    </>
  );
}

EditInfoModal.propTypes = {
  setShowEditModal: PropTypes.func,
};

export default memo(EditInfoModal);
