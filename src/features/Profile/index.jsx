import { useContext, useState } from "react"

import { AnimatePresence } from "framer-motion"
import { BsFillExclamationCircleFill, BsFillTrashFill } from "react-icons/bs"
import { TbEdit } from "react-icons/tb"
import { useDeleteUser } from "react-firebase-hooks/auth"

import { UserContext } from "hooks/context"
import { StatusMessage, Image, Input, Button, Modal } from "components"
import { auth } from "rosie-firebase"

function Profile() {
    const { uid, displayName, photoURL, email, about, joinedOn } = useContext(UserContext)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeletePrompt, setShowDeletePrompt] = useState(false)
    const [editValues, setEditValues] = useState({ displayName, about })
    const [deleteUser, deletingUser, deletingUserError] = useDeleteUser(auth)

    const joinedDate = `${joinedOn.toDate()}`.slice(0, 24)

    function deleteUserAccount() {
        if (auth.currentUser)
            deleteUser(auth.currentUser)
                .then()
    }

    return (
        <>
            <AnimatePresence>
                {deletingUserError && (
                    <StatusMessage type="error" message={deletingUserError?.code} />
                )}
            </AnimatePresence>
            <div className="flex flex-col gap-4 mt-4">
                <Image
                    img={{ url: photoURL, name: displayName }}
                    className="rounded-full w-24 mx-auto mb-3"
                />
                <h3 className="text-primary-300 font-semibold text-center">{displayName}</h3>
                <div className="flex flex-col gap-2 border-b border-t dark:border-primary-700 py-4">
                    <p><span className="dark:text-primary-200">About:</span> {about || "Write something about your self"}</p>
                    <h4><span className="dark:text-primary-200">Email:</span> {email}</h4>
                    <p><span className="dark:text-primary-200">Joined on:</span> {joinedDate}</p>
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
                        <div className="flex flex-col gap-4 p-6 rounded-xl min-w-[20rem] dark:bg-primary-800">
                            <h1 className="text-primary-200 font-semibold text-center">Edit Information</h1>
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
                    <Modal closeModal={() => !deletingUser ? setShowDeletePrompt(false) : null}>
                        <div className="p-6 rounded-xl min-w-[20rem] text-center dark:bg-primary-800">
                            <BsFillExclamationCircleFill size="50" className="block mx-auto mb-2 text-red-800" />
                            <h3 className="text-primary-200 font-semibold text-center mb-4 leading-relaxed">
                                This action will delete account <br /> permanently. Are you sure?
                            </h3>
                            <h3 className="text-primary-200 font-semibold text-center mt-2 "></h3>
                            <div className="flex gap-4">
                                <Button
                                    disabled={deletingUser}
                                    handleClick={() => deletingUser ? null : setShowDeletePrompt(false)}
                                    additionClasses="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={deletingUser}
                                    handleClick={() => deletingUser ? null : deleteUserAccount()}
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
    )
}

export default Profile