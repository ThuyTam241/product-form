import { useEffect, useRef, useState } from "react";
import { ProductForm } from "./components/ProductForm";
import type { Product } from "./types/IProducts";
import type { Dayjs } from "dayjs";

function App() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const receiveProductData = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return;
      if (event.data.type === "productData") {
        setEditingProduct(event.data.payload);
      }
    };

    window.addEventListener("message", receiveProductData);

    return () => {
      window.removeEventListener("message", receiveProductData);
    };
  }, []);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const onSubmitForm = async (formData: Product) => {
    const file = (formData.thumbnail as any)?.file;
    const thumbnailBase64 =
      file && file.status !== "removed" ? await toBase64(file) : "";

    const payload = {
      ...formData,
      thumbnail:
        typeof formData.thumbnail === "string"
          ? formData.thumbnail
          : thumbnailBase64,
      expiredAt: formData.expiredAt
        ? (formData.expiredAt as Dayjs).format("YYYY-MM-DD")
        : "",
    };
    window.parent.postMessage(
      {
        type: "dataAfterSubmitForm",
        payload: {
          status: "success",
          id: editingProduct?.id,
          data: payload,
        },
      },
      "http://localhost:3000"
    );
  };

  return (
    <>
      <ProductForm initialValue={editingProduct} onSubmitForm={onSubmitForm} />
    </>
  );
}

export default App;
