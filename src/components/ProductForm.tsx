import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  // 다른 필요한 필드들...
}

const ProductForm = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 폼 데이터 가져오기
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      // 다른 필드들...
    };

    try {
      // API 호출하여 상품 등록
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const savedProduct = await response.json();
      setProduct(savedProduct);
      setShowQR(true);
    } catch (error) {
      console.error('상품 등록 실패:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            상품명
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            가격
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          상품 등록
        </button>
      </form>

      {showQR && product && (
        <div className="mt-8">
          <h3 className="text-lg font-medium">상품 QR 코드</h3>
          <div className="mt-2">
            <QRCodeSVG
              value={JSON.stringify({
                id: product.id,
                name: product.name,
                price: product.price,
                url: window.location.href,
              })}
              size={200}
              level="L" // QR 코드 오류 수정 레벨 (L, M, Q, H)
              includeMargin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
