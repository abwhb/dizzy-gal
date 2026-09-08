import { categories } from "@/lib/content";

import { Photo } from "./ui";

export function Categories() {
  return (
    <section id="categories" className="scroll-mt-14 border-b border-line">
      <ul data-reveal-group className="grid md:grid-cols-3">
        {categories.map((category, index) => (
          <li
            key={category.title}
            className={`border-b border-line p-5 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6 ${index === 0 ? "" : ""}`}
          >
            <a href={category.href} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[15px] font-bold tracking-[-.02em]">{category.title}</h3>
                <span className="text-[12px] font-medium whitespace-nowrap text-mist">{category.count}</span>
              </div>
              <Photo
                label={category.imageLabel}
                src={category.image}
                tone={index === 1 ? "cool" : "warm"}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="mt-4 aspect-[5/4] rounded-[3px] transition-opacity duration-300 group-hover:opacity-90"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
