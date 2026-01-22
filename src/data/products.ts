export interface Product {
  id: number;
  number: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image: "/images/image-meringue-tablet.jpg",
  },
  {
    id: 2,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image: "/images/aegim - meringue - tablet.jpg",
  },

  {
    id: 1,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image:
      "https://i.pinimg.com/736x/bd/c3/58/bdc358eea81946db083a0ed341038510.jpg",
  },
  {
    id: 2,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image:
      "https://i.pinimg.com/736x/bd/c3/58/bdc358eea81946db083a0ed341038510.jpg",
  },

  {
    id: 1,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image:
      "https://i.pinimg.com/736x/bd/c3/58/bdc358eea81946db083a0ed341038510.jpg",
  },
  {
    id: 2,
    number: 1234,
    name: "Vanilla Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
    image:
      "https://i.pinimg.com/736x/bd/c3/58/bdc358eea81946db083a0ed341038510.jpg",
  },
];

export { products };
