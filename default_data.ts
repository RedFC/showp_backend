const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
// const {CustomStreamServer} = require('./app/constants/customStreamServer')
// const str = new CustomStreamServer();


async function main() {
    prisma.user.create({
        data: {
            "id": "e6895e69-bb65-4f92-8989-6aae24defc86",
            "email": null,
            "blocked": false,
            "role": "ADMIN",
            "profile": {
              "create": {
                "name": "Shwop_Admin",
                "about": "",
                "username":"Shwop_Admin",
                "phoneNo": "923101041372",
                "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
            }
            },
        },
        include: { profile: true },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.user.create({
        data: {
            "id": "e6895e69-bb65-4f92-8989-6aae24defc87",
            "email": null,
            "blocked": false,
            "role": "USER",
            "profile": {
              "create": {
                "name": "Shwop_User",
                "about": "",
                "username":"Shwop_User",
                "phoneNo": "923101041373",
                "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
            }
            },
        },
        include: { profile: true },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })


    prisma.user.create({
        data: {
            "id": "e6895e69-bb65-4f92-8989-6aae24defc88",
            "email": null,
            "blocked": false,
            "role": "USER",
            "profile": {
              "create": {
                "name": "Shwop_User1",
                "about": "",
                "username":"Shwop_User2",
                "phoneNo": "923101041374",
                "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
            }
            },
        },
        include: { profile: true },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

// Category Block

    prisma.category
        .createMany({
          data: [
            {
                id:"e6895e69-bb65-4f92-8989-6aae24defc86", 
                name: "Electronic"
            },
            {
                id:"e6895e69-bb65-4f92-8989-6aae24defc87", 
                name: "Accessories"
            },
            {
                id:"e6895e69-bb65-4f92-8989-6aae24defc88", 
                name: "Toys"
            }
          ]
        }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    //Subcategory Block

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24defc96",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}}, 
                name: "Ac"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24defc98",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}}, 
                name: "Tv"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24defc99",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}}, 
                name: "lcd"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })
//Accessories
    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def100",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc87"}}, 
                name: "usb cable"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def101",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc87"}}, 
                name: "cassing"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def102",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc87"}}, 
                name: "charger"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def103",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc88"}}, 
                name: "dolls"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def104",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc88"}}, 
                name: "cars"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

    prisma.subCategory
        .create({
            data:{
                id:"e6895e69-bb65-4f92-8989-6aae24def105",
                category:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc88"}}, 
                name: "animals"
            },
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error); 
    })

// Image Block
    prisma.productImages.create({
        data:{
            cloudinaryId:"e6895e69-bb65-4f92-8989-6aae24defc13",
            path:"https://img.favpng.com/5/16/10/clip-art-product-computer-icons-avatar-logo-png-favpng-b7TLrYx6Uqp661BrMRmvzWdZY.jpg",
            type:"PRODUCT",}}
        ).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error); 
        })

// product Block
    prisma.product
        .create({
          data: 
            {
                id:"e6895e69-bb65-4f92-8989-6aae24def335",
                published: false,
                title: "",
                description: "this is product",
                baseCost: 1100,
                currency: "dollar",
                refundable: false,
                // userId:"e6895e69-bb65-4f92-8989-6aae24defc86" ,
            tags: {
                connectOrCreate : [
                    {where:{ name : "lcd"}, create:{name:"lcd"}},
                    { where:{ name : "tv"}, create:{name:"tv"}},
                    { where:{ name : "remote"}, create:{name:"remote"}}
                ]
            },
            user:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}},
            categories: {
                connect: [{id: "e6895e69-bb65-4f92-8989-6aae24defc96"}]
            },
            quantity : 12,
            images: {
                connect: {cloudinaryId: "e6895e69-bb65-4f92-8989-6aae24defc13"}}
                    }  
                    }).then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error); 
                })
    
    prisma.product
                .create({
                  data: 
                    {
                        id:"e6895e69-bb65-4f92-8989-6aae24def336",
                        published: false,
                        title: "",
                        description: "this is product",
                        baseCost: 1100,
                        currency: "dollar",
                        refundable: false,
                        // userId:"e6895e69-bb65-4f92-8989-6aae24defc86" ,
                    tags: {
                        connectOrCreate : [
                            {where:{ name : "lcd"}, create:{name:"lcd"}},
                            { where:{ name : "tv"}, create:{name:"tv"}},
                            { where:{ name : "remote"}, create:{name:"remote"}}
                        ]
                    },
                    user:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}},
                    categories: {
                        connect: [{id: "e6895e69-bb65-4f92-8989-6aae24defc96"}]
                    },
                    quantity : 12,
                    images: {
                        connect: {cloudinaryId: "e6895e69-bb65-4f92-8989-6aae24defc13"}}
                            }  
                            }).then(result => {
                            console.log(result);
                        }).catch(error => {
                            console.log(error); 
                        })

        prisma.product
                        .create({
                          data: 
                            {
                                id:"e6895e69-bb65-4f92-8989-6aae24def334",
                                published: false,
                                title: "",
                                description: "this is product",
                                baseCost: 1100,
                                currency: "dollar",
                                refundable: false,
                                // userId:"e6895e69-bb65-4f92-8989-6aae24defc86" ,
                            tags: {
                                connectOrCreate : [
                                    {where:{ name : "lcd"}, create:{name:"lcd"}},
                                    { where:{ name : "tv"}, create:{name:"tv"}},
                                    { where:{ name : "remote"}, create:{name:"remote"}}
                                ]
                            },
                            user:{connect:{id:"e6895e69-bb65-4f92-8989-6aae24defc86"}},
                            categories: {
                                connect: [{id: "e6895e69-bb65-4f92-8989-6aae24defc96"}]
                            },
                            quantity : 12,
                            images: {
                                connect: {cloudinaryId: "e6895e69-bb65-4f92-8989-6aae24defc13"}}
                                    }  
                                    }).then(result => {
                                    console.log(result);
                                }).catch(error => {
                                    console.log(error); 
                                })
//Review block         

}
main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })