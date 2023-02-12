import { memo, useContext } from "react";
import PropTypes from "prop-types";

import { useDeleteUser } from "react-firebase-hooks/auth";
import { BsFillExclamationCircleFill } from "react-icons/bs";

import StatusMessage from "components/StatusMessage";
import Modal from "components/Modal";
import { auth } from "rosie-firebase";
import { UserContext } from "context/UserContext";

function DeletePrompt({ setShowDeletePrompt, userInfo }) {
  const { deleteUserAccount } = useContext(UserContext);
  const [deleteUser, deleteUserLoading, deleteUserError] = useDeleteUser(auth);

  const fullName = userInfo.displayName;
  const shortName = fullName.slice(0, fullName.indexOf(" "));
  return (
    <>
      {deleteUserLoading && (
        <StatusMessage
          type="loading"
          message={`Deleting ${shortName} account...`}
        />
      )}
      {deleteUserError && (
        <StatusMessage type="error" message={deleteUserError?.code} />
      )}
      <Modal
        closeModal={() =>
          !deleteUserLoading ? setShowDeletePrompt(false) : null
        }
        actionButtonHandler={() =>
          deleteUserLoading ? null : deleteUserAccount(deleteUser)
        }
        actionButtonName={deleteUserLoading ? "Deleting..." : "I'm sure"}
        className="flex min-w-[20rem] flex-col gap-4 text-center"
      >
        <BsFillExclamationCircleFill
          size="50"
          className="mx-auto block text-red-800"
        />
        <h3 className="text-center font-semibold leading-relaxed text-primary-200">
          This action will delete your account <br /> permanently. Are you sure?
        </h3>
      </Modal>
    </>
  );
}

DeletePrompt.propTypes = {
  setShowDeletePrompt: PropTypes.func,
};

export default memo(DeletePrompt);
