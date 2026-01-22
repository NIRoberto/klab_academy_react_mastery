export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: {
    desktop: string;
    tablet: string;
    mobile: string;
    thumbnail: string;
  };
}

const products: Product[] = [
  {
    id: 1,
    name: "Waffle with Berries",
    price: 6.50,
    category: "Waffle",
    image: {
      desktop: "/images/image-waffle-desktop.jpg",
      tablet: "/images/image-waffle-tablet.jpg",
      mobile: "/images/image-waffle-mobile.jpg",
      thumbnail: "/images/image-waffle-thumbnail.jpg"
    }
  },
  {
    id: 2,
    name: "Vanilla Bean Crème Brûlée",
    price: 7.00,
    category: "Crème Brûlée",
    image: {
      desktop: "/images/image-creme-brulee-desktop.jpg",
      tablet: "/images/image-creme-brulee-tablet.jpg",
      mobile: "/images/image-creme-brulee-mobile.jpg",
      thumbnail: "/images/image-creme-brulee-thumbnail.jpg"
    }
  },
  {
    id: 3,
    name: "Macaron Mix of Five",
    price: 8.00,
    category: "Macaron",
    image: {
      desktop: "/images/image-macaron-desktop.jpg",
      tablet: "/images/image-macaron-tablet.jpg",
      mobile: "/images/image-macaron-mobile.jpg",
      thumbnail: "/images/image-macaron-thumbnail.jpg"
    }
  },
  {
    id: 4,
    name: "Classic Tiramisu",
    price: 5.50,
    category: "Tiramisu",
    image: {
      desktop: "/images/image-tiramisu-desktop.jpg",
      tablet: "/images/image-tiramisu-tablet.jpg",
      mobile: "/images/image-tiramisu-mobile.jpg",
      thumbnail: "/images/image-tiramisu-thumbnail.jpg"
    }
  },
  {
    id: 5,
    name: "Pistachio Baklava",
    price: 4.00,
    category: "Baklava",
    image: {
      desktop: "/images/image-baklava-desktop.jpg",
      tablet: "/images/image-baklava-tablet.jpg",
      mobile: "/images/image-baklava-mobile.jpg",
      thumbnail: "/images/image-baklava-thumbnail.jpg"
    }
  },
  {
    id: 6,
    name: "Lemon Meringue Pie",
    price: 5.00,
    category: "Pie",
    image: {
      desktop: "/images/image-meringue-desktop.jpg",
      tablet: "/images/image-meringue-tablet.jpg",
      mobile: "/images/image-meringue-mobile.jpg",
      thumbnail: "/images/image-meringue-thumbnail.jpg"
    }
  },
  {
    id: 7,
    name: "Red Velvet Cake",
    price: 4.50,
    category: "Cake",
    image: {
      desktop: "/images/image-cake-desktop.jpg",
      tablet: "/images/image-cake-tablet.jpg",
      mobile: "/images/image-cake-mobile.jpg",
      thumbnail: "/images/image-cake-thumbnail.jpg"
    }
  },
  {
    id: 8,
    name: "Salted Caramel Brownie",
    price: 4.50,
    category: "Brownie",
    image: {
      desktop: "/images/image-brownie-desktop.jpg",
      tablet: "/images/image-brownie-tablet.jpg",
      mobile: "/images/image-brownie-mobile.jpg",
      thumbnail: "/images/image-brownie-thumbnail.jpg"
    }
  },
  {
    id: 9,
    name: "Vanilla Panna Cotta",
    price: 6.50,
    category: "Panna Cotta",
    image: {
      desktop: "/images/image-panna-cotta-desktop.jpg",
      tablet: "/images/image-panna-cotta-tablet.jpg",
      mobile: "/images/image-panna-cotta-mobile.jpg",
      thumbnail: "/images/image-panna-cotta-thumbnail.jpg"
    }
  }
];

export { products };
