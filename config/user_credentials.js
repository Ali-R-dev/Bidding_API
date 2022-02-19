
export const admins = [
    { id: "adm1", userName: "admin1" },
    { id: "adm2", userName: "admin2" }
]
export const Regulars = [
    { id: "usr1", userName: "user 1" },
    { id: "usr2", userName: "user 2" },
    { id: "usr3", userName: "user 3" }
]

let items = [
    {
        name: "House # 1",
        description: "street 12",
        auctionEndsAt: Date.now(),
        basePrice: 100,
        adminId: "adm1",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    },
    {
        name: "House # 2",
        description: "street",
        auctionEndsAt: Date.now(),
        basePrice: 150,
        adminId: "adm1",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    },
    {
        name: "House # 3",
        description: "street",
        auctionEndsAt: Date.now(),
        basePrice: 200,
        adminId: "adm1",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    },

    {
        name: "Car # 1",
        description: "model",
        auctionEndsAt: Date.now(),
        basePrice: 20,
        adminId: "adm2",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    },
    {
        name: "Car # 2",
        description: "model",
        auctionEndsAt: Date.now(),
        basePrice: 20,
        adminId: "adm2",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    },
    {
        name: "Car # 3",
        description: "model",
        auctionEndsAt: Date.now(),
        basePrice: 20,
        adminId: "adm2",
        currentBid: {
            price: 0,
            bidderId: "",
        }
    }

]