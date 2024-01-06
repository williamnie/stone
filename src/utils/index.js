import { verify, hash } from '@node-rs/argon2'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

import { jwtConfig } from '../config/user.js'

const genHash = async (string) => {
    return await hash(string)
}

const compare = async (hash, originString) => {
    return await verify(hash, originString)
}

const genToken = (userInfo) => {
    return jwt.sign(userInfo, jwtConfig?.secretKey, { expiresIn: jwtConfig?.expiresIn });
}

const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig?.secretKey)
}

const uuid = (prefix) => {
    return `${prefix || 'id'}-${nanoid()}`
}


const helper = {
    genHash, compare, genToken, verifyToken, uuid
}

export default helper