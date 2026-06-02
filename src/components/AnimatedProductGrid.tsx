"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

import { Product, Dictionary } from "@/lib/types";

interface AnimatedProductGridProps {
  products: Product[];
  dict?: Dictionary;
}

const AnimatedProductGrid = ({ products, dict }: AnimatedProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <ProductCard dict={dict} {...product} />
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedProductGrid;
