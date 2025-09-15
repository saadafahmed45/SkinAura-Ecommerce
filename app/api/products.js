export default async function productsData(req, res) {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();
  res.status(200).json(data);
}
