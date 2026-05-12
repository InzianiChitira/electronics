import { useState, useEffect } from 'react';
import { getProductVariations } from '../api/woocommerce';

export default function VariationSelector({
  productId,
  attributes,
  onVariationSelected,
  onAttributesChanged,
}) {
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVariations() {
      try {
        const res = await getProductVariations(productId);
        setVariations(res.data);
      } catch (err) {
        console.error('Error fetching variations:', err);
      } finally {
        setLoading(false);
      }
    }

    if (attributes && attributes.length > 0) {
      fetchVariations();
    } else {
      setLoading(false);
    }
  }, [productId, attributes]);

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === attributes.length) {
      const match = variations.find(variation =>
        variation.attributes.every(attr =>
          selectedAttributes[attr.name] === attr.option
        )
      );
      onVariationSelected(match || null);
    } else {
      onVariationSelected(null);
    }
    if (onAttributesChanged) {
      onAttributesChanged(selectedAttributes);
    }
  }, [selectedAttributes, variations, attributes]);

  const handleAttributeChange = (attributeName, value) => {
    setSelectedAttributes(prev => ({ ...prev, [attributeName]: value }));
  };

  const isOptionAvailable = (attributeName, option) => {
    const tempSelection = { ...selectedAttributes, [attributeName]: option };
    return variations.some(variation =>
      variation.attributes.every(attr => {
        if (tempSelection[attr.name]) {
          return tempSelection[attr.name] === attr.option;
        }
        return true;
      })
    );
  };

  if (loading) return (
    <div className="space-y-3 py-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!attributes || attributes.length === 0) return null;

  const allSelected = Object.keys(selectedAttributes).length === attributes.length;

  return (
    <div className="space-y-5">
      {attributes.map(attribute => {
        const isColor =
          attribute.name.toLowerCase() === 'color' ||
          attribute.name.toLowerCase() === 'colour';

        return (
          <div key={attribute.id || attribute.name}>

            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-dark capitalize">
                {attribute.name}:
              </span>
              {selectedAttributes[attribute.name] && (
                <span className="text-sm font-semibold text-primary">
                  {selectedAttributes[attribute.name]}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {isColor ? (
              <div className="flex gap-3 flex-wrap">
                {attribute.options.map(option => {
                  const available = isOptionAvailable(attribute.name, option);
                  const selected = selectedAttributes[attribute.name] === option;

                  return (
                    <div key={option} className="relative group/swatch">
                      <button
                        onClick={() => available && handleAttributeChange(attribute.name, option)}
                        disabled={!available}
                        title={option}
                        className={`w-10 h-10 rounded-full transition-all duration-200 relative ${
                          selected
                            ? 'ring-2 ring-offset-2 ring-primary scale-110'
                            : 'ring-1 ring-gray-200 hover:ring-primary hover:scale-105'
                        } ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ backgroundColor: option.toLowerCase() }}
                      >
                        {!available && (
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: 'linear-gradient(45deg, transparent 45%, rgba(255,0,0,0.6) 45%, rgba(255,0,0,0.6) 55%, transparent 55%)',
                              }}
                            />
                          </div>
                        )}
                        {selected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition pointer-events-none z-10">
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>

            ) : (
              /* Pill buttons for Size, Storage etc */
              <div className="flex gap-2 flex-wrap">
                {attribute.options.map(option => {
                  const available = isOptionAvailable(attribute.name, option);
                  const selected = selectedAttributes[attribute.name] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => available && handleAttributeChange(attribute.name, option)}
                      disabled={!available}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        selected
                          ? 'bg-primary border-primary text-white'
                          : available
                          ? 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                          : 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                      }`}
                    >
                      {option}
                      {!available && (
                        <span className="ml-1 text-xs">(Out of Stock)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Warning — not all selected */}
      {Object.keys(selectedAttributes).length > 0 && !allSelected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 flex items-center gap-2">
          <span>⚠️</span>
          <span>Please select all options to continue</span>
        </div>
      )}
    </div>
  );
}