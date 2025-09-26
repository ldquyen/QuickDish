"use client";

import { motion } from "framer-motion";

const foodItems = [
  {
    img: "https://tse2.mm.bing.net/th/id/OIP.uigZgzF8Fwvo2P1Uzw2pwwHaEF?rs=1&pid=ImgDetMain&o=7&rm=3",
    desc: "Phở Bò Truyền Thống - hương vị đậm đà của Hà Nội.",
  },
  {
    img: "https://www.mystudenthalls.com/app/uploads/2023/12/230907-DAY-IQU-IQU1-VD-SKY_LOUNGE1-scaled-780x539.jpg",
    desc: "Cơm Tấm Sườn - món ăn giản dị mà đầy dinh dưỡng.",
  },
  {
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/82215b103191477.5f478d2e8b9fa.jpg",
    desc: "Bún Chả Hà Nội - thơm ngon nướng than hoa.",
  },
  {
    img: "https://grandmarina.masterivietnam.com/wp-content/uploads/2023/10/Grand-Marina-Sai-Gon_Hinh-anh-du-an.jpg",
    desc: "Chè Thái - món tráng miệng ngọt ngào.",
  },
];

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-yellow-50 p-8 sm:p-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-yellow-700 mb-4">Bami restaurant</h1>
        <p className="text-lg text-gray-700">
          Welcome to our BAMI restaurant – the place that preserves the traditional flavors of Vietnam.
        </p>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-12 flex justify-center"
      >
        <motion.img
          src="https://vgsi.vn/wp-content/uploads/2022/07/diamond-crown-plaza-hai-phong-2-1.jpg"
          alt="Vietnamese Food"
          className="rounded-lg shadow-lg border border-yellow-300 max-w-full"
        />
      </motion.div>

      {/* Scroll Content */}
      <div className="mt-24 space-y-20 max-w-4xl mx-auto">
        {foodItems.map(({ img, desc }, i) => (
          <motion.div
            key={i}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <motion.img
              src={img}
              alt={desc}
              className="w-48 h-48 rounded-lg object-cover shadow-md border border-yellow-300"
            />
            <p className="text-gray-700 text-lg max-w-xl">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer Call-to-Action */}
      <motion.div
        className="mt-32 bg-yellow-100 rounded-xl max-w-2xl mx-auto p-12 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: [1, 1.05, 1] }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-yellow-800 mb-4">
          Order now!
        </h2>
        <p className="text-yellow-900 mb-8">
          Let us bring you the best dining experience.
        </p>
      </motion.div>
    </div>
  );
}