import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axiosconfig";
import toast from "react-hot-toast";
import { Eye, Trash2, Edit, Loader2, ShoppingBasket } from "lucide-react";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data.createdProducts || res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlenavigate = () => {
    navigate("/admin/add-product");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter((p) => (p._id || p.id) !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-light/10 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            Products
          </h1>
        </div>
        <button
          onClick={handlenavigate}
          className="bg-primary text-whitecustom px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-md shadow-primary/10 self-start sm:self-auto"
        >
          + Add Product
        </button> 
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-secondary" size={32} />
        </div>
      ) : products.length > 0 ? (
        <div className="bg-whitecustom rounded-2xl shadow-xl overflow-hidden border border-light/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/10 border-b border-light/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                  <th className="p-4 sm:p-5">#</th>
                  <th className="p-4 sm:p-5">Product Name</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Price</th>
                  <th className="p-4 sm:p-5">Discount</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light/20 text-sm">
                {products.map((product, index) => {
                  const productId = product._id || product.id;
                  return (
                    <tr
                      key={productId}
                      className="hover:bg-light/5 transition-colors"
                    >
                      <td className="p-4 sm:p-5 text-primary/40 font-bold">
                        {index + 1}
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-primary">
                        {product.name}
                      </td>
                      <td className="p-4 sm:p-5 text-primary/70 font-medium">
                        {product.category?.name ?? (
                          <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded font-bold">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-primary font-bold">
                        ${product.price}
                      </td>
                      <td className="p-4 sm:p-5 text-green-600 font-bold">
                        {product.discountPrice
                          ? `$${product.discountPrice}`
                          : "—"}
                      </td>
                      <td className="p-4 sm:p-5 text-center whitespace-nowrap align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/product/${product._id}`)
                            }
                            className="px-3 py-1.5 text-sm bg-light text-primary rounded-xl hover:bg-light/80 transition-colors"
                            title="View Product"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(productId)}
                            className="px-3 py-1.5 text-sm bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(productId)}
                            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-whitecustom border border-light/40 rounded-2xl p-12 text-center shadow-sm">
          <ShoppingBasket className="mx-auto text-primary/30 mb-4" size={48} />
          <h3 className="text-lg font-bold text-primary mb-1">
            No products found
          </h3>
          <p className="text-sm text-primary/60">
            Click "+ Add Product" to begin stocking up your shelves.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
