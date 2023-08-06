const ordersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john123@gmail.com",
    address: "1234 Main St",
    city: "Boston",
    state: "MA",
    zip: "02101",
    country: "USA",
    shipped: true,
    products: [
      {
        id: 1,
        name: "iPhone 12",
        description:
          "New Apple iPhone 12 (64GB, Blue) [Locked] + Carrier Subscription",
        price: 799.99,
        image:
          "https://i.etsystatic.com/6572991/r/il/df49d2/3459907621/il_500x500.3459907621_mg3j.jpg",
        quantity: 1,
      },
      {
        id: 2,
        name: "Samsung Galaxy S21",
        description:
          "Samsung Galaxy S21 5G | Factory Unlocked Android Cell Phone | US Version 5G Smartphone | Pro-Grade Camera, 8K Video, 64MP High Res | 128GB, Phantom Gray (SM-G991UZAAXAA)",
        price: 799.99,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/71r69Y7BSeL._AC_SL1500_.jpg",
        quantity: 1,
      },
      {
        id: 3,
        name: "Google Pixel 5",
        description:
          "Google Pixel 5 - 5G Android Phone - Water Resistant - Unlocked Smartphone with Night Sight and Ultrawide Lens - Just Black",
        price: 699.99,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/81%2B0H-MCXjL._AC_SL1500_.jpg",
        quantity: 1,
      },
    ],
    shippingPrice: 10.0,
    totalPrice: 1609.97,
    dateOrdered: "2021-01-01T00:00:00.000Z",
    dateShipped: "2021-01-02T00:00:00.000Z",
    paymentMethod: "Credit Card",
    paymentResult: {
      id: "ch_1Iv1Zt2eZvKYlo2C0q2Y2Q",
      status: "succeeded",
      update_time: "1619890000",
      email_address: "john123@gmail.com",
      amount: 1609.97,
      currency: "usd",
      payment_method_details: {
        card: {
          brand: "visa",
          last4: "4242",
        },
      },
    },
    shippingAddress: {
      address: "1234 Main St",
      city: "Boston",
      state: "MA",
      zip: "02101",
      country: "USA",
    },
    user: {
      id: 1,
      name: "John Doe",
      email: "john123@gmail.com",
      isAdmin: false,
    },
    isPaid: true,
    paidAt: "2021-04-01T00:00:00.000Z",
    status: "Pending",
    deliveredAt: "2021-04-02T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@gmail.com",
    address: "1234 Main St",
    city: "Boston",
    state: "MA",
    zip: "02101",
    country: "USA",
    shipped: true,
    products: [
      {
        id: 1,
        name: "iPhone 12",
        description:
          "New Apple iPhone 12 (64GB, Blue) [Locked] + Carrier Subscription",
        price: 799.99,
        image:
          "https://i.etsystatic.com/6572991/r/il/df49d2/3459907621/il_500x500.3459907621_mg3j.jpg",
        quantity: 1,
      },
      {
        id: 2,
        name: "Samsung Galaxy S21",
        description:
          "Samsung Galaxy S21 5G | Factory Unlocked Android Cell Phone | US Version 5G Smartphone | Pro-Grade Camera, 8K Video, 64MP High Res | 128GB, Phantom Gray (SM-G991UZAAXAA)",
        price: 799.99,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/71r69Y7BSeL._AC_SL1500_.jpg",
        quantity: 1,
      },
      {
        id: 3,
        name: "Google Pixel 5",
        description:
          "Google Pixel 5 - 5G Android Phone - Water Resistant - Unlocked Smartphone with Night Sight and Ultrawide Lens - Just Black",
        price: 699.99,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/81%2B0H-MCXjL._AC_SL1500_.jpg",
        quantity: 1,
      },
    ],
    shippingPrice: 10.0,
    totalPrice: 1609.97,
    dateOrdered: "2021-01-01T00:00:00.000Z",
    dateShipped: "2021-01-02T00:00:00.000Z",
    paymentMethod: "Credit Card",
    paymentResult: {
      id: "ch_1Iv1Zt2eZvKYlo2C0q2Y2Q",
      status: "succeeded",
      update_time: "1619890000",
      email_address: "jane@gmail.com",
      amount: 1609.97,
      currency: "usd",
      payment_method_details: {
        card: {
          brand: "visa",
          last4: "4242",
        },
      },
    },
    shippingAddress: {
      address: "1234 Main St",
      city: "Boston",
      state: "MA",
      zip: "02101",
      country: "USA",
    },
    user: {
      id: 2,
      name: "Jane Doe",
      email: "jane@gmail.com",
      isAdmin: false,
    },
    isPaid: false,
    paidAt: "2021-04-01T00:00:00.000Z",
    status: "Delivered",
    deliveredAt: "2021-04-02T00:00:00.000Z",
  },
];

export default ordersData;
