"use client";

import React from "react";
import { Star } from "lucide-react";

interface ReviewSectionProps {
  lang?: string;
  dict: {
    reviews: {
      title: string;
      subtitle: string;
      average_label: string;
      no_reviews: string;
    };
  };
}

const reviewsData: Record<string, Array<{ id: number; user_name: string; rating: number; comment: string; created_at: string }>> = {
  fr: [
    {
      id: 1,
      user_name: "Alejandro Moreno",
      rating: 5,
      comment: "Un investissement exceptionnel. L'isolation thermique est parfaite et le processus de livraison a été impeccable.",
      created_at: "2026-04-12"
    },
    {
      id: 2,
      user_name: "Isabella García",
      rating: 5,
      comment: "Excellente qualité et service client à l'écoute. La livraison à Madrid s'est faite très rapidement.",
      created_at: "2026-03-22"
    },
    {
      id: 3,
      user_name: "Carlos Rodríguez",
      rating: 4,
      comment: "Très satisfait des finitions et du design. Le système solaire en option offre une excellente autonomie.",
      created_at: "2026-05-02"
    },
    {
      id: 4,
      user_name: "Lucía Sanz",
      rating: 5,
      comment: "Des finitions dignes d'un hôtel de luxe. Un confort thermique et acoustique inégalable.",
      created_at: "2026-02-15"
    }
  ],
  es: [
    {
      id: 1,
      user_name: "Alejandro Moreno",
      rating: 5,
      comment: "Una inversión excepcional. El aislamiento térmico es perfecto y el proceso de entrega fue impecable.",
      created_at: "2026-04-12"
    },
    {
      id: 2,
      user_name: "Isabella García",
      rating: 5,
      comment: "Excelente calidad y servicio de atención al cliente. La entrega en Madrid fue muy profesional.",
      created_at: "2026-03-22"
    },
    {
      id: 3,
      user_name: "Carlos Rodríguez",
      rating: 4,
      comment: "Muy satisfecho con los acabados y el diseño. El sistema solar opcional ofrece excelente autonomía.",
      created_at: "2026-05-02"
    },
    {
      id: 4,
      user_name: "Lucía Sanz",
      rating: 5,
      comment: "Acabados increíbles dignos de un hotel de lujo. Confort térmico y acústico inigualable.",
      created_at: "2026-02-15"
    }
  ],
  en: [
    {
      id: 1,
      user_name: "Alejandro Moreno",
      rating: 5,
      comment: "An exceptional investment. The thermal insulation is perfect and the delivery process was flawless.",
      created_at: "2026-04-12"
    },
    {
      id: 2,
      user_name: "Isabella García",
      rating: 5,
      comment: "Excellent quality and responsive customer service. Delivery in Madrid was extremely professional.",
      created_at: "2026-03-22"
    },
    {
      id: 3,
      user_name: "Carlos Rodríguez",
      rating: 4,
      comment: "Very satisfied with the finishes and design. The optional solar system provides excellent autonomy.",
      created_at: "2026-05-02"
    },
    {
      id: 4,
      user_name: "Lucía Sanz",
      rating: 5,
      comment: "Incredible finishes worthy of a luxury hotel. Unmatched thermal and acoustic comfort.",
      created_at: "2026-02-15"
    }
  ]
};

const ReviewSection = ({ dict, lang }: ReviewSectionProps) => {
  const currentLang = lang === "es" || lang === "en" || lang === "fr" ? lang : "fr";
  const reviews = reviewsData[currentLang];

  const averageRating = React.useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <section className="py-8 px-4 border-t border-zinc-100 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-2">
            {dict.reviews.title}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gradient tracking-tight">
            {dict.reviews.subtitle}
          </h2>
          <p className="mt-2 text-zinc-600 text-xs">
            {dict.reviews.average_label} {averageRating.toFixed(1)} / 5
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-zinc-50/50 border border-zinc-200/80 p-4 hover:border-black/20 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm text-black">{review.user_name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={i < review.rating ? "w-3 h-3 fill-black text-black" : "w-3 h-3 text-zinc-200"} />
                  ))}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-zinc-650">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
