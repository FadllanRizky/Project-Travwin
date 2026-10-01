import { motion } from 'framer-motion'
import { PRODUCTS } from '../data/products.js'

export default function ProductTabs({ active, onChange }) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur-sm">
      {PRODUCTS.map((product) => {
        const Icon = product.icon
        const isActive = active === product.key
        return (
          <button
            key={product.key}
            onClick={() => onChange(product.key)}
            className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isActive ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="product-tab"
                className="absolute inset-0 rounded-xl bg-travel-500 shadow-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={18} className="relative z-10" />
            <span className="relative z-10 whitespace-nowrap">{product.label}</span>
          </button>
        )
      })}
    </div>
  )
}