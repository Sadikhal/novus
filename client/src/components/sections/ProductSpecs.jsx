const ProductSpecs = ({ features, product }) => {
  return (
    <div className="xl:max-w-2xl w-full py-6 mt-8 bg-lamaWhite rounded-lg shadow-md font-poppins border-t">
      <div className="border-b flex items-center shadow-sm">
        <h2 className="text-2xl font-poppins font-semibold mb-4 mx-6 text-gray-800">Specifications</h2>
      </div>
      <div className="mb-6 pt-4 px-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 pb-2">
            <span className="text-gray-500">colors</span>
            <div>
              {product.color.map((i) => (
                <span className="px-2 py-1 text-gray-900 rounded" key={i}>
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-2">
            <span className="text-gray-500">size</span>
            <span className="px-2 py-1 text-gray-900 rounded">
              {product.size}
            </span>
          </div>

          {features.map((item) => (
            <div key={item.name} className="grid grid-cols-2 gap-4 pb-2">
              <span className="text-gray-500">{item.name}</span>
              <span className="text-gray-900">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSpecs;