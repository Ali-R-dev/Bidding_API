import User from '../models/user'

export const getUser = async (filter) => {

    const res = await User.find(filter)
    return res;

}

export const create = async (userObj) => {
    console.log(userObj);
    let newUser = new User({
        ...userObj
    })
    const res = await newUser.save();
    return res
}