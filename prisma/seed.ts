import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const Shwop_Admin = await prisma.user.upsert({
      where: { id: "e6895e69-bb65-4f92-8989-6aae24defc86" },
      update: {},
      create: {
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
  })
  const Hannah_Olive = await prisma.user.upsert({
      where: { id: "e031e3b2-bd0d-455a-b08a-3a21271be74e" },
      update: {},
      create: {
          "id": "e031e3b2-bd0d-455a-b08a-3a21271be74e",
          "email": null,
          "blocked": false,
          "role": "USER",
          "profile": {
            "create": {
              "name": "Hannah_Olive",
              "about": "",
              "username":"Hannah_Olive",
              "phoneNo": "923324689980",
              "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
          }
          }
      },
      include: { profile: true },
  })
  const Suzy_Adams = await prisma.user.upsert({
      where: { id: "9b4b4f2c-7748-4214-8708-96ba9ab30957" },
      update: {},
      create: {
          "id": "9b4b4f2c-7748-4214-8708-96ba9ab30957",
          "email": null,
          "role": "USER",
          "blocked": false,
          "profile": {
            "create": {
              "name": "Suzy_Adams",
              "about": "",
              "username":"Suzy_Adams",
              "phoneNo": "923324086980",
              "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
          }
          }
      },
      include: { profile: true },
  })
  const Jimmy_Harper = await prisma.user.upsert({
      where: { id: "378e5609-1ad7-44e2-acf2-be1cb4028a4a" },
      update: {},
      create: {
          "id": "378e5609-1ad7-44e2-acf2-be1cb4028a4a",
          "email": null,
          "blocked": false,
          "role": "USER",
          "profile": {
            "create": {
                  "name": "Jimmy_Harper",
                  "about": "",
                  "username":"Jimmy_Harper",
                  "phoneNo": "923323080980",
                  "profileImage": "http://localhost:8000/resources/cloudinary/images/378e5609-1ad7-44e2-acf2-be1cb4028a4a/2021-06-23T15-20-02.311Z-sydney-wallpaper"
              }
          },
      },
      include: { profile: true },
  })
  console.log({ Shwop_Admin , Suzy_Adams, Hannah_Olive, Jimmy_Harper })
}
main()
  .catch(e => {
      console.error(e)
      process.exit(1)
  })
  .finally(async () => {
      await prisma.$disconnect()
  })