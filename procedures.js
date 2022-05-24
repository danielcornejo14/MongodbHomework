const { MongoClient } = require("mongodb");
const connectionString = "mongodb://localhost:27017"
const client = new MongoClient(connectionString)

const dbName = "mongo_hw";



// ##############################################CRUDS

//---------------------------------------Category

/**
 * Connects to a database and inserts a new category document
 * @param {string} p_name 
 */
async function insertCategory(p_name){

    await client.connect() //database conection
    const db = client.db(dbName) //database especification
    
    const category = db.collection('category')//collection especification

    const  read_index = await category.find({}).sort({"category_id": -1}).limit(1).toArray()//gets highest index document
    let highestIndex = read_index[0].category_id//extracts the highest index

    //creates a new javaScrip object that will be inserted as a document in the collection
    const newDocument = {
        category_id: highestIndex+1,
        name: p_name
    }

    const insert_query = await category.insertOne(newDocument)// use the .insertOne() function to insert a object
    console.log(`A document was inserted with the _id: ${insert_query.insertedId}`)

    client.close()//close conection with the database

}
/**
 * selects all documents in a collection
 * @returns {void}
 */
async function readCategory(){
    await client.connect()
    const db = client.db(dbName)
    const category = db.collection('category')

    const read_query = await category.find({}).toArray()// use the .find() function to query all documents
    console.log(read_query)

    client.close()

}
/**
 * updates a document that matches the category_id with p_categoryId
 * @param {int} p_categoryId 
 * @param {string} p_name 
 */
async function updateCategory(p_categoryId, p_name){
    await client.connect()
    const db = client.db(dbName)
    
    const category = db.collection('category')

    // a javaScrip object that is used as filter to find the document to update
    const filter = {
        category_id: p_categoryId 
    }

    //the new parameters that the document will have
    const updateDocument = {
        $set: {
            name: p_name
        }
    }

    const update_query = await category.updateOne(filter, updateDocument)// uses the .updateOne() function to update a document
    console.log(`A document was updated with the _id: ${update_query.upsertedId}`)

    client.close()
}
/**
 * deletes a document that matches the category_id with p_categoryId
 * @param {int} p_categoryId 
 */
async function deleteCategory(p_categoryId){
    await client.connect();
    const db = client.db(dbName);
    
    const category = db.collection('category');

    //a javaScript object used to find the document to delete
    const deleteDocument = {
        category_id: p_categoryId
    };

    const delete_query = await category.deleteOne(deleteDocument);// uses the .delteOne()funciton to delete a document in the collection
    console.log(`${delete_query.deletedCount} document has been removed`);

    client.close();

}
//---------------------------------------Customer

/**
 * Insert new customer in customer collection
 * @param {string} p_name 
 * @param {Array<string>} p_phone 
 * @param {Array<string>} p_card 
 * @param {string} p_province 
 * @param {string} p_canton 
 * @param {string} p_district 
 * @param {string} p_street 
 */
async function insertCustomer(p_name, p_phone, p_card, p_province, p_canton, p_district, p_street){
    await client.connect()
    const db = client.db(dbName)
    
    const customer = db.collection('customer')

    const  read_index = await customer.find({}).sort({"customer_id": -1}).limit(1).toArray()
    let highestIndex = read_index[0].customer_id

    //has an array of embeded directions
    const newDocument = {
        customer_id: highestIndex+1,
        name: p_name,
        phone: p_phone,
        card: p_card,
        direction: [
            {
                province: p_province,
                canton: p_canton,
                district: p_district,
                street: p_street
            }
        ]
    }

    console.log(newDocument)

    const insert_query = await customer.insertOne(newDocument)
    console.log(`A document was inserted with the _id: ${insert_query.insertedId}`)

    client.close();

};
/**
 * selects all documents in Customer collection
 */
async function readCustomer(){
    await client.connect();
    const db = client.db(dbName)

    const customer = db.collection('customer')

    const read_query = await customer.find({}).toArray()
    console.log(read_query)

    client.close()
};
/**
 * updates the customer that matches the customer_id with the p_customerId
 * and the entry of phone, card and direction using the specified index
 * in p_phoneIndx, p_cardIndx, p_dirIndx 
 * @param {int} p_customerId 
 * @param {string} p_name 
 * @param {int} p_phoneIndx 
 * @param {string} p_phone 
 * @param {int} p_cardIndx 
 * @param {string} p_card 
 * @param {int} p_dirIndx 
 * @param {string} p_province 
 * @param {string} p_canton 
 * @param {string} p_district 
 * @param {string} p_street 
 */
async function updateCustomer(p_customerId, p_name, p_phoneIndx, p_phone, p_cardIndx, p_card, p_dirIndx, p_province, p_canton, p_district, p_street){
    await client.connect()
    const db = client.db(dbName)
    
    const customer = db.collection('customer')

    const filter = {
        customer_id: p_customerId 
    }

    const updateDocument = {
        $set:{
            name: p_name,
            [`phone.${p_phoneIndx}`]: p_phone,
            [`card.${p_cardIndx}`]: p_card,
            [`direction.${p_dirIndx}.province`]: p_province,
            [`direction.${p_dirIndx}.canton`]: p_canton,
            [`direction.${p_dirIndx}.district`]: p_district,
            [`direction.${p_dirIndx}.street`]: p_street
        }
    }

    const update_query = await customer.updateOne(filter, updateDocument)
    console.log(`A document was updated with the _id: ${update_query.upsertedId}`)

    client.close()
};
/**
 * deletes a document that matches the customer_id with p_customerId
 * @param {int} p_customerId 
 */
async function deleteCustomer(p_customerId){
    await client.connect()
    const db = client.db(dbName)
    
    const customer = db.collection('customer')

    const deleteDocument = {
        customer_id: p_customerId
    };

    const delete_query = await customer.deleteOne(deleteDocument);
    console.log(`${delete_query.deletedCount} document has been removed`);

    client.close();
};

//---------------------------------------Product

/**
 * Inserts a product in the product collection making shure that a specified category exists
 * @param {string} p_name 
 * @param {int} p_category 
 * @param {string} p_brand 
 * @param {string} p_description 
 * @param {int} p_inventory 
 * @param {int} p_price 
 * @returns void
 */
async function insertProduct(p_name, p_category, p_brand, p_description, p_inventory, p_price){
    await client.connect()
    const db = client.db(dbName)

    const product = db.collection('product')
    const category = db.collection('category')

    const  readIndex = await product.find({}).sort({"product_id": -1}).limit(1).toArray()
    const highestIndex = readIndex[0].product_id

    
    const verifyCategoryQuery = await category.find({category_id: p_category}).toArray()// querys the specified category using .find() and p_category
    let categoryVerification = verifyCategoryQuery.length > 0;// a bool used to verify the truthfulness of the category verification

    if(categoryVerification){
        const newDocument = {
            product_id: highestIndex+1,
            name: p_name,
            category: p_category,
            brand: p_brand,
            description: p_description,
            inventory: p_inventory,
            price: p_price
        }

        const insert_query = await product.insertOne(newDocument)
        console.log(`A document was inserted with the _id: ${insert_query.insertedId}`)

        client.close()
        return
        
    }
    else{
        console.log("please verify that the category exists")
        client.close();
        return
    }
}; 

/**
 * selects all the documents in the Product collectioon
 * @returns void
 */
async function readProduct(){
    await client.connect()
    const db = client.db(dbName)
    
    const product = db.collection('product')

    const read_query = await product.find({}).toArray()
    console.log(read_query)

    client.close();
    return
};

/**
 * updates the characteristics of a product that matches product_id with p_productId
 * @param {int} p_productId 
 * @param {string} p_name 
 * @param {int} p_category 
 * @param {string} p_brand 
 * @param {string} p_description 
 * @param {int} p_inventory 
 * @param {int} p_price 
 * @returns void
 */
async function updateProduct(p_productId, p_name, p_category, p_brand, p_description, p_inventory, p_price){
    await client.connect()
    const db = client.db(dbName)
    
    const product = db.collection('product')
    const category = db.collection('category')

    const filter = {
        product_id: p_productId
    }

    const verifyCategoryQuery = await category.find({category_id: p_category}).toArray()
    const categoryVerification = verifyCategoryQuery.length > 0


    if(categoryVerification){
        const updateDocument = {
            $set:{
                name: p_name,
                category: p_category,
                brand: p_brand,
                description: p_description,
                inventory: p_inventory,
                price: p_price
            }
        }

        const update_query = await product.updateOne(filter, updateDocument)
        console.log(`A document was updated with the _id: ${update_query.upsertedId}`)

        client.close();
        return

    }
    
    else{
        console.log("please verify that the category exists")

        client.close();
        return
    }



};

/**
 * deletes a document that matches the product_id with p_productId
 * @param {int} p_productId 
 * @returns 
 */
async function deleteProduct(p_productId){
    await client.connect()
    const db = client.db(dbName)
    
    const product = db.collection('product')

    const deleteDocument = {
        product_id: p_productId
    };

    const delete_query = await product.deleteOne(deleteDocument);
    console.log(`${delete_query.deletedCount} document has been removed`);

    client.close();
    return
};

//---------------------------------------Sale

/**
 * uses the given parameters to insert a sale document in the database
 * @param {int} p_customerId 
 * @param {Array<int>} p_productId 
 * @returns 
 */
async function insertSale(p_customerId, p_productId){
    await client.connect()
    const db = client.db(dbName)
    
    const sale = db.collection('sale')
    const customer = db.collection('customer')
    const product = db.collection('product')

    const  readIndex = await sale.find({}).sort({"sale_id": -1}).limit(1).toArray()
    let highestIndex = readIndex[0].sale_id

    const verifyCustomerQuery = await customer.find({customer_id: p_customerId}).toArray()
    const customerVerification = verifyCustomerQuery.length > 0
    
    let productVerification = true // variable used to verify the existance of all the products
    let saleTotal = 0

    //loop used to get the sum of the products, and verify that the product exists
    for(let i = 0; i < p_productId.length; i++){
        const verifyProductQuery = await product.find({product_id: p_productId[i]}).toArray()
        let itemPrice = verifyProductQuery[0].price
        if(verifyProductQuery.length = 0){
            productVerification = false
            break;
        }
        else{
            saleTotal += itemPrice
        }
    }
    if(customerVerification && productVerification){

        for(let i = 0; i < p_productId.length; i++){
            const updateFilter = {
                product_id: p_productId[i]
            }

            const updateDocument = {
                $inc:{
                    inventory: -1
                }
            }
            const updateInventoryQuery = await product.updateOne(updateFilter, updateDocument)
            
        }

        const newDocument = {
            sale_id: highestIndex+1,
            customer_id: p_customerId,
            product_id: p_productId,
            total: saleTotal
        }
        
        const insertQuery = await sale.insertOne(newDocument)
        console.log(`A document was inserted with the _id: ${insertQuery.insertedId}`)

        client.close();
        return
    }
    else if (customerVerification && !productVerification){
        console.log('please check if all products are valid')
        client.close();
        return
    }
    else if (!customerVerification && productVerification){
        console.log('please check that the customer id is valid')
        client.close();
        return
    }
    else{
        console.log('please check the product list and the customer id')
        client.close();
        return
    }

};
/**
 * select all the sale documents
 */
async function readSale(){
    await client.connect()
    const db = client.db(dbName)
    
    const sale = db.collection('sale')

    const read_query = await sale.find({}).toArray()
    console.log(read_query)

    client.close();
};
/**
 * updates a document that matches the sale_id with the p_saleId
 * @param {int} p_saleId 
 * @param {int} p_customerId 
 * @param {Array<int>} p_productId 
 * @returns 
 */
async function updateSale(p_saleId, p_customerId, p_productId){
    await client.connect()
    const db = client.db(dbName)
    
    const sale = db.collection('sale')
    const customer = db.collection('customer')
    const product = db.collection('product')

    const  readIndex = await sale.find({}).sort({"sale_id": -1}).limit(1).toArray()
    const highestIndex = readIndex[0].sale_id

    const verifyCustomerQuery = await customer.find({customer_id: p_customerId}).toArray()
    
    const customerVerification = verifyCustomerQuery.length > 0
    let productVerification = true

    let saleTotal = 0

    for( i = 0; i < p_productId.length; i++){
        const verifyProductQuery = await product.find({product_id: p_productId[i]}).toArray()
        let itemPrice = verifyProductQuery[0].price
        if(verifyProductQuery.length = 0){
            productVerification = false
            break;
        }
        else{
            saleTotal += itemPrice
        }
    }
    
    if(customerVerification && productVerification){
        const filter = {
            sale_id: p_saleId
        }

        const updateDocument = {
            $set: {  
                sale_id: highestIndex+1,
                customer_id: p_customerId,
                product_id: p_productId,
                total: saleTotal
            }
        }
        
        const updateQuery = await sale.updateOne(filter, updateDocument)
        console.log(`A document was updated with the _id: ${updateQuery.upsertedId}`)

        client.close();
        return
    }
    else if (customerVerification && !productVerification){
        console.log('please check if all products are valid')
        client.close();
        return
    }
    else if (!customerVerification && productVerification){
        console.log('please check that the customer id is valid')
        client.close();
        return
    }
    else{
        console.log('please check the product list and the customer id')
        client.close();
        return
    }
};
/**
 * Deletes a document that matches sale_id with p_saleId
 * @param {int} p_saleId 
 */
async function deleteSale(p_saleId){
    await client.connect()
    const db = client.db(dbName)
    
    const sale = db.collection('sale')

    const deleteDocument = {
        sale_id: p_saleId
    };

    const delete_query = await sale.deleteOne(deleteDocument);
    console.log(`${delete_query.deletedCount} document has been removed`);

    client.close();
};

// ########################################Procedures

/**
 * selects all the documents that has an inventory value greater than 0
 */
async function queryInventory(){
    await client.connect()
    const db = client.db(dbName)

    const product = db.collection('product')

    const inventoryQuery = await product.find({inventory: {
        $gt: 0
    }}).toArray() // uses the $gt operator to get the documents that have a value greater than gt=grater

    console.log(inventoryQuery)
    client.close();
}
/**
 * select the id of the customers that have a sale registred
 */
async function queryCustomerSales(){
    await client.connect();

    await client.connect()
    const db = client.db(dbName)

    const sale = db.collection('sale')
    const customer = db.collection('customer')

    const customerSaleQuery = await sale.aggregate([
        {
            $lookup:{
                from: "customer",
                localField: "customer_id",
                foreignField: "customer_id",
                as: "customer_info"
            }
        },
        {
            $unwind: "$customer_info"
        },
        {
            $project: {
                "customer_info.customer_id":1,
                "customer_info.name": 1,
                "customer_info.phone":1
            }
        },
        {
            $unwind: "$customer_info.phone"
        },
        {
            $group: {
                _id: "$customer_info.customer_id",
                totalSales: {$count: {}}
            }
        },

    ]).toArray()

    console.log(customerSaleQuery)
    client.close();
}


// #####################################Main Program

async function main() {
    
    // await insertCategory('fakecategory')
    // await insertCategory('fakecategory2')
    // await readCategory()
    // await updateCategory(2, 'Shoes')
    // await deleteCategory(3)

    // await insertCustomer('mauricio',['12344321'], ['8765432112345678'], 'alajuela', 'alajuela', 'la agonia', "23")
    // await insertCustomer('diego',['12344321'], ['8765432112345678'], 'alajuela', 'alajuela', 'la agonia', "23")
    // await readCustomer()
    // await updateCustomer(2, 'alejandro',0,'12344322', 0,'8765432112345677', 0,'alajuela', 'alajuela', 'la agonia', "23")
    // await deleteCustomer(1)

    // await insertProduct('jordans',2,'nike','nike shoes', 20, 70000)
    // await insertProduct('yeezy',2,'yeezy','yeezy shoes', 3, 80000)
    // await readProduct()
    // await updateProduct(2, 'new balance',2,'new balance','new balance shoes', 50, 50000)
    // await deleteProduct(3)

    // await insertSale(0,[0,0,0])
    // await insertSale(0,[0,0])
    // await readSale()
    // await updateSale(1,0,[0,0,0,0])
    // await deleteSale(1)

    await queryInventory()
    await queryCustomerSales()
    

    return 'done.';
}
main()