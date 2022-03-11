import { create, getUser } from '../DAL/userDbOperations'

export const getUserByCred = async (userObj) => {

    try {

        let { userId, role } = userObj
        if (!userId) return Promise.reject({ msg: "provide a valid userId" })

        const filter = {
            userId: userId, role: role
        }
        const res = getUser(filter)
        return res;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }
}


export const getUserById = async () => {

}

export const getAllUsers = async () => {

    try {
        const res = getUser()
        return res;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }
}

export const createUser = async (userObj) => {

    try {

        if (!userObj) Promise.reject({ msg: "provide a user" })

        let { userId, userName, role } = userObj
        console.log(userId, userName, role);
        if (!userId || !userName) Promise.reject({ msg: "provide valid userId and name" })

        if (!role) role === 'REG'

        const res = await create({ userId, userName, role })
        return res;

    } catch (error) {
        const { message } = error
        return Promise.reject({ msg: message })
    }

}