const { MongoClient } = require("mongodb");
const connectionString = "mongodb://localhost:27017"
const client = new MongoClient(connectionString)

const dbName = "mongo_hw";

async function main() {
    
    await insertCategory('zorrobicho')
    await insertCategory('sumama')
    await updateCategory(3, 'Clothes')
    await readCategory()
    await deleteCategory(4)


    return 'done.';
}

// CRUDS

async function insertCategory(p_name){
    await client.connect()
    const db = client.db(dbName)
    
    const category = db.collection('category')

    const  read_index = await category.find({}).sort({"category_id": -1}).limit(1).toArray()
    const highestIndex = read_index[0].category_id
    console.log("##############INDEX:"+highestIndex)

    const document = {
        category_id: highestIndex+1,
        name: p_name
    }

    const insert_query = await category.insertOne(document)
    console.log(`A document was inserted with the _id: ${insert_query.insertedId}`)



    client.close()

}

async function updateCategory(p_categoryId, p_name){
    await client.connect()
    const db = client.db(dbName)
    
    const category = db.collection('category')

    const filter = {
        category_id: p_categoryId 
    }

    const updateDocument = {
        $set: {
            name: p_name
        }
    }

    const update_query = await category.updateOne(filter, updateDocument)
    console.log(`A document was updated with the _id: ${update_query.upsertedId}`)

    client.close()
}

async function readCategory(){
    await client.connect()
    const db = client.db(dbName)
    const category = db.collection('category')

    const read_query = await category.find({}).toArray()
    console.log(read_query)

    client.close()

}

async function deleteCategory(p_categoryId){
    await client.connect()
    const db = client.db(dbName)
    
    const category = db.collection('category')

    const deleteDocument = {
        category_id: p_categoryId
    }

    const delete_query = await category.deleteOne(deleteDocument)
    console.log(`${delete_query.deletedCount} document has been removed`)

    client.close()

}




main()