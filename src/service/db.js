
const coreKey = {
    '_routerConfig': 1
}

const createSubLeavel = async (ctx, payload) => {
    const { name } = payload
    return ctx.db.sublevel(name, { valueEncoding: 'json' })
}


const createData = async (ctx, payload) => {
    const { data, dbName } = payload

    let db = ctx.db
    if (dbName) {
        db = ctx.db.sublevel(dbName)
    }
    if (Array.isArray(data)) {
        const dbData = []
        data.forEach((ele) => {
            const { key = '', value = '' } = ele || {}
            if (!coreKey[key] && key) {
                const item = {
                    type: 'put',
                    key: key,
                    value: value,
                }
                if (dbName) {
                    item['sublevel'] = dbName
                }
                if (typeof item.key !== 'undefined') {
                    dbData.push(item)
                }
            }
        })
        return db.batch(dbData)
    } else {
        const { key = '', value = '' } = data || {}
        if (coreKey[key] || !key) {
            return false
        }
        return db.put(key, value)
    }
}

const getData = async (ctx, payload) => {
    const { key, dbName } = payload

    console.log('payload',payload);
    let db = ctx.db
    let result = undefined
    if (coreKey[key] || !key) {
        return null
    }
    if (dbName) {
        db = ctx.db.sublevel(dbName)
    }
    try {
        if (Array.isArray(key)) {
            result = await db.getMany(key)
        } else {
            result = await db.get(key)
        }
    } catch (error) {

    }
    return result
}

const deleteData = async (ctx, payload) => {
    const { key, dbName } = payload
    let db = ctx.db
    if (dbName) {
        db = ctx.db.sublevel(dbName)
    }
    if (coreKey[key] || !key) {
        return false
    }
    if (Array.isArray(key)) {
        const manyDel = key.map((item) => {
            return { type: 'del', key: item }
        })
        return db.batch(manyDel)
    } else {
        return db.del(key)
    }
}

/**
 * 
 * const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter((number) => number % 2 === 0);
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = [];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenNumbers.push(numbers[i]);
  }
}

 */
const getAllKV = async (ctx) => {
    try {
        let keys = await ctx.db.keys().all()
        keys = keys.filter((key) => { return !coreKey[key] })
        return { code: 0, data: { list: keys }, message: '' }
    } catch (error) {
        return { code: 0, data: { list: [], }, message: error.message }
    }
}





export { createSubLeavel, getData, createData, deleteData, getAllKV }
