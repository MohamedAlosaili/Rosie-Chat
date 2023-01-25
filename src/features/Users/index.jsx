import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, orderBy, query } from "firebase/firestore"
import { AiOutlineUserAdd, AiOutlineLoading3Quarters } from "react-icons/ai"

import { db } from "rosie-firebase"
import { Button } from "components"

function Users() {

    const q = query(collection(db, "users"), orderBy("displayName"))
    const [users, usersLoading, usersError] = useCollectionData(q)

    const appUsers = users?.map(user => {
        return (
            <div className="transition flex items-center gap-2 p-4 rounded-xl dark:hover:bg-primary-800" >
                <img src={user.photoURL} alt={`${user.displayName} photo`} className="w-16" />
                <div className="mr-auto">
                    <h3 className="dark:text-primary-200 font-semibold">{user.displayName}</h3>
                    {user.about && <p>{user.about}</p>}
                </div>
                <Button>
                    <AiOutlineUserAdd />
                </Button>
            </div>
        )
    })

    return (
        <div className="flex flex-col gap-4">
            <h1 className="dark:text-primary-200 text-2xl font-semibold">Users</h1>
            {appUsers
                ? appUsers
                : (
                    <div className="flex items-center gap-2 justify-center mt-4 dark:text-primary-200">
                        <AiOutlineLoading3Quarters size={20} className="animate-spin" />
                        Loading Users...
                    </div>
                )
            }
        </div>
    )
}

export default Users