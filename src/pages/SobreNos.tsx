import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SobreNos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-8 text-center">Sobre Nós</h1>
          <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <p>
              A Menina Chick Boutique nasceu para valorizar a beleza, a autenticidade e o estilo de cada mulher. Somos uma boutique virtual criada com carinho na cidade de Januária, levando moda feminina moderna, elegante e cheia de personalidade para mulheres que gostam de se sentir confiantes em qualquer ocasião.
            </p>
            <p>
              Selecionamos cada peça com atenção aos detalhes, às tendências e, principalmente, ao conforto, porque acreditamos que se vestir bem vai muito além da aparência: é sobre se sentir bem consigo mesma. Aqui você encontra looks que transitam do casual ao sofisticado, perfeitos para o dia a dia ou momentos especiais.
            </p>
            <p>
              Mesmo sendo uma loja virtual, prezamos por um atendimento próximo, humano e atencioso, criando uma conexão real com nossas clientes. Nosso compromisso é oferecer qualidade, bom gosto e praticidade, para que sua experiência de compra seja leve, segura e especial.
            </p>
            <p className="font-semibold text-foreground text-lg">
              Menina Chick Boutique: moda feita para mulheres estilosas, confiantes e cheias de atitude.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SobreNos;
