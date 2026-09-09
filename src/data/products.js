const products = [
  {
    id: 1,
    title: "iPhone 13 128GB",
    category: "Electronics",
    price: 45000,
    condition: "Like New",
    location: "Athi River Campus",
    seller: "Brian K.",
    rating: 4.9,
    verified: true,
    status: "Available",
    negotiable: true,

    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592286927505-2fd7b3c4a4e1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "iPhone 13 in excellent condition. The phone has been well maintained and works perfectly. Battery health is good and the device comes with its charging cable.",
  },

  {
    id: 2,
    title: "MacBook Air M1",
    category: "Electronics",
    price: 65000,
    condition: "Good",
    location: "Main Campus",
    seller: "Sarah M.",
    rating: 4.8,
    verified: true,
    status: "Available",
    negotiable: true,

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "MacBook Air with Apple M1 chip. Perfect for programming, school work, browsing and everyday use. The laptop is in good condition and performs smoothly.",
  },

  {
    id: 3,
    title: "Software Engineering Textbook",
    category: "Books",
    price: 1800,
    condition: "Good",
    location: "Main Campus",
    seller: "David T.",
    rating: 4.7,
    verified: true,
    status: "Available",
    negotiable: true,

    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "A useful software engineering textbook suitable for students studying software development and related courses. Pages are clean and readable.",
  },

  {
    id: 4,
    title: "Nike Air Force 1",
    category: "Fashion",
    price: 5500,
    condition: "Like New",
    location: "Athi River Campus",
    seller: "Kevin O.",
    rating: 4.6,
    verified: true,
    status: "Reserved",
    negotiable: false,

    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "Nike Air Force 1 in excellent condition. Worn only a few times and carefully maintained.",
  },

  {
    id: 5,
    title: "Study Desk",
    category: "Furniture",
    price: 3500,
    condition: "Good",
    location: "Main Campus",
    seller: "Mary W.",
    rating: 4.8,
    verified: true,
    status: "Available",
    negotiable: true,

    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "Simple and sturdy study desk that is ideal for a student room or apartment. It has enough space for a laptop, books and other study materials.",
  },

  {
    id: 6,
    title: "Sony Wireless Headphones",
    category: "Electronics",
    price: 7500,
    condition: "Like New",
    location: "Main Campus",
    seller: "Alex N.",
    rating: 4.9,
    verified: true,
    status: "Available",
    negotiable: true,

    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    ],

    description:
      "Wireless headphones with excellent sound quality. Lightly used and in very good condition. Great for studying, music and travelling.",
  },
];

export default products;