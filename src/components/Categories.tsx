const categories = [
  { name: "Vestidos", count: 48, color: "bg-pink-soft" },
  { name: "Blusas", count: 36, color: "bg-secondary" },
  { name: "Calças", count: 24, color: "bg-muted" },
  { name: "Acessórios", count: 52, color: "bg-pink-light" },
];

const Categories = () => {
  return (
    <section id="categorias" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-2 block">
            Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
            Nossas Categorias
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className={`group relative ${category.color} rounded-2xl p-8 md:p-12 hover-lift overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {category.count} produtos
                </p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/10 group-hover:scale-150 transition-transform duration-500" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
