conn = Mongo()
db = conn.getDB("mongo_hw")

db.createCollection("category", {
    validator: {
        $jsonSchema:{
            bsonType: "object",
            required: ["category_id", "name"],
            properties: {
                category_id:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    }
})
db.category.createIndex({category_id: 1}, {unique: true})

db.createCollection("product", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["product_id", "name", "category", "brand", "description", "price"],
            properties: {
                product_id: {
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                category:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                brand:{
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description:{
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int grater than 0 and is required"
                }
            }
        }
    }
})
db.product.createIndex({product_id: 1}, {unique: true})

db.createCollection("client", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["client_id", "name", "phone", "card", "direction"],
            properties: {
                client_id:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                phone: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "string",
                        minLength: 8
                    }
                },
                card: {
                    bsonType: "array",
                    minItems: 1,
                    uniqueItems: true,
                    items: {
                        bsonType: "string",
                        minLength: 16
                    }
                },
                direction: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "object",
                        required: ["province", "canton", "district", "street"],
                        properties:{
                            province:{
                                bsonType:"string",
                                description: "must be a string and is required"
                            },
                            canton:{
                                bsonType:"string",
                                description: "must be a string and is required"
                            },
                            district:{
                                bsonType:"string",
                                description: "must be a string and is required"
                            },
                            street:{
                                bsonType:"string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            }
        }
    }
})
db.client.createIndex({client_id: 1}, {unique: true})

db.createCollection("sale", {
    validator: {
        $jsonSchema:{
            bsonType: "object",
            required: ["sale_id", "client_id", "product_id", "total"],
            properties: {
                sale_id:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                client_id:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                },
                product_id:{
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "int",
                        minimum: 0,
                        description: "must be an int greater than 0"
                    }
                },
                total:{
                    bsonType: "int",
                    minimum: 0,
                    description: "must be an int greater than 0 and is required"
                }
            }
        }
    }
})

db.sale.createIndex({sale_id: 1}, {unique: true})